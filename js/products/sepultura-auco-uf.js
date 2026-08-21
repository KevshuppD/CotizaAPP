// js/products/sepultura-auco-uf.js - Lógica Financiera Sepultura Parque Auco (UF)

function calculateSepulturaAucoUF(triggeredBy = '') {
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

    // Bidireccionalidad Valor Real UF <-> CLP
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

    // Bidireccionalidad Promo UF <-> CLP
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
    } else if (triggeredBy === 'pie-clp' && pieClpInput) {
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
    } else if (triggeredBy === 'saldo-clp' && saldoFinanciarClpInput) {
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

    // Actualizar Saldo UF y CLP en pantalla
    if (triggeredBy !== 'saldo-uf' && triggeredBy !== 'saldo-clp') {
        if (saldoFinanciarUfInput && document.activeElement !== saldoFinanciarUfInput) {
            saldoFinanciarUfInput.value = saldoUF > 0 ? saldoUF.toFixed(2) : '';
        }
        if (saldoFinanciarClpInput && document.activeElement !== saldoFinanciarClpInput) {
            setCLPValue(saldoFinanciarClpInput, saldoUF > 0 ? Math.round(saldoUF * currentUFValue) : '');
        }
    }

    // Calcular Descuento (Valor Real - Valor Promocional)
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

    // Actualizar CLP de Real, Promo y Pie si cambió la UF
    if (triggeredBy === 'uf-manual' || triggeredBy === 'init') {
        if (refClpInput && valorRealUF > 0) setCLPValue(refClpInput, Math.round(valorRealUF * currentUFValue));
        if (valorNiClpInput && valorPromoUF > 0) setCLPValue(valorNiClpInput, Math.round(valorPromoUF * currentUFValue));
        if (pieClpInput && pieUF > 0) setCLPValue(pieClpInput, Math.round(pieUF * currentUFValue));
    }

    // Tabla de Factores y Cuotas UF (0,55% mensual)
    const plazosUF = [
        { plazo: 24, factor: 0.04459 },
        { plazo: 36, factor: 0.03069 },
        { plazo: 48, factor: 0.02376 },
        { plazo: 60, factor: 0.01961 },
        { plazo: 72, factor: 0.01686 }
    ];
    
    let tablaCuotasHTML = '';
    
    plazosUF.forEach(item => {
        const plazo = item.plazo;
        let baseCuotaUF = 0;
        
        if (saldoUF > 0) {
            if (item.factor === 0) {
                baseCuotaUF = saldoUF / plazo;
            } else {
                baseCuotaUF = saldoUF * item.factor;
            }
        }
        
        const gastoAdminUF = 0.10;
        const totalCuotaUFRaw = baseCuotaUF > 0 ? (baseCuotaUF + gastoAdminUF) : 0;
        const totalCuotaUF = Math.round(totalCuotaUFRaw * 100) / 100;
        const totalCuotaCLP = Math.round(totalCuotaUF * currentUFValue);

        tablaCuotasHTML += `
            <tr>
                <td style="font-weight: bold;">${plazo} cuotas</td>
                <td style="text-align: center;">${item.factor === 0 ? '-' : item.factor.toFixed(5).replace('.', ',')}</td>
                <td style="text-align: center;">0,10 UF</td>
                <td style="font-weight: bold;">${totalCuotaUF > 0 ? totalCuotaUF.toFixed(2).replace('.', ',') : '-'}</td>
                <td style="font-weight: bold; font-size: 15px; color: var(--primary-green);">${totalCuotaCLP > 0 ? formatCurrency(totalCuotaCLP) : '$0'}</td>
            </tr>
        `;
    });

    const cuotasBody = document.getElementById('sepultura-liberador-cuotas-body');
    if (cuotasBody) {
        cuotasBody.innerHTML = tablaCuotasHTML;
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
            window.location.href = productPageMap[productSelector.value] || 'sepultura-auco-uf.html';
        });
    }

    // Event listeners de inputs
    const ufInput = document.getElementById('uf-value-input');
    if (ufInput) {
        ufInput.addEventListener('input', () => {
            const val = parseFloat(ufInput.value);
            if (!isNaN(val) && val > 0) {
                currentUFValue = val;
                calculateSepulturaAucoUF('uf-manual');
            }
        });
    }

    const refUfInput = document.getElementById('ref-uf-input');
    if (refUfInput) {
        refUfInput.addEventListener('input', () => calculateSepulturaAucoUF('ref-uf'));
    }

    const refClpInput = document.getElementById('ref-clp-input');
    if (refClpInput) {
        refClpInput.addEventListener('input', () => calculateSepulturaAucoUF('ref-clp'));
        refClpInput.addEventListener('blur', () => {
            const val = parseCLP(refClpInput.value);
            if (val > 0) setCLPValue(refClpInput, val);
        });
    }

    const valorNiUf = document.getElementById('valor-ni-uf');
    if (valorNiUf) {
        valorNiUf.addEventListener('input', () => calculateSepulturaAucoUF('ni-uf'));
    }

    const valorNiClpInput = document.getElementById('valor-ni-clp-input');
    if (valorNiClpInput) {
        valorNiClpInput.addEventListener('input', () => calculateSepulturaAucoUF('ni-clp'));
        valorNiClpInput.addEventListener('blur', () => {
            const val = parseCLP(valorNiClpInput.value);
            if (val > 0) setCLPValue(valorNiClpInput, val);
        });
    }

    const pieUfInput = document.getElementById('pie-uf');
    if (pieUfInput) {
        pieUfInput.addEventListener('input', () => calculateSepulturaAucoUF('pie-uf'));
    }

    const pieClpInput = document.getElementById('pie-clp-input');
    if (pieClpInput) {
        pieClpInput.addEventListener('input', () => calculateSepulturaAucoUF('pie-clp'));
        pieClpInput.addEventListener('blur', () => {
            const val = parseCLP(pieClpInput.value);
            if (val > 0) setCLPValue(pieClpInput, val);
        });
    }

    const saldoFinanciarUfInput = document.getElementById('saldo-financiar-uf-input');
    if (saldoFinanciarUfInput) {
        saldoFinanciarUfInput.addEventListener('input', () => calculateSepulturaAucoUF('saldo-uf'));
    }

    const saldoFinanciarClpInput = document.getElementById('saldo-financiar-clp-input');
    if (saldoFinanciarClpInput) {
        saldoFinanciarClpInput.addEventListener('input', () => calculateSepulturaAucoUF('saldo-clp'));
        saldoFinanciarClpInput.addEventListener('blur', () => {
            const val = parseCLP(saldoFinanciarClpInput.value);
            if (val > 0) setCLPValue(saldoFinanciarClpInput, val);
        });
    }

    const capSelect = document.getElementById('capacidad-select');
    if (capSelect) {
        capSelect.addEventListener('change', () => {
            renderSepulturaGraphic(parseInt(capSelect.value, 10));
        });
        renderSepulturaGraphic(parseInt(capSelect.value, 10));
    }

    fetchUFValue().then(() => {
        calculateSepulturaAucoUF('init');
    }).catch(() => {
        calculateSepulturaAucoUF('init');
    });
});

