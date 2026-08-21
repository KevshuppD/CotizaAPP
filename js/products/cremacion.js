// js/products/cremacion.js - Lógica Financiera Cremación Anticipada

function calculateCremacion(triggeredBy = '') {
    const refUfInput = document.getElementById('ref-uf-input');
    const refClpInput = document.getElementById('ref-clp-input');
    const valorNiUfDisplay = document.getElementById('valor-ni-uf');
    const valorNiClpInput = document.getElementById('valor-ni-clp-input');
    const pieUfInput = document.getElementById('pie-uf');
    const pieClpInput = document.getElementById('pie-clp-input');
    const saldoFinanciarUfInput = document.getElementById('saldo-financiar-uf-input');
    const saldoFinanciarClpInput = document.getElementById('saldo-financiar-clp-input');

    let valorRealUF = parseFloat(refUfInput && refUfInput.value ? refUfInput.value : '0') || 0;
    let valorPromoUF = parseFloat(valorNiUfDisplay && valorNiUfDisplay.value ? valorNiUfDisplay.value : '0') || 0;
    let pieUF = parseFloat(pieUfInput && pieUfInput.value ? pieUfInput.value : '0') || 0;
    let saldoUF = Math.max(0, valorPromoUF - pieUF);

    // 1. Valor Real
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

    // 2. Valor Promocional
    if (triggeredBy === 'ni-clp' && valorNiClpInput) {
        const clpVal = parseCLP(valorNiClpInput.value);
        valorPromoUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (valorNiUfDisplay) valorNiUfDisplay.value = valorPromoUF > 0 ? valorPromoUF.toFixed(2) : '';
        saldoUF = Math.max(0, valorPromoUF - pieUF);
    } else if (triggeredBy === 'ni-uf' && valorNiUfDisplay) {
        valorPromoUF = parseFloat(valorNiUfDisplay.value) || 0;
        if (valorNiClpInput && document.activeElement !== valorNiClpInput) {
            setCLPValue(valorNiClpInput, valorPromoUF > 0 ? Math.round(valorPromoUF * currentUFValue) : '');
        }
        saldoUF = Math.max(0, valorPromoUF - pieUF);
    }

    // 3. Pie
    if (triggeredBy === 'pie-clp' && pieClpInput) {
        const clpVal = parseCLP(pieClpInput.value);
        pieUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (pieUfInput) pieUfInput.value = pieUF > 0 ? pieUF.toFixed(2) : '';
        saldoUF = Math.max(0, valorPromoUF - pieUF);
    } else if (triggeredBy === 'pie-uf' && pieUfInput) {
        pieUF = parseFloat(pieUfInput.value) || 0;
        if (pieClpInput && document.activeElement !== pieClpInput) {
            setCLPValue(pieClpInput, pieUF > 0 ? Math.round(pieUF * currentUFValue) : '');
        }
        saldoUF = Math.max(0, valorPromoUF - pieUF);
    }

    // 4. Saldo a Financiar
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
    }

    if (triggeredBy !== 'saldo-uf' && triggeredBy !== 'saldo-clp') {
        if (saldoFinanciarUfInput && document.activeElement !== saldoFinanciarUfInput) {
            saldoFinanciarUfInput.value = saldoUF > 0 ? saldoUF.toFixed(2) : '';
        }
        if (saldoFinanciarClpInput && document.activeElement !== saldoFinanciarClpInput) {
            setCLPValue(saldoFinanciarClpInput, saldoUF > 0 ? Math.round(saldoUF * currentUFValue) : '');
        }
    }

    // 5. Descuento = Valor Real - Valor Promocional
    const descuentoUfInput = document.getElementById('descuento-uf-input');
    const descOutput = document.getElementById('label-descuento-output');
    const descuentoUF = (valorRealUF > 0 && valorPromoUF > 0) ? Math.max(0, valorRealUF - valorPromoUF) : 0;
    const descuentoCLP = descuentoUF * currentUFValue;

    if (descuentoUfInput && document.activeElement !== descuentoUfInput) {
        descuentoUfInput.value = descuentoUF > 0 ? descuentoUF.toFixed(2) : '';
    }
    if (descOutput) {
        descOutput.textContent = descuentoCLP > 0 ? formatCurrency(Math.round(descuentoCLP)) : '$0';
    }

    // 6. Cuotas (12, 24, 36, 48)
    const plazos = [12, 24, 36, 48];
    plazos.forEach(plazo => {
        const ufCuota = document.getElementById(`cuota-${plazo}-uf`);
        const clpCuota = document.getElementById(`cuota-${plazo}-clp`);

        if (triggeredBy === `cuota-${plazo}-clp` && clpCuota) {
            const val = parseCLP(clpCuota.value);
            const u = currentUFValue > 0 ? (val / currentUFValue) : 0;
            if (ufCuota) ufCuota.value = u > 0 ? u.toFixed(2) : '';
        } else if (triggeredBy === `cuota-${plazo}-uf` && ufCuota) {
            const u = parseFloat(ufCuota.value) || 0;
            if (clpCuota && document.activeElement !== clpCuota) {
                setCLPValue(clpCuota, u > 0 ? Math.round(u * currentUFValue) : '');
            }
        }
    });

    // Sincronizar conversiones en caso de cambio de UF
    if (triggeredBy === 'uf-manual' || triggeredBy === 'init') {
        if (refClpInput && valorRealUF > 0) setCLPValue(refClpInput, Math.round(valorRealUF * currentUFValue));
        if (valorNiClpInput && valorPromoUF > 0) setCLPValue(valorNiClpInput, Math.round(valorPromoUF * currentUFValue));
        if (pieClpInput && pieUF > 0) setCLPValue(pieClpInput, Math.round(pieUF * currentUFValue));
        if (saldoFinanciarClpInput && saldoUF > 0) setCLPValue(saldoFinanciarClpInput, Math.round(saldoUF * currentUFValue));

        plazos.forEach(plazo => {
            const ufCuota = document.getElementById(`cuota-${plazo}-uf`);
            const clpCuota = document.getElementById(`cuota-${plazo}-clp`);
            if (ufCuota && clpCuota) {
                const u = parseFloat(ufCuota.value) || 0;
                if (u > 0) setCLPValue(clpCuota, Math.round(u * currentUFValue));
            }
        });
    }
}

