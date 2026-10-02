// js/products/fuente-auco-pesos.js - Lógica Financiera Fuente de Auco (Pesos)

function updateCuotasCount() {
    const countSelect = document.getElementById('cuotas-count-select');
    const count = parseInt(countSelect ? countSelect.value : '6', 10) || 6;

    for (let i = 1; i <= 6; i++) {
        const row = document.getElementById(`cuota-row-${i}`);
        if (row) {
            row.style.display = i <= count ? '' : 'none';
        }
    }
}

function calculateFuenteAucoPesos(triggeredBy = '') {
    const refUfInput = document.getElementById('ref-uf-input');
    const refClpInput = document.getElementById('ref-clp-input');
    const descPercentEl = document.getElementById('porcentaje-descuento-main');
    const descuentoUfInput = document.getElementById('descuento-uf-input');
    const descuentoClpInput = document.getElementById('descuento-clp-input');
    const capitalAnteriorUfInput = document.getElementById('capital-anterior-uf-input');
    const capitalAnteriorClpInput = document.getElementById('capital-anterior-clp-input');
    const valorNiUfDisplay = document.getElementById('valor-ni-uf');
    const valorNiClpInput = document.getElementById('valor-ni-clp-input');
    const piePercentEl = document.getElementById('pie-percent');
    const pieUfInput = document.getElementById('pie-uf');
    const pieClpInput = document.getElementById('pie-clp-input');
    const saldoFinanciarUfInput = document.getElementById('saldo-financiar-uf-input');
    const saldoFinanciarClpInput = document.getElementById('saldo-financiar-clp-input');

    let valorRealCLP = parseCLP(refClpInput && refClpInput.value ? refClpInput.value : '0');
    let descuentoCLP = parseCLP(descuentoClpInput && descuentoClpInput.value ? descuentoClpInput.value : '0');
    let capitalAnteriorCLP = parseCLP(capitalAnteriorClpInput && capitalAnteriorClpInput.value ? capitalAnteriorClpInput.value : '0');
    let valorPromoCLP = parseCLP(valorNiClpInput && valorNiClpInput.value ? valorNiClpInput.value : '0');
    let pieCLP = parseCLP(pieClpInput && pieClpInput.value ? pieClpInput.value : '0');

    // 1. Manejo de inputs del usuario

    // Valor Real
    if (triggeredBy === 'ref-uf' && refUfInput) {
        const ufVal = parseFloat(refUfInput.value) || 0;
        valorRealCLP = currentUFValue > 0 ? Math.round(ufVal * currentUFValue) : 0;
        if (refClpInput && document.activeElement !== refClpInput) {
            setCLPValue(refClpInput, valorRealCLP > 0 ? valorRealCLP : '');
        }
    } else if (triggeredBy === 'ref-clp' && refClpInput) {
        valorRealCLP = parseCLP(refClpInput.value);
        const ufVal = currentUFValue > 0 ? (valorRealCLP / currentUFValue) : 0;
        if (refUfInput) refUfInput.value = ufVal > 0 ? ufVal.toFixed(2) : '';
    }

    // Descuento % o Monto
    if (triggeredBy === 'desc-percent' && descPercentEl) {
        const percent = parseFloat(descPercentEl.value) || 0;
        descuentoCLP = valorRealCLP > 0 ? Math.round(valorRealCLP * (percent / 100)) : 0;
        if (descuentoClpInput) setCLPValue(descuentoClpInput, descuentoCLP > 0 ? descuentoCLP : '');
        if (descuentoUfInput) {
            const ufVal = currentUFValue > 0 && descuentoCLP > 0 ? (descuentoCLP / currentUFValue) : 0;
            descuentoUfInput.value = ufVal > 0 ? ufVal.toFixed(2) : '';
        }
    } else if (triggeredBy === 'desc-uf' && descuentoUfInput) {
        const ufVal = parseFloat(descuentoUfInput.value) || 0;
        descuentoCLP = currentUFValue > 0 ? Math.round(ufVal * currentUFValue) : 0;
        if (descuentoClpInput && document.activeElement !== descuentoClpInput) {
            setCLPValue(descuentoClpInput, descuentoCLP > 0 ? descuentoCLP : '');
        }
        if (descPercentEl && valorRealCLP > 0) {
            const p = (descuentoCLP / valorRealCLP) * 100;
            descPercentEl.value = Math.round(p * 10) / 10;
        }
    } else if (triggeredBy === 'desc-clp' && descuentoClpInput) {
        descuentoCLP = parseCLP(descuentoClpInput.value);
        const ufVal = currentUFValue > 0 ? (descuentoCLP / currentUFValue) : 0;
        if (descuentoUfInput) descuentoUfInput.value = ufVal > 0 ? ufVal.toFixed(2) : '';
        if (descPercentEl && valorRealCLP > 0) {
            const p = (descuentoCLP / valorRealCLP) * 100;
            descPercentEl.value = Math.round(p * 10) / 10;
        }
    } else if ((triggeredBy === 'ref-uf' || triggeredBy === 'ref-clp') && descPercentEl && parseFloat(descPercentEl.value) > 0) {
        const percent = parseFloat(descPercentEl.value) || 0;
        descuentoCLP = Math.round(valorRealCLP * (percent / 100));
        if (descuentoClpInput) setCLPValue(descuentoClpInput, descuentoCLP > 0 ? descuentoCLP : '');
        if (descuentoUfInput) {
            const ufVal = currentUFValue > 0 && descuentoCLP > 0 ? (descuentoCLP / currentUFValue) : 0;
            descuentoUfInput.value = ufVal > 0 ? ufVal.toFixed(2) : '';
        }
    }

    // Capital Anterior
    if (triggeredBy === 'cap-ant-uf' && capitalAnteriorUfInput) {
        const ufVal = parseFloat(capitalAnteriorUfInput.value) || 0;
        capitalAnteriorCLP = currentUFValue > 0 ? Math.round(ufVal * currentUFValue) : 0;
        if (capitalAnteriorClpInput && document.activeElement !== capitalAnteriorClpInput) {
            setCLPValue(capitalAnteriorClpInput, capitalAnteriorCLP > 0 ? capitalAnteriorCLP : '');
        }
    } else if (triggeredBy === 'cap-ant-clp' && capitalAnteriorClpInput) {
        capitalAnteriorCLP = parseCLP(capitalAnteriorClpInput.value);
        const ufVal = currentUFValue > 0 ? (capitalAnteriorCLP / currentUFValue) : 0;
        if (capitalAnteriorUfInput) capitalAnteriorUfInput.value = ufVal > 0 ? ufVal.toFixed(2) : '';
    }

    // 2. Valor Promocional = Valor Real - Descuento - Capital Anterior
    if (triggeredBy === 'ni-uf' && valorNiUfDisplay) {
        const ufVal = parseFloat(valorNiUfDisplay.value) || 0;
        valorPromoCLP = currentUFValue > 0 ? Math.round(ufVal * currentUFValue) : 0;
        if (valorNiClpInput && document.activeElement !== valorNiClpInput) {
            setCLPValue(valorNiClpInput, valorPromoCLP > 0 ? valorPromoCLP : '');
        }
    } else if (triggeredBy === 'ni-clp' && valorNiClpInput) {
        valorPromoCLP = parseCLP(valorNiClpInput.value);
        const ufVal = currentUFValue > 0 ? (valorPromoCLP / currentUFValue) : 0;
        if (valorNiUfDisplay) valorNiUfDisplay.value = ufVal > 0 ? ufVal.toFixed(2) : '';
    } else {
        valorPromoCLP = Math.max(0, valorRealCLP - descuentoCLP - capitalAnteriorCLP);
        if (valorNiClpInput && document.activeElement !== valorNiClpInput) {
            setCLPValue(valorNiClpInput, valorPromoCLP > 0 ? valorPromoCLP : '');
        }
        if (valorNiUfDisplay && document.activeElement !== valorNiUfDisplay) {
            const ufVal = currentUFValue > 0 && valorPromoCLP > 0 ? (valorPromoCLP / currentUFValue) : 0;
            valorNiUfDisplay.value = ufVal > 0 ? ufVal.toFixed(2) : '';
        }
    }

    // 3. Pie (por defecto 10% de Valor Promocional o editable)
    if (triggeredBy === 'pie-percent' && piePercentEl) {
        const percent = parseFloat(piePercentEl.value) || 0;
        pieCLP = valorPromoCLP > 0 ? Math.round(valorPromoCLP * (percent / 100)) : 0;
        if (pieClpInput) setCLPValue(pieClpInput, pieCLP > 0 ? pieCLP : '');
        if (pieUfInput) {
            const ufVal = currentUFValue > 0 && pieCLP > 0 ? (pieCLP / currentUFValue) : 0;
            pieUfInput.value = ufVal > 0 ? ufVal.toFixed(2) : '';
        }
    } else if (triggeredBy === 'pie-uf' && pieUfInput) {
        const ufVal = parseFloat(pieUfInput.value) || 0;
        pieCLP = currentUFValue > 0 ? Math.round(ufVal * currentUFValue) : 0;
        if (pieClpInput && document.activeElement !== pieClpInput) {
            setCLPValue(pieClpInput, pieCLP > 0 ? pieCLP : '');
        }
        if (piePercentEl && valorPromoCLP > 0) {
            const p = (pieCLP / valorPromoCLP) * 100;
            piePercentEl.value = Math.round(p * 10) / 10;
        }
    } else if (triggeredBy === 'pie-clp' && pieClpInput) {
        pieCLP = parseCLP(pieClpInput.value);
        if (pieUfInput) {
            const ufVal = currentUFValue > 0 && pieCLP > 0 ? (pieCLP / currentUFValue) : 0;
            pieUfInput.value = ufVal > 0 ? ufVal.toFixed(2) : '';
        }
        if (piePercentEl && valorPromoCLP > 0) {
            const p = (pieCLP / valorPromoCLP) * 100;
            piePercentEl.value = Math.round(p * 10) / 10;
        }
    } else if (triggeredBy !== 'pie-uf' && triggeredBy !== 'pie-clp') {
        const percent = piePercentEl && parseFloat(piePercentEl.value) >= 0 ? parseFloat(piePercentEl.value) : 10;
        pieCLP = valorPromoCLP > 0 ? Math.round(valorPromoCLP * (percent / 100)) : 0;
        if (pieClpInput && document.activeElement !== pieClpInput) {
            setCLPValue(pieClpInput, pieCLP > 0 ? pieCLP : '');
        }
        if (pieUfInput && document.activeElement !== pieUfInput) {
            const ufVal = currentUFValue > 0 && pieCLP > 0 ? (pieCLP / currentUFValue) : 0;
            pieUfInput.value = ufVal > 0 ? ufVal.toFixed(2) : '';
        }
    }

    // 4. Saldo a Financiar = Valor Promocional - Pie
    let saldoCLP = 0;
    if (triggeredBy === 'saldo-uf' && saldoFinanciarUfInput) {
        const ufVal = parseFloat(saldoFinanciarUfInput.value) || 0;
        saldoCLP = currentUFValue > 0 ? Math.round(ufVal * currentUFValue) : 0;
        if (saldoFinanciarClpInput && document.activeElement !== saldoFinanciarClpInput) {
            setCLPValue(saldoFinanciarClpInput, saldoCLP > 0 ? saldoCLP : '');
        }
    } else if (triggeredBy === 'saldo-clp' && saldoFinanciarClpInput) {
        saldoCLP = parseCLP(saldoFinanciarClpInput.value);
        const ufVal = currentUFValue > 0 ? (saldoCLP / currentUFValue) : 0;
        if (saldoFinanciarUfInput) saldoFinanciarUfInput.value = ufVal > 0 ? ufVal.toFixed(2) : '';
    } else {
        saldoCLP = Math.max(0, valorPromoCLP - pieCLP);
        if (saldoFinanciarClpInput && document.activeElement !== saldoFinanciarClpInput) {
            setCLPValue(saldoFinanciarClpInput, saldoCLP > 0 ? saldoCLP : '');
        }
        if (saldoFinanciarUfInput && document.activeElement !== saldoFinanciarUfInput) {
            const ufVal = currentUFValue > 0 && saldoCLP > 0 ? (saldoCLP / currentUFValue) : 0;
            saldoFinanciarUfInput.value = ufVal > 0 ? ufVal.toFixed(2) : '';
        }
    }

    // 5. Sincronización de cuotas rellenables
    for (let i = 1; i <= 6; i++) {
        const ufCuota = document.getElementById(`cuota-${i}-uf`);
        const clpCuota = document.getElementById(`cuota-${i}-clp`);

        if (triggeredBy === `cuota-${i}-uf` && ufCuota) {
            const ufVal = parseFloat(ufCuota.value) || 0;
            const clpVal = currentUFValue > 0 ? Math.round(ufVal * currentUFValue) : 0;
            if (clpCuota) setCLPValue(clpCuota, clpVal > 0 ? clpVal : '');
        } else if (triggeredBy === `cuota-${i}-clp` && clpCuota) {
            const clpVal = parseCLP(clpCuota.value);
            const ufVal = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
            if (ufCuota) ufCuota.value = ufVal > 0 ? ufVal.toFixed(2) : '';
        } else if (triggeredBy === 'uf-manual' || triggeredBy === 'init') {
            if (clpCuota && parseCLP(clpCuota.value) > 0 && ufCuota) {
                const ufVal = (parseCLP(clpCuota.value) / currentUFValue);
                ufCuota.value = ufVal.toFixed(2);
            }
        }
    }

    // Sincronizar conversiones UF al inicializar o cambiar UF
    if (triggeredBy === 'uf-manual' || triggeredBy === 'init') {
        if (refUfInput && valorRealCLP > 0) refUfInput.value = (valorRealCLP / currentUFValue).toFixed(2);
        if (descuentoUfInput && descuentoCLP > 0) descuentoUfInput.value = (descuentoCLP / currentUFValue).toFixed(2);
        if (capitalAnteriorUfInput && capitalAnteriorCLP > 0) capitalAnteriorUfInput.value = (capitalAnteriorCLP / currentUFValue).toFixed(2);
        if (valorNiUfDisplay && valorPromoCLP > 0) valorNiUfDisplay.value = (valorPromoCLP / currentUFValue).toFixed(2);
        if (pieUfInput && pieCLP > 0) pieUfInput.value = (pieCLP / currentUFValue).toFixed(2);
        if (saldoFinanciarUfInput && saldoCLP > 0) saldoFinanciarUfInput.value = (saldoCLP / currentUFValue).toFixed(2);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initDOMElements();

    const today = new Date();
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        dateEl.textContent = today.toLocaleDateString('es-CL', { 
            day: '2-digit', month: '2-digit', year: 'numeric' 
        }).replace(/\//g, '-');
    }

    const displayEl = document.getElementById('park-name-display') || document.getElementById('park-display');
    if (displayEl) {
        displayEl.textContent = 'PARQUE AUCO';
    }

    // Selector de tipo de producto superior para navegación
    const productSelector = document.getElementById('product-type') || document.getElementById('product-type-select');
    if (productSelector) {
        productSelector.addEventListener('change', () => {
            const productPageMap = {
                'sepultacion': 'index.html',
                'sepultura-auco': 'sepultura-auco.html',
                'sepultura-auco-uf': 'sepultura-auco.html',
                'sepultura-auco-pesos': 'sepultura-auco.html',
                'jardin-auco': 'jardin-auco.html',
                'jardin-auco-uf': 'jardin-auco.html',
                'jardin-auco-pesos': 'jardin-auco.html',
                'fuente-auco-uf': 'fuente-auco-uf.html',
                'fuente-auco-pesos': 'fuente-auco-pesos.html',
                'cremacion': 'cremacion.html',
                'aumento-capacidad': 'aumento-capacidad.html',
                'mantencion': 'mantencion.html',
                'servicios-funerarios': 'servicios-funerarios.html'
            };
            window.location.href = productPageMap[productSelector.value] || 'fuente-auco-pesos.html';
        });
    }

    // Capacidad y Reducciones
    const capacidadSelect = document.getElementById('capacidad-select');
    const reduccionesDisplay = document.getElementById('reducciones-display');
    const reduccionesMap = {
        2: 4, // Capacidad 2 -> 4 Reducciones
        4: 8  // Capacidad 4 -> 8 Reducciones
    };

    function updateFuenteReducciones(cap) {
        if (!reduccionesDisplay) return;
        const count = reduccionesMap[cap] !== undefined ? reduccionesMap[cap] : 4;
        reduccionesDisplay.textContent = `${count} Reducciones`;
    }

    if (capacidadSelect) {
        capacidadSelect.addEventListener('change', () => {
            const cap = parseInt(capacidadSelect.value, 10) || 2;
            updateFuenteReducciones(cap);
        });
        const initialCap = parseInt(capacidadSelect.value, 10) || 2;
        updateFuenteReducciones(initialCap);
    }

    // Event listeners de inputs
    const ufInput = document.getElementById('uf-value-input');
    if (ufInput) {
        ufInput.addEventListener('input', () => {
            const val = parseFloat(ufInput.value);
            if (!isNaN(val) && val > 0) {
                currentUFValue = val;
                calculateFuenteAucoPesos('uf-manual');
            }
        });
    }

    const refClpInput = document.getElementById('ref-clp-input');
    if (refClpInput) {
        refClpInput.addEventListener('input', () => calculateFuenteAucoPesos('ref-clp'));
        refClpInput.addEventListener('blur', () => {
            const val = parseCLP(refClpInput.value);
            if (val > 0) setCLPValue(refClpInput, val);
        });
    }

    const refUfInput = document.getElementById('ref-uf-input');
    if (refUfInput) refUfInput.addEventListener('input', () => calculateFuenteAucoPesos('ref-uf'));

    const descPercentEl = document.getElementById('porcentaje-descuento-main');
    if (descPercentEl) descPercentEl.addEventListener('input', () => calculateFuenteAucoPesos('desc-percent'));

    const descuentoClpInput = document.getElementById('descuento-clp-input');
    if (descuentoClpInput) {
        descuentoClpInput.addEventListener('input', () => calculateFuenteAucoPesos('desc-clp'));
        descuentoClpInput.addEventListener('blur', () => {
            const val = parseCLP(descuentoClpInput.value);
            if (val > 0) setCLPValue(descuentoClpInput, val);
        });
    }

    const descuentoUfInput = document.getElementById('descuento-uf-input');
    if (descuentoUfInput) descuentoUfInput.addEventListener('input', () => calculateFuenteAucoPesos('desc-uf'));

    const capitalAnteriorClpInput = document.getElementById('capital-anterior-clp-input');
    if (capitalAnteriorClpInput) {
        capitalAnteriorClpInput.addEventListener('input', () => calculateFuenteAucoPesos('cap-ant-clp'));
        capitalAnteriorClpInput.addEventListener('blur', () => {
            const val = parseCLP(capitalAnteriorClpInput.value);
            if (val > 0) setCLPValue(capitalAnteriorClpInput, val);
        });
    }

    const capitalAnteriorUfInput = document.getElementById('capital-anterior-uf-input');
    if (capitalAnteriorUfInput) capitalAnteriorUfInput.addEventListener('input', () => calculateFuenteAucoPesos('cap-ant-uf'));

    const valorNiClpInput = document.getElementById('valor-ni-clp-input');
    if (valorNiClpInput) {
        valorNiClpInput.addEventListener('input', () => calculateFuenteAucoPesos('ni-clp'));
        valorNiClpInput.addEventListener('blur', () => {
            const val = parseCLP(valorNiClpInput.value);
            if (val > 0) setCLPValue(valorNiClpInput, val);
        });
    }

    const valorNiUf = document.getElementById('valor-ni-uf');
    if (valorNiUf) valorNiUf.addEventListener('input', () => calculateFuenteAucoPesos('ni-uf'));

    const piePercentEl = document.getElementById('pie-percent');
    if (piePercentEl) piePercentEl.addEventListener('input', () => calculateFuenteAucoPesos('pie-percent'));

    const pieClpInput = document.getElementById('pie-clp-input');
    if (pieClpInput) {
        pieClpInput.addEventListener('input', () => calculateFuenteAucoPesos('pie-clp'));
        pieClpInput.addEventListener('blur', () => {
            const val = parseCLP(pieClpInput.value);
            if (val > 0) setCLPValue(pieClpInput, val);
        });
    }

    const pieUfInput = document.getElementById('pie-uf');
    if (pieUfInput) pieUfInput.addEventListener('input', () => calculateFuenteAucoPesos('pie-uf'));

    const saldoFinanciarClpInput = document.getElementById('saldo-financiar-clp-input');
    if (saldoFinanciarClpInput) {
        saldoFinanciarClpInput.addEventListener('input', () => calculateFuenteAucoPesos('saldo-clp'));
        saldoFinanciarClpInput.addEventListener('blur', () => {
            const val = parseCLP(saldoFinanciarClpInput.value);
            if (val > 0) setCLPValue(saldoFinanciarClpInput, val);
        });
    }

    const saldoFinanciarUfInput = document.getElementById('saldo-financiar-uf-input');
    if (saldoFinanciarUfInput) saldoFinanciarUfInput.addEventListener('input', () => calculateFuenteAucoPesos('saldo-uf'));

    // Selector de cantidad de cuotas a mostrar
    const countSelect = document.getElementById('cuotas-count-select');
    if (countSelect) {
        countSelect.addEventListener('change', updateCuotasCount);
        updateCuotasCount();
    }

    for (let i = 1; i <= 6; i++) {
        const ufCuota = document.getElementById(`cuota-${i}-uf`);
        const clpCuota = document.getElementById(`cuota-${i}-clp`);

        if (clpCuota) {
            clpCuota.addEventListener('input', () => calculateFuenteAucoPesos(`cuota-${i}-clp`));
            clpCuota.addEventListener('blur', () => {
                const val = parseCLP(clpCuota.value);
                if (val > 0) setCLPValue(clpCuota, val);
            });
        }
        if (ufCuota) ufCuota.addEventListener('input', () => calculateFuenteAucoPesos(`cuota-${i}-uf`));
    }

    fetchUFValue().then(() => {
        calculateFuenteAucoPesos('init');
    }).catch(() => {
        calculateFuenteAucoPesos('init');
    });
});
