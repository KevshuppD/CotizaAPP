// js/products/jardin-auco-pesos.js - Lógica Financiera Jardín Familiar Parque Auco (Pesos)

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

function calculateJardinAucoPesos(triggeredBy = '') {
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
        const ufVal = currentUFValue > 0 ? (pieCLP / currentUFValue) : 0;
        if (pieUfInput) pieUfInput.value = ufVal > 0 ? ufVal.toFixed(2) : '';
        if (piePercentEl && valorPromoCLP > 0) {
            const p = (pieCLP / valorPromoCLP) * 100;
            piePercentEl.value = Math.round(p * 10) / 10;
        }
    } else if (valorPromoCLP > 0 && piePercentEl && parseFloat(piePercentEl.value) > 0 && triggeredBy !== 'pie-uf' && triggeredBy !== 'pie-clp' && triggeredBy !== 'saldo-uf' && triggeredBy !== 'saldo-clp') {
        const percent = parseFloat(piePercentEl.value) || 0;
        pieCLP = Math.round(valorPromoCLP * (percent / 100));
        if (pieClpInput && document.activeElement !== pieClpInput) setCLPValue(pieClpInput, pieCLP > 0 ? pieCLP : '');
        if (pieUfInput && document.activeElement !== pieUfInput) {
            const ufVal = currentUFValue > 0 && pieCLP > 0 ? (pieCLP / currentUFValue) : 0;
            pieUfInput.value = ufVal > 0 ? ufVal.toFixed(2) : '';
        }
    }

    // 4. Saldo a financiar = Valor Promocional - Pie
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

    // 5. Cuotas Editables (1 al 6)
    for (let i = 1; i <= 6; i++) {
        const ufCuota = document.getElementById(`cuota-${i}-uf`);
        const clpCuota = document.getElementById(`cuota-${i}-clp`);

        if (triggeredBy === `cuota-${i}-clp` && clpCuota) {
            const val = parseCLP(clpCuota.value);
            const u = currentUFValue > 0 ? (val / currentUFValue) : 0;
            if (ufCuota) ufCuota.value = u > 0 ? u.toFixed(2) : '';
        } else if (triggeredBy === `cuota-${i}-uf` && ufCuota) {
            const u = parseFloat(ufCuota.value) || 0;
            if (clpCuota && document.activeElement !== clpCuota) {
                setCLPValue(clpCuota, u > 0 ? Math.round(u * currentUFValue) : '');
            }
        }
    }

    // Sincronizar conversiones si cambió la UF
    if (triggeredBy === 'uf-manual' || triggeredBy === 'init') {
        if (refUfInput && valorRealCLP > 0) refUfInput.value = (valorRealCLP / currentUFValue).toFixed(2);
        if (descuentoUfInput && descuentoCLP > 0) descuentoUfInput.value = (descuentoCLP / currentUFValue).toFixed(2);
        if (capitalAnteriorUfInput && capitalAnteriorCLP > 0) capitalAnteriorUfInput.value = (capitalAnteriorCLP / currentUFValue).toFixed(2);
        if (valorNiUfDisplay && valorPromoCLP > 0) valorNiUfDisplay.value = (valorPromoCLP / currentUFValue).toFixed(2);
        if (pieUfInput && pieCLP > 0) pieUfInput.value = (pieCLP / currentUFValue).toFixed(2);
        if (saldoFinanciarUfInput && saldoCLP > 0) saldoFinanciarUfInput.value = (saldoCLP / currentUFValue).toFixed(2);

        for (let i = 1; i <= 6; i++) {
            const ufCuota = document.getElementById(`cuota-${i}-uf`);
            const clpCuota = document.getElementById(`cuota-${i}-clp`);
            if (ufCuota && clpCuota) {
                const u = parseFloat(ufCuota.value) || 0;
                if (u > 0) setCLPValue(clpCuota, Math.round(u * currentUFValue));
            }
        }
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
                'sepultura-auco-uf': 'sepultura-auco-uf.html',
                'sepultura-auco-pesos': 'sepultura-auco-pesos.html',
                'jardin-auco-uf': 'jardin-auco-uf.html',
                'jardin-auco-pesos': 'jardin-auco-pesos.html',
                'cremacion': 'cremacion.html',
                'aumento-capacidad': 'aumento-capacidad.html',
                'mantencion': 'mantencion.html'
            };
            window.location.href = productPageMap[productSelector.value] || 'jardin-auco-pesos.html';
        });
    }

    // Event listeners de inputs
    const ufInput = document.getElementById('uf-value-input');
    if (ufInput) {
        ufInput.addEventListener('input', () => {
            const val = parseFloat(ufInput.value);
            if (!isNaN(val) && val > 0) {
                currentUFValue = val;
                calculateJardinAucoPesos('uf-manual');
            }
        });
    }

    const refUfInput = document.getElementById('ref-uf-input');
    if (refUfInput) refUfInput.addEventListener('input', () => calculateJardinAucoPesos('ref-uf'));

    const refClpInput = document.getElementById('ref-clp-input');
    if (refClpInput) {
        refClpInput.addEventListener('input', () => calculateJardinAucoPesos('ref-clp'));
        refClpInput.addEventListener('blur', () => {
            const val = parseCLP(refClpInput.value);
            if (val > 0) setCLPValue(refClpInput, val);
        });
    }

    const descPercentEl = document.getElementById('porcentaje-descuento-main');
    if (descPercentEl) descPercentEl.addEventListener('input', () => calculateJardinAucoPesos('desc-percent'));

    const descuentoUfInput = document.getElementById('descuento-uf-input');
    if (descuentoUfInput) descuentoUfInput.addEventListener('input', () => calculateJardinAucoPesos('desc-uf'));

    const descuentoClpInput = document.getElementById('descuento-clp-input');
    if (descuentoClpInput) {
        descuentoClpInput.addEventListener('input', () => calculateJardinAucoPesos('desc-clp'));
        descuentoClpInput.addEventListener('blur', () => {
            const val = parseCLP(descuentoClpInput.value);
            if (val > 0) setCLPValue(descuentoClpInput, val);
        });
    }

    const capitalAnteriorUfInput = document.getElementById('capital-anterior-uf-input');
    if (capitalAnteriorUfInput) capitalAnteriorUfInput.addEventListener('input', () => calculateJardinAucoPesos('cap-ant-uf'));

    const capitalAnteriorClpInput = document.getElementById('capital-anterior-clp-input');
    if (capitalAnteriorClpInput) {
        capitalAnteriorClpInput.addEventListener('input', () => calculateJardinAucoPesos('cap-ant-clp'));
        capitalAnteriorClpInput.addEventListener('blur', () => {
            const val = parseCLP(capitalAnteriorClpInput.value);
            if (val > 0) setCLPValue(capitalAnteriorClpInput, val);
        });
    }

    const valorNiUf = document.getElementById('valor-ni-uf');
    if (valorNiUf) valorNiUf.addEventListener('input', () => calculateJardinAucoPesos('ni-uf'));

    const valorNiClpInput = document.getElementById('valor-ni-clp-input');
    if (valorNiClpInput) {
        valorNiClpInput.addEventListener('input', () => calculateJardinAucoPesos('ni-clp'));
        valorNiClpInput.addEventListener('blur', () => {
            const val = parseCLP(valorNiClpInput.value);
            if (val > 0) setCLPValue(valorNiClpInput, val);
        });
    }

    const piePercentEl = document.getElementById('pie-percent');
    if (piePercentEl) piePercentEl.addEventListener('input', () => calculateJardinAucoPesos('pie-percent'));

    const pieUfInput = document.getElementById('pie-uf');
    if (pieUfInput) pieUfInput.addEventListener('input', () => calculateJardinAucoPesos('pie-uf'));

    const pieClpInput = document.getElementById('pie-clp-input');
    if (pieClpInput) {
        pieClpInput.addEventListener('input', () => calculateJardinAucoPesos('pie-clp'));
        pieClpInput.addEventListener('blur', () => {
            const val = parseCLP(pieClpInput.value);
            if (val > 0) setCLPValue(pieClpInput, val);
        });
    }

    const saldoFinanciarUfInput = document.getElementById('saldo-financiar-uf-input');
    if (saldoFinanciarUfInput) saldoFinanciarUfInput.addEventListener('input', () => calculateJardinAucoPesos('saldo-uf'));

    const saldoFinanciarClpInput = document.getElementById('saldo-financiar-clp-input');
    if (saldoFinanciarClpInput) {
        saldoFinanciarClpInput.addEventListener('input', () => calculateJardinAucoPesos('saldo-clp'));
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

        if (ufCuota) ufCuota.addEventListener('input', () => calculateJardinAucoPesos(`cuota-${i}-uf`));
        if (clpCuota) {
            clpCuota.addEventListener('input', () => calculateJardinAucoPesos(`cuota-${i}-clp`));
            clpCuota.addEventListener('blur', () => {
                const val = parseCLP(clpCuota.value);
                if (val > 0) setCLPValue(clpCuota, val);
            });
        }
    }

    fetchUFValue().then(() => {
        calculateJardinAucoPesos('init');
    }).catch(() => {
        calculateJardinAucoPesos('init');
    });
});