function createAnforaCard(num, compact = false) {
    const itemWrapper = document.createElement('div');
    itemWrapper.style.display = 'flex';
    itemWrapper.style.flexDirection = 'column';
    itemWrapper.style.alignItems = 'center';
    itemWrapper.style.padding = compact ? '6px 4px' : '8px 8px';
    itemWrapper.style.border = '2px solid var(--primary-green)';
    itemWrapper.style.borderRadius = '8px';
    itemWrapper.style.backgroundColor = '#ffffff';
    itemWrapper.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.06)';
    itemWrapper.style.width = '100%';
    itemWrapper.style.boxSizing = 'border-box';

    const img = document.createElement('img');
    img.src = 'anfora.png';
    img.alt = 'Ánfora ' + num;
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.maxHeight = compact ? '90px' : '130px';
    img.style.objectFit = 'contain';
    img.style.display = 'block';
    img.style.marginBottom = '4px';
    img.style.filter = 'drop-shadow(0 3px 5px rgba(0, 0, 0, 0.12))';

    const label = document.createElement('span');
    label.textContent = 'Ánfora ' + num;
    label.style.fontSize = compact ? '11px' : '12px';
    label.style.fontWeight = 'bold';
    label.style.color = '#1b5e20';
    label.style.whiteSpace = 'nowrap';

    itemWrapper.appendChild(img);
    itemWrapper.appendChild(label);
    return itemWrapper;
}

