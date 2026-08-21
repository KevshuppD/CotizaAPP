// js/products/sepultura-auco-pesos.js - Lógica Financiera Sepultura Parque Auco (Pesos)

function calculateSepulturaAucoPesos(triggeredBy = '') {
    const refUfInput = document.getElementById('ref-uf-input');
    const refClpInput = document.getElementById('ref-clp-input');
    const valorNiUfDisplay = document.getElementById('valor-ni-uf');
    const valorNiClpInput = document.getElementById('valor-ni-clp-input');
    const pieUfInput = document.getElementById('pie-uf');
    const pieClpInput = document.getElementById('pie-clp-input');
    const saldoFinanciarUfInput = document.getElementById('saldo-financiar-uf-input');
    const saldoFinanciarClpInput = document.getElementById('saldo-financiar-clp-input');

    let valorRealCLP = parseCLP(refClpInput && refClpInput.value ? refClpInput.value : '0');
    let valorPromoCLP = parseCLP(valorNiClpInput && valorNiClpInput.value ? valorNiClpInput.value : '0');
    let pieCLP = parseCLP(pieClpInput && pieClpInput.value ? pieClpInput.value : '0');

    // 1. Manejo de inputs del usuario
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
    }

    if (triggeredBy === 'pie-uf' && pieUfInput) {
        const ufVal = parseFloat(pieUfInput.value) || 0;
        pieCLP = currentUFValue > 0 ? Math.round(ufVal * currentUFValue) : 0;
        if (pieClpInput && document.activeElement !== pieClpInput) {
            setCLPValue(pieClpInput, pieCLP > 0 ? pieCLP : '');
        }
    } else if (triggeredBy === 'pie-clp' && pieClpInput) {
        pieCLP = parseCLP(pieClpInput.value);
        const ufVal = currentUFValue > 0 ? (pieCLP / currentUFValue) : 0;
        if (pieUfInput) pieUfInput.value = ufVal > 0 ? ufVal.toFixed(2) : '';
    }

    // 2. Fórmulas basadas en PESOS ($)
    // Saldo a Financiar = Valor Promocional - Pie (en pesos)
    let saldoCLP = Math.max(0, valorPromoCLP - pieCLP);

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
        if (saldoFinanciarClpInput && document.activeElement !== saldoFinanciarClpInput) {
            setCLPValue(saldoFinanciarClpInput, saldoCLP > 0 ? saldoCLP : '');
        }
        if (saldoFinanciarUfInput && document.activeElement !== saldoFinanciarUfInput) {
            const ufVal = currentUFValue > 0 && saldoCLP > 0 ? (saldoCLP / currentUFValue) : 0;
            saldoFinanciarUfInput.value = ufVal > 0 ? ufVal.toFixed(2) : '';
        }
    }

    // Descuento = Valor Real - Valor Promocional (en pesos)
    const descuentoUfInput = document.getElementById('descuento-uf-input');
    const descOutput = document.getElementById('label-descuento-output');
    const descuentoCLP = (valorRealCLP > 0 && valorPromoCLP > 0) ? Math.max(0, valorRealCLP - valorPromoCLP) : 0;
    const descuentoUF = currentUFValue > 0 && descuentoCLP > 0 ? (descuentoCLP / currentUFValue) : 0;

    if (descOutput) {
        descOutput.textContent = descuentoCLP > 0 ? formatCurrency(descuentoCLP) : '$0';
    }
    if (descuentoUfInput && document.activeElement !== descuentoUfInput) {
        descuentoUfInput.value = descuentoUF > 0 ? descuentoUF.toFixed(2) : '';
    }

    // Sincronizar UF al inicializar o al cambiar la UF
    if (triggeredBy === 'uf-manual' || triggeredBy === 'init') {
        if (refUfInput && valorRealCLP > 0) refUfInput.value = (valorRealCLP / currentUFValue).toFixed(2);
        if (valorNiUfDisplay && valorPromoCLP > 0) valorNiUfDisplay.value = (valorPromoCLP / currentUFValue).toFixed(2);
        if (pieUfInput && pieCLP > 0) pieUfInput.value = (pieCLP / currentUFValue).toFixed(2);
        if (saldoFinanciarUfInput && saldoCLP > 0) saldoFinanciarUfInput.value = (saldoCLP / currentUFValue).toFixed(2);
    }

    // 3. Cálculo de Cuotas en Pesos con Factores y Gasto Administrativo de $3.964 CLP
    const plazosPesos = [
        { plazo: 24, factor: 0.04992 },
        { plazo: 36, factor: 0.03615 },
        { plazo: 48, factor: 0.02938 },
        { plazo: 60, factor: 0.02808 },
        { plazo: 72, factor: 0.025603 }
    ];
    
    const gastoAdminCLP = 3964;
    let tablaCuotasHTML = '';
    
    plazosPesos.forEach(item => {
        const plazo = item.plazo;
        let baseCuotaCLP = 0;
        
        if (saldoCLP > 0) {
            if (item.factor === 0) {
                baseCuotaCLP = Math.round(saldoCLP / plazo);
            } else {
                baseCuotaCLP = Math.round(saldoCLP * item.factor);
            }
        }
        
        const totalCuotaCLP = baseCuotaCLP > 0 ? (baseCuotaCLP + gastoAdminCLP) : 0;
        const totalCuotaUF = currentUFValue > 0 && totalCuotaCLP > 0 ? (totalCuotaCLP / currentUFValue) : 0;

        tablaCuotasHTML += `
            <tr>
                <td style="font-weight: bold;">${plazo} cuotas</td>
                <td style="text-align: center;">${item.factor === 0 ? '-' : item.factor.toString().replace('.', ',')}</td>
                <td style="text-align: center;">$3.964</td>
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

    const img = document.createElement('img');
    img.src = 'sarcofago.png';
    img.alt = 'Sarcófago ' + num;
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.maxHeight = compact ? '75px' : '120px';
    img.style.objectFit = 'contain';
    img.style.display = 'block';
    img.style.marginBottom = '2px';
    img.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.12))';

    const label = document.createElement('span');
    label.textContent = 'Capacidad ' + num;
    label.style.fontSize = compact ? '11px' : '12px';
    label.style.fontWeight = 'bold';
    label.style.color = '#1b5e20';
    label.style.whiteSpace = 'nowrap';

    itemWrapper.appendChild(img);
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
            window.location.href = productPageMap[productSelector.value] || 'sepultura-auco-pesos.html';
        });
    }

    // Event listeners de inputs
    const ufInput = document.getElementById('uf-value-input');
    if (ufInput) {
        ufInput.addEventListener('input', () => {
            const val = parseFloat(ufInput.value);
            if (!isNaN(val) && val > 0) {
                currentUFValue = val;
                calculateSepulturaAucoPesos('uf-manual');
            }
        });
    }

    const refUfInput = document.getElementById('ref-uf-input');
    if (refUfInput) {
        refUfInput.addEventListener('input', () => calculateSepulturaAucoPesos('ref-uf'));
    }

    const refClpInput = document.getElementById('ref-clp-input');
    if (refClpInput) {
        refClpInput.addEventListener('input', () => calculateSepulturaAucoPesos('ref-clp'));
        refClpInput.addEventListener('blur', () => {
            const val = parseCLP(refClpInput.value);
            if (val > 0) setCLPValue(refClpInput, val);
        });
    }

    const valorNiUf = document.getElementById('valor-ni-uf');
    if (valorNiUf) {
        valorNiUf.addEventListener('input', () => calculateSepulturaAucoPesos('ni-uf'));
    }

    const valorNiClpInput = document.getElementById('valor-ni-clp-input');
    if (valorNiClpInput) {
        valorNiClpInput.addEventListener('input', () => calculateSepulturaAucoPesos('ni-clp'));
        valorNiClpInput.addEventListener('blur', () => {
            const val = parseCLP(valorNiClpInput.value);
            if (val > 0) setCLPValue(valorNiClpInput, val);
        });
    }

    const pieUfInput = document.getElementById('pie-uf');
    if (pieUfInput) {
        pieUfInput.addEventListener('input', () => calculateSepulturaAucoPesos('pie-uf'));
    }

    const pieClpInput = document.getElementById('pie-clp-input');
    if (pieClpInput) {
        pieClpInput.addEventListener('input', () => calculateSepulturaAucoPesos('pie-clp'));
        pieClpInput.addEventListener('blur', () => {
            const val = parseCLP(pieClpInput.value);
            if (val > 0) setCLPValue(pieClpInput, val);
        });
    }

    const saldoFinanciarUfInput = document.getElementById('saldo-financiar-uf-input');
    if (saldoFinanciarUfInput) {
        saldoFinanciarUfInput.addEventListener('input', () => calculateSepulturaAucoPesos('saldo-uf'));
    }

    const saldoFinanciarClpInput = document.getElementById('saldo-financiar-clp-input');
    if (saldoFinanciarClpInput) {
        saldoFinanciarClpInput.addEventListener('input', () => calculateSepulturaAucoPesos('saldo-clp'));
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
        calculateSepulturaAucoPesos('init');
    }).catch(() => {
        calculateSepulturaAucoPesos('init');
    });
});
