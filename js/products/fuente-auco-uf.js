// js/products/fuente-auco-uf.js - Lógica Financiera Fuente de Auco (UF)

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

function calculateFuenteAucoUF(triggeredBy = '') {
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

    let valorRealUF = parseFloat(refUfInput && refUfInput.value ? refUfInput.value : '0') || 0;
    let descuentoUF = parseFloat(descuentoUfInput && descuentoUfInput.value ? descuentoUfInput.value : '0') || 0;
    let capitalAnteriorUF = parseFloat(capitalAnteriorUfInput && capitalAnteriorUfInput.value ? capitalAnteriorUfInput.value : '0') || 0;
    let valorPromoUF = parseFloat(valorNiUfDisplay && valorNiUfDisplay.value ? valorNiUfDisplay.value : '0') || 0;
    let pieUF = parseFloat(pieUfInput && pieUfInput.value ? pieUfInput.value : '0') || 0;

    // 1. Manejo de inputs del usuario

    // Valor Real
    if (triggeredBy === 'ref-clp' && refClpInput) {
        const clpVal = parseCLP(refClpInput.value);
        valorRealUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (refUfInput) refUfInput.value = valorRealUF > 0 ? valorRealUF.toFixed(2) : '';
    } else if (triggeredBy === 'ref-uf' && refUfInput) {
        valorRealUF = parseFloat(refUfInput.value) || 0;
        if (refClpInput && document.activeElement !== refClpInput) {
            setCLPValue(refClpInput, valorRealUF > 0 ? Math.round(valorRealUF * currentUFValue) : '');
        }
    }

    // Descuento % o Monto
    if (triggeredBy === 'desc-percent' && descPercentEl) {
        const percent = parseFloat(descPercentEl.value) || 0;
        descuentoUF = valorRealUF > 0 ? (valorRealUF * (percent / 100)) : 0;
        if (descuentoUfInput) descuentoUfInput.value = descuentoUF > 0 ? descuentoUF.toFixed(2) : '';
        if (descuentoClpInput) setCLPValue(descuentoClpInput, descuentoUF > 0 ? Math.round(descuentoUF * currentUFValue) : '');
    } else if (triggeredBy === 'desc-clp' && descuentoClpInput) {
        const clpVal = parseCLP(descuentoClpInput.value);
        descuentoUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (descuentoUfInput) descuentoUfInput.value = descuentoUF > 0 ? descuentoUF.toFixed(2) : '';
        if (descPercentEl && valorRealUF > 0) {
            const p = (descuentoUF / valorRealUF) * 100;
            descPercentEl.value = Math.round(p * 10) / 10;
        }
    } else if (triggeredBy === 'desc-uf' && descuentoUfInput) {
        descuentoUF = parseFloat(descuentoUfInput.value) || 0;
        if (descuentoClpInput && document.activeElement !== descuentoClpInput) {
            setCLPValue(descuentoClpInput, descuentoUF > 0 ? Math.round(descuentoUF * currentUFValue) : '');
        }
        if (descPercentEl && valorRealUF > 0) {
            const p = (descuentoUF / valorRealUF) * 100;
            descPercentEl.value = Math.round(p * 10) / 10;
        }
    } else if ((triggeredBy === 'ref-uf' || triggeredBy === 'ref-clp') && descPercentEl && parseFloat(descPercentEl.value) > 0) {
        const percent = parseFloat(descPercentEl.value) || 0;
        descuentoUF = valorRealUF * (percent / 100);
        if (descuentoUfInput) descuentoUfInput.value = descuentoUF > 0 ? descuentoUF.toFixed(2) : '';
        if (descuentoClpInput) setCLPValue(descuentoClpInput, descuentoUF > 0 ? Math.round(descuentoUF * currentUFValue) : '');
    }

    // Capital Anterior
    if (triggeredBy === 'cap-ant-clp' && capitalAnteriorClpInput) {
        const clpVal = parseCLP(capitalAnteriorClpInput.value);
        capitalAnteriorUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (capitalAnteriorUfInput) capitalAnteriorUfInput.value = capitalAnteriorUF > 0 ? capitalAnteriorUF.toFixed(2) : '';
    } else if (triggeredBy === 'cap-ant-uf' && capitalAnteriorUfInput) {
        capitalAnteriorUF = parseFloat(capitalAnteriorUfInput.value) || 0;
        if (capitalAnteriorClpInput && document.activeElement !== capitalAnteriorClpInput) {
            setCLPValue(capitalAnteriorClpInput, capitalAnteriorUF > 0 ? Math.round(capitalAnteriorUF * currentUFValue) : '');
        }
    }

    // 2. Valor Promocional = Valor Real - Descuento - Capital Anterior
    if (triggeredBy === 'ni-clp' && valorNiClpInput) {
        const clpVal = parseCLP(valorNiClpInput.value);
        valorPromoUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (valorNiUfDisplay) valorNiUfDisplay.value = valorPromoUF > 0 ? valorPromoUF.toFixed(2) : '';
    } else if (triggeredBy === 'ni-uf' && valorNiUfDisplay) {
        valorPromoUF = parseFloat(valorNiUfDisplay.value) || 0;
        if (valorNiClpInput && document.activeElement !== valorNiClpInput) {
            setCLPValue(valorNiClpInput, valorPromoUF > 0 ? Math.round(valorPromoUF * currentUFValue) : '');
        }
    } else {
        valorPromoUF = Math.max(0, valorRealUF - descuentoUF - capitalAnteriorUF);
        if (valorNiUfDisplay && document.activeElement !== valorNiUfDisplay) {
            valorNiUfDisplay.value = valorPromoUF > 0 ? valorPromoUF.toFixed(2) : '';
        }
        if (valorNiClpInput && document.activeElement !== valorNiClpInput) {
            setCLPValue(valorNiClpInput, valorPromoUF > 0 ? Math.round(valorPromoUF * currentUFValue) : '');
        }
    }

    // 3. Pie (por defecto 10% de Valor Promocional o editable)
    if (triggeredBy === 'pie-percent' && piePercentEl) {
        const percent = parseFloat(piePercentEl.value) || 0;
        pieUF = valorPromoUF > 0 ? (valorPromoUF * (percent / 100)) : 0;
        if (pieUfInput) pieUfInput.value = pieUF > 0 ? pieUF.toFixed(2) : '';
        if (pieClpInput) setCLPValue(pieClpInput, pieUF > 0 ? Math.round(pieUF * currentUFValue) : '');
    } else if (triggeredBy === 'pie-clp' && pieClpInput) {
        const clpVal = parseCLP(pieClpInput.value);
        pieUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (pieUfInput) pieUfInput.value = pieUF > 0 ? pieUF.toFixed(2) : '';
        if (piePercentEl && valorPromoUF > 0) {
            const p = (pieUF / valorPromoUF) * 100;
            piePercentEl.value = Math.round(p * 10) / 10;
        }
    } else if (triggeredBy === 'pie-uf' && pieUfInput) {
        pieUF = parseFloat(pieUfInput.value) || 0;
        if (pieClpInput && document.activeElement !== pieClpInput) {
            setCLPValue(pieClpInput, pieUF > 0 ? Math.round(pieUF * currentUFValue) : '');
        }
        if (piePercentEl && valorPromoUF > 0) {
            const p = (pieUF / valorPromoUF) * 100;
            piePercentEl.value = Math.round(p * 10) / 10;
        }
    } else if (triggeredBy !== 'pie-clp' && triggeredBy !== 'pie-uf') {
        const percent = piePercentEl && parseFloat(piePercentEl.value) >= 0 ? parseFloat(piePercentEl.value) : 10;
        pieUF = valorPromoUF > 0 ? (valorPromoUF * (percent / 100)) : 0;
        if (pieUfInput && document.activeElement !== pieUfInput) {
            pieUfInput.value = pieUF > 0 ? pieUF.toFixed(2) : '';
        }
        if (pieClpInput && document.activeElement !== pieClpInput) {
            setCLPValue(pieClpInput, pieUF > 0 ? Math.round(pieUF * currentUFValue) : '');
        }
    }

    // 4. Saldo a Financiar = Valor Promocional - Pie
    let saldoUF = 0;
    if (triggeredBy === 'saldo-clp' && saldoFinanciarClpInput) {
        const clpVal = parseCLP(saldoFinanciarClpInput.value);
        saldoUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (saldoFinanciarUfInput) saldoFinanciarUfInput.value = saldoUF > 0 ? saldoUF.toFixed(2) : '';
    } else if (triggeredBy === 'saldo-uf' && saldoFinanciarUfInput) {
        saldoUF = parseFloat(saldoFinanciarUfInput.value) || 0;
        if (saldoFinanciarClpInput && document.activeElement !== saldoFinanciarClpInput) {
            setCLPValue(saldoFinanciarClpInput, saldoUF > 0 ? Math.round(saldoUF * currentUFValue) : '');
        }
    } else {
        saldoUF = Math.max(0, valorPromoUF - pieUF);
        if (saldoFinanciarUfInput && document.activeElement !== saldoFinanciarUfInput) {
            saldoFinanciarUfInput.value = saldoUF > 0 ? saldoUF.toFixed(2) : '';
        }
        if (saldoFinanciarClpInput && document.activeElement !== saldoFinanciarClpInput) {
            setCLPValue(saldoFinanciarClpInput, saldoUF > 0 ? Math.round(saldoUF * currentUFValue) : '');
        }
    }

    // 5. Sincronización de cuotas rellenables
    for (let i = 1; i <= 6; i++) {
        const ufCuota = document.getElementById(`cuota-${i}-uf`);
        const clpCuota = document.getElementById(`cuota-${i}-clp`);

        if (triggeredBy === `cuota-${i}-clp` && clpCuota) {
            const clpVal = parseCLP(clpCuota.value);
            const ufVal = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
            if (ufCuota) ufCuota.value = ufVal > 0 ? ufVal.toFixed(2) : '';
        } else if (triggeredBy === `cuota-${i}-uf` && ufCuota) {
            const ufVal = parseFloat(ufCuota.value) || 0;
            if (clpCuota && document.activeElement !== clpCuota) {
                setCLPValue(clpCuota, ufVal > 0 ? Math.round(ufVal * currentUFValue) : '');
            }
        } else if (triggeredBy === 'uf-manual' || triggeredBy === 'init') {
            if (ufCuota && parseFloat(ufCuota.value) > 0 && clpCuota) {
                setCLPValue(clpCuota, Math.round(parseFloat(ufCuota.value) * currentUFValue));
            }
        }
    }

    // Sincronizar UF al inicializar
    if (triggeredBy === 'uf-manual' || triggeredBy === 'init') {
        if (refClpInput && valorRealUF > 0) setCLPValue(refClpInput, Math.round(valorRealUF * currentUFValue));
        if (descuentoClpInput && descuentoUF > 0) setCLPValue(descuentoClpInput, Math.round(descuentoUF * currentUFValue));
        if (capitalAnteriorClpInput && capitalAnteriorUF > 0) setCLPValue(capitalAnteriorClpInput, Math.round(capitalAnteriorUF * currentUFValue));
        if (valorNiClpInput && valorPromoUF > 0) setCLPValue(valorNiClpInput, Math.round(valorPromoUF * currentUFValue));
        if (pieClpInput && pieUF > 0) setCLPValue(pieClpInput, Math.round(pieUF * currentUFValue));
        if (saldoFinanciarClpInput && saldoUF > 0) setCLPValue(saldoFinanciarClpInput, Math.round(saldoUF * currentUFValue));
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
            window.location.href = productPageMap[productSelector.value] || 'fuente-auco-uf.html';
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
                calculateFuenteAucoUF('uf-manual');
            }
        });
    }

    const refUfInput = document.getElementById('ref-uf-input');
    if (refUfInput) refUfInput.addEventListener('input', () => calculateFuenteAucoUF('ref-uf'));

    const refClpInput = document.getElementById('ref-clp-input');
    if (refClpInput) {
        refClpInput.addEventListener('input', () => calculateFuenteAucoUF('ref-clp'));
        refClpInput.addEventListener('blur', () => {
            const val = parseCLP(refClpInput.value);
            if (val > 0) setCLPValue(refClpInput, val);
        });
    }

    const descPercentEl = document.getElementById('porcentaje-descuento-main');
    if (descPercentEl) descPercentEl.addEventListener('input', () => calculateFuenteAucoUF('desc-percent'));

    const descuentoUfInput = document.getElementById('descuento-uf-input');
    if (descuentoUfInput) descuentoUfInput.addEventListener('input', () => calculateFuenteAucoUF('desc-uf'));

    const descuentoClpInput = document.getElementById('descuento-clp-input');
    if (descuentoClpInput) {
        descuentoClpInput.addEventListener('input', () => calculateFuenteAucoUF('desc-clp'));
        descuentoClpInput.addEventListener('blur', () => {
            const val = parseCLP(descuentoClpInput.value);
            if (val > 0) setCLPValue(descuentoClpInput, val);
        });
    }

    const capitalAnteriorUfInput = document.getElementById('capital-anterior-uf-input');
    if (capitalAnteriorUfInput) capitalAnteriorUfInput.addEventListener('input', () => calculateFuenteAucoUF('cap-ant-uf'));

    const capitalAnteriorClpInput = document.getElementById('capital-anterior-clp-input');
    if (capitalAnteriorClpInput) {
        capitalAnteriorClpInput.addEventListener('input', () => calculateFuenteAucoUF('cap-ant-clp'));
        capitalAnteriorClpInput.addEventListener('blur', () => {
            const val = parseCLP(capitalAnteriorClpInput.value);
            if (val > 0) setCLPValue(capitalAnteriorClpInput, val);
        });
    }

    const valorNiUf = document.getElementById('valor-ni-uf');
    if (valorNiUf) valorNiUf.addEventListener('input', () => calculateFuenteAucoUF('ni-uf'));

    const valorNiClpInput = document.getElementById('valor-ni-clp-input');
    if (valorNiClpInput) {
        valorNiClpInput.addEventListener('input', () => calculateFuenteAucoUF('ni-clp'));
        valorNiClpInput.addEventListener('blur', () => {
            const val = parseCLP(valorNiClpInput.value);
            if (val > 0) setCLPValue(valorNiClpInput, val);
        });
    }

    const piePercentEl = document.getElementById('pie-percent');
    if (piePercentEl) piePercentEl.addEventListener('input', () => calculateFuenteAucoUF('pie-percent'));

    const pieUfInput = document.getElementById('pie-uf');
    if (pieUfInput) pieUfInput.addEventListener('input', () => calculateFuenteAucoUF('pie-uf'));

    const pieClpInput = document.getElementById('pie-clp-input');
    if (pieClpInput) {
        pieClpInput.addEventListener('input', () => calculateFuenteAucoUF('pie-clp'));
        pieClpInput.addEventListener('blur', () => {
            const val = parseCLP(pieClpInput.value);
            if (val > 0) setCLPValue(pieClpInput, val);
        });
    }

    const saldoFinanciarUfInput = document.getElementById('saldo-financiar-uf-input');
    if (saldoFinanciarUfInput) saldoFinanciarUfInput.addEventListener('input', () => calculateFuenteAucoUF('saldo-uf'));

    const saldoFinanciarClpInput = document.getElementById('saldo-financiar-clp-input');
    if (saldoFinanciarClpInput) {
        saldoFinanciarClpInput.addEventListener('input', () => calculateFuenteAucoUF('saldo-clp'));
        saldoFinanciarClpInput.addEventListener('blur', () => {
            const val = parseCLP(saldoFinanciarClpInput.value);
            if (val > 0) setCLPValue(saldoFinanciarClpInput, val);
        });
    }

    // Selector de cantidad de cuotas a mostrar
    const countSelect = document.getElementById('cuotas-count-select');
    if (countSelect) {
        countSelect.addEventListener('change', updateCuotasCount);
        updateCuotasCount();
    }

    for (let i = 1; i <= 6; i++) {
        const ufCuota = document.getElementById(`cuota-${i}-uf`);
        const clpCuota = document.getElementById(`cuota-${i}-clp`);

        if (ufCuota) ufCuota.addEventListener('input', () => calculateFuenteAucoUF(`cuota-${i}-uf`));
        if (clpCuota) {
            clpCuota.addEventListener('input', () => calculateFuenteAucoUF(`cuota-${i}-clp`));
            clpCuota.addEventListener('blur', () => {
                const val = parseCLP(clpCuota.value);
                if (val > 0) setCLPValue(clpCuota, val);
            });
        }
    }

    fetchUFValue().then(() => {
        calculateFuenteAucoUF('init');
    }).catch(() => {
        calculateFuenteAucoUF('init');
    });
});