function renderAnforasGraphic(count) {
    const container = document.getElementById('cremacion-graphic-container');
    if (!container) return;
    container.innerHTML = '';

    const cols = count === 1 ? 1 : (count === 3 ? 3 : 2);
    const compact = count >= 3;

    const gridContainer = document.createElement('div');
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridContainer.style.gap = '10px';
    gridContainer.style.width = '100%';
    gridContainer.style.maxWidth = count === 1 ? '240px' : '100%';
    gridContainer.style.margin = '0 auto';

    for (let i = 1; i <= count; i++) {
        gridContainer.appendChild(createAnforaCard(i, compact));
    }

    container.appendChild(gridContainer);
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
            window.location.href = productPageMap[productSelector.value] || 'cremacion.html';
        });
    }

    // Event listeners de inputs
    const ufInput = document.getElementById('uf-value-input');
    if (ufInput) {
        ufInput.addEventListener('input', () => {
            const val = parseFloat(ufInput.value);
            if (!isNaN(val) && val > 0) {
                currentUFValue = val;
                calculateCremacion('uf-manual');
            }
        });
    }

    const refUfInput = document.getElementById('ref-uf-input');
    if (refUfInput) refUfInput.addEventListener('input', () => calculateCremacion('ref-uf'));

    const refClpInput = document.getElementById('ref-clp-input');
    if (refClpInput) {
        refClpInput.addEventListener('input', () => calculateCremacion('ref-clp'));
        refClpInput.addEventListener('blur', () => {
            const val = parseCLP(refClpInput.value);
            if (val > 0) setCLPValue(refClpInput, val);
        });
    }

    const valorNiUf = document.getElementById('valor-ni-uf');
    if (valorNiUf) valorNiUf.addEventListener('input', () => calculateCremacion('ni-uf'));

    const valorNiClpInput = document.getElementById('valor-ni-clp-input');
    if (valorNiClpInput) {
        valorNiClpInput.addEventListener('input', () => calculateCremacion('ni-clp'));
        valorNiClpInput.addEventListener('blur', () => {
            const val = parseCLP(valorNiClpInput.value);
            if (val > 0) setCLPValue(valorNiClpInput, val);
        });
    }

    const pieUfInput = document.getElementById('pie-uf');
    if (pieUfInput) pieUfInput.addEventListener('input', () => calculateCremacion('pie-uf'));

    const pieClpInput = document.getElementById('pie-clp-input');
    if (pieClpInput) {
        pieClpInput.addEventListener('input', () => calculateCremacion('pie-clp'));
        pieClpInput.addEventListener('blur', () => {
            const val = parseCLP(pieClpInput.value);
            if (val > 0) setCLPValue(pieClpInput, val);
        });
    }

    const saldoFinanciarUfInput = document.getElementById('saldo-financiar-uf-input');
    if (saldoFinanciarUfInput) saldoFinanciarUfInput.addEventListener('input', () => calculateCremacion('saldo-uf'));

    const saldoFinanciarClpInput = document.getElementById('saldo-financiar-clp-input');
    if (saldoFinanciarClpInput) {
        saldoFinanciarClpInput.addEventListener('input', () => calculateCremacion('saldo-clp'));
        saldoFinanciarClpInput.addEventListener('blur', () => {
            const val = parseCLP(saldoFinanciarClpInput.value);
            if (val > 0) setCLPValue(saldoFinanciarClpInput, val);
        });
    }

    const plazos = [12, 24, 36, 48];
    plazos.forEach(plazo => {
        const ufCuota = document.getElementById(`cuota-${plazo}-uf`);
        const clpCuota = document.getElementById(`cuota-${plazo}-clp`);

        if (ufCuota) ufCuota.addEventListener('input', () => calculateCremacion(`cuota-${plazo}-uf`));
        if (clpCuota) {
            clpCuota.addEventListener('input', () => calculateCremacion(`cuota-${plazo}-clp`));
            clpCuota.addEventListener('blur', () => {
                const val = parseCLP(clpCuota.value);
                if (val > 0) setCLPValue(clpCuota, val);
            });
        }
    });

    const anforasSelect = document.getElementById('anforas-select');
    if (anforasSelect) {
        anforasSelect.addEventListener('change', () => {
            renderAnforasGraphic(parseInt(anforasSelect.value, 10));
        });
        renderAnforasGraphic(parseInt(anforasSelect.value, 10));
    }

    fetchUFValue().then(() => {
        calculateCremacion('init');
    }).catch(() => {
        calculateCremacion('init');
    });
});