function createSarcofagoCard(num, compact = false) {
    const itemWrapper = document.createElement('div');
    itemWrapper.style.display = 'flex';
    itemWrapper.style.flexDirection = 'column';
    itemWrapper.style.alignItems = 'center';
    itemWrapper.style.padding = compact ? '4px 6px' : '8px 8px';
    itemWrapper.style.border = '2px solid var(--primary-green)';
    itemWrapper.style.borderRadius = '8px';
    itemWrapper.style.backgroundColor = '#ffffff';
    itemWrapper.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
    itemWrapper.style.width = '100%';
    itemWrapper.style.boxSizing = 'border-box';

    const imgWrapper = document.createElement('div');
    imgWrapper.style.width = '100%';
    imgWrapper.style.height = compact ? '75px' : '115px';
    imgWrapper.style.display = 'flex';
    imgWrapper.style.alignItems = 'center';
    imgWrapper.style.justifyContent = 'center';

    const img = document.createElement('img');
    img.src = 'sarcofago.png';
    img.alt = 'Sarcófago ' + num;
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    img.style.width = 'auto';
    img.style.height = 'auto';
    img.style.objectFit = 'contain';
    img.style.display = 'block';
    img.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.12))';

    imgWrapper.appendChild(img);
    itemWrapper.appendChild(imgWrapper);

    const label = document.createElement('span');
    label.textContent = 'Capacidad ' + num;
    label.style.fontSize = compact ? '11px' : '12px';
    label.style.fontWeight = 'bold';
    label.style.color = '#1b5e20';
    label.style.whiteSpace = 'nowrap';
    label.style.marginTop = '3px';

    itemWrapper.appendChild(label);
    return itemWrapper;
}

function renderSepulturaGraphic(capacidad) {
    const container = document.getElementById('sepultacion-graphic-container');
    if (!container) return;
    container.innerHTML = '';

    const isDoubleCol = capacidad > 4;
    const compact = capacidad >= 4;

    const gridContainer = document.createElement('div');
    gridContainer.style.display = 'flex';
    gridContainer.style.gap = '10px';
    gridContainer.style.width = '100%';
    gridContainer.style.maxWidth = isDoubleCol ? '100%' : '260px';
    gridContainer.style.margin = '0 auto';
    gridContainer.style.justifyContent = 'center';

    // Columna Izquierda (Capacidades 1 a 4 hacia abajo)
    const leftCol = document.createElement('div');
    leftCol.style.display = 'flex';
    leftCol.style.flexDirection = 'column';
    leftCol.style.gap = '6px';
    leftCol.style.flex = '1';
    leftCol.style.width = '100%';

    const leftCount = Math.min(capacidad, 4);
    for (let i = 1; i <= leftCount; i++) {
        leftCol.appendChild(createSarcofagoCard(i, compact));
    }
    gridContainer.appendChild(leftCol);

    // Columna Derecha (Capacidades 5 a 8 hacia abajo)
    if (capacidad > 4) {
        const rightCol = document.createElement('div');
        rightCol.style.display = 'flex';
        rightCol.style.flexDirection = 'column';
        rightCol.style.gap = '6px';
        rightCol.style.flex = '1';
        rightCol.style.width = '100%';

        for (let i = 5; i <= capacidad; i++) {
            rightCol.appendChild(createSarcofagoCard(i, compact));
        }
        gridContainer.appendChild(rightCol);
    }

    container.appendChild(gridContainer);
}
