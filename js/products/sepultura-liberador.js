// js/products/sepultura-liberador.js - Lógica Financiera e Inicialización de Sepultura Parque Auco

function calculateSepulturaLiberador(triggeredBy = '') {
    const select = elements.capacidadReduccionesSelect;
    if (!select) return;

    // Elementos DOM locales para evitar ReferenceError
    const descPercentEl = document.getElementById('porcentaje-descuento-main');
    const valorNiUfDisplay = document.getElementById('valor-ni-uf');
    const valorNiClpInput = document.getElementById('valor-ni-clp-input');
    const piePercentEl = document.getElementById('pie-percent');
    const pieUfInput = document.getElementById('pie-uf');
    const pieClpInput = document.getElementById('pie-clp-input');
    const saldoFinanciarUfInput = document.getElementById('saldo-financiar-uf-input');
    const saldoFinanciarClpInput = document.getElementById('saldo-financiar-clp-input');

    // Mapa de precios en UF por Capacidad/Reducciones
    const priceMap = {
        '2-4': 190,
        '3-8': 220,
        '4-12': 250,
        '8-20': 450
    };

    const valorRealBase = priceMap[select.value] || 190;

    // Actualizar Valor Real si fue disparado por capacidad o inicio
    if (triggeredBy === 'cap-red' || triggeredBy === 'init' || triggeredBy === 'park') {
        if (elements.refUfInput) elements.refUfInput.value = valorRealBase.toFixed(2);
    }

    const valorRealUF = parseFloat(elements.refUfInput ? elements.refUfInput.value : '') || valorRealBase;
    const valorRealCLP = valorRealUF * currentUFValue;

    if (elements.refClpInput && document.activeElement !== elements.refClpInput) {
        setCLPValue(elements.refClpInput, Math.round(valorRealCLP));
    }

    const descuentoUfInput = document.getElementById('descuento-uf-input');

    let descPercent = descPercentEl ? (parseFloat(descPercentEl.value) || 0) : 20;
    let valorPromoUF = valorRealUF * (1 - descPercent / 100);
    let piePercent = piePercentEl ? (parseFloat(piePercentEl.value) || 0) : 10;
    let pieUF = valorPromoUF * (piePercent / 100);
    let saldoUF = valorPromoUF - pieUF;

    // Lógica bidireccional de entradas
    if (triggeredBy === 'saldo-uf' && saldoFinanciarUfInput) {
        saldoUF = parseFloat(saldoFinanciarUfInput.value) || 0;
        pieUF = parseFloat(pieUfInput ? pieUfInput.value : '') || 0;
        valorPromoUF = saldoUF + pieUF;

        const descUF = Math.max(0, valorRealUF - valorPromoUF);
        descPercent = valorRealUF > 0 ? (descUF / valorRealUF) * 100 : 0;
        if (descPercentEl) descPercentEl.value = Math.round(descPercent).toString();
        
        piePercent = valorPromoUF > 0 ? (pieUF / valorPromoUF) * 100 : 0;
        if (piePercentEl) piePercentEl.value = Math.round(piePercent).toString();
    } else if (triggeredBy === 'saldo-clp' && saldoFinanciarClpInput) {
        const clpVal = parseCLP(saldoFinanciarClpInput.value);
        saldoUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (saldoFinanciarUfInput) saldoFinanciarUfInput.value = saldoUF.toFixed(2);
        
        pieUF = parseFloat(pieUfInput ? pieUfInput.value : '') || 0;
        valorPromoUF = saldoUF + pieUF;

        const descUF = Math.max(0, valorRealUF - valorPromoUF);
        descPercent = valorRealUF > 0 ? (descUF / valorRealUF) * 100 : 0;
        if (descPercentEl) descPercentEl.value = Math.round(descPercent).toString();
        
        piePercent = valorPromoUF > 0 ? (pieUF / valorPromoUF) * 100 : 0;
        if (piePercentEl) piePercentEl.value = Math.round(piePercent).toString();
    } else if (triggeredBy === 'desc-uf' && descuentoUfInput) {
        const descUF = parseFloat(descuentoUfInput.value) || 0;
        descPercent = valorRealUF > 0 ? (descUF / valorRealUF) * 100 : 0;
        if (descPercentEl) descPercentEl.value = Math.round(descPercent).toString();
        valorPromoUF = valorRealUF - descUF;
        pieUF = valorPromoUF * (piePercent / 100);
        saldoUF = valorPromoUF - pieUF;
    } else if (triggeredBy === 'ni-uf' && valorNiUfDisplay) {
        valorPromoUF = parseFloat(valorNiUfDisplay.value) || 0;
        const descUF = Math.max(0, valorRealUF - valorPromoUF);
        descPercent = valorRealUF > 0 ? (descUF / valorRealUF) * 100 : 0;
        if (descPercentEl) descPercentEl.value = Math.round(descPercent).toString();
        
        pieUF = valorPromoUF * (piePercent / 100);
        saldoUF = valorPromoUF - pieUF;
    } else if (triggeredBy === 'ni-clp' && valorNiClpInput) {
        const clpVal = parseCLP(valorNiClpInput.value);
        valorPromoUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (valorNiUfDisplay) valorNiUfDisplay.value = valorPromoUF.toFixed(2);
        
        const descUF = Math.max(0, valorRealUF - valorPromoUF);
        descPercent = valorRealUF > 0 ? (descUF / valorRealUF) * 100 : 0;
        if (descPercentEl) descPercentEl.value = Math.round(descPercent).toString();
        
        pieUF = valorPromoUF * (piePercent / 100);
        saldoUF = valorPromoUF - pieUF;
    } else if (triggeredBy === 'discount-manual' && descPercentEl) {
        descPercent = parseFloat(descPercentEl.value) || 0;
        valorPromoUF = valorRealUF * (1 - descPercent / 100);
        pieUF = valorPromoUF * (piePercent / 100);
        saldoUF = valorPromoUF - pieUF;
    } else if (triggeredBy === 'pie-uf' && pieUfInput) {
        pieUF = parseFloat(pieUfInput.value) || 0;
        piePercent = valorPromoUF > 0 ? (pieUF / valorPromoUF) * 100 : 0;
        if (piePercentEl) piePercentEl.value = Math.round(piePercent).toString();
        saldoUF = valorPromoUF - pieUF;
    } else if (triggeredBy === 'pie-clp' && pieClpInput) {
        const clpVal = parseCLP(pieClpInput.value);
        pieUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (pieUfInput) pieUfInput.value = pieUF.toFixed(2);
        piePercent = valorPromoUF > 0 ? (pieUF / valorPromoUF) * 100 : 0;
        if (piePercentEl) piePercentEl.value = Math.round(piePercent).toString();
        saldoUF = valorPromoUF - pieUF;
    } else if (triggeredBy === 'pie-percent' && piePercentEl) {
        piePercent = parseFloat(piePercentEl.value) || 0;
        pieUF = valorPromoUF * (piePercent / 100);
        if (pieUfInput) pieUfInput.value = pieUF.toFixed(2);
        saldoUF = valorPromoUF - pieUF;
    } else {
        descPercent = descPercentEl ? (parseFloat(descPercentEl.value) || 0) : (selectedProduct === 'PRADO' ? 20 : 0);
        valorPromoUF = valorRealUF * (1 - descPercent / 100);
        
        piePercent = piePercentEl ? (parseFloat(piePercentEl.value) || 0) : (selectedProduct === 'PRADO' ? 5 : 10);
        pieUF = valorPromoUF * (piePercent / 100);
        if (pieUfInput) pieUfInput.value = pieUF.toFixed(2);
        saldoUF = valorPromoUF - pieUF;
    }

    if (valorNiUfDisplay && document.activeElement !== valorNiUfDisplay) {
        valorNiUfDisplay.value = valorPromoUF.toFixed(2);
    }

    const descuentoUF = valorRealUF - valorPromoUF;
    const descuentoCLP = descuentoUF * currentUFValue;
    const valorPromoCLP = valorPromoUF * currentUFValue;

    const descOutput = document.getElementById('label-descuento-output');
    if (descuentoUfInput && document.activeElement !== descuentoUfInput) {
        descuentoUfInput.value = descuentoUF > 0 ? descuentoUF.toFixed(2) : '';
    }
    if (descOutput) {
        descOutput.textContent = formatCurrency(Math.round(descuentoCLP));
    }

    if (valorNiClpInput && document.activeElement !== valorNiClpInput) {
        setCLPValue(valorNiClpInput, Math.round(valorPromoCLP));
    }

    const pieCLP = pieUF * currentUFValue;
    if (pieClpInput && document.activeElement !== pieClpInput) {
        setCLPValue(pieClpInput, Math.round(pieCLP));
    }

    const saldoCLP = saldoUF * currentUFValue;
    if (saldoFinanciarUfInput && document.activeElement !== saldoFinanciarUfInput) {
        saldoFinanciarUfInput.value = saldoUF.toFixed(2);
    }
    if (saldoFinanciarClpInput && document.activeElement !== saldoFinanciarClpInput) {
        setCLPValue(saldoFinanciarClpInput, Math.round(saldoCLP));
    }

    // Generar Cuotas (12 a 108 cuotas para todos los productos)
    const plazos = [12, 24, 36, 48, 60, 72, 84, 96, 108];
    let tablaCuotasHTML = '';
    
    plazos.forEach(plazo => {
        let valorCuotaUF = 0;
        let seguroUF = 0;
        let gastoAdminUF = 0;
        let totalCuotaUF = 0;
        let totalCuotaCLP = 0;

        const tasasStandard = {
            60: 0.0197,
            72: 0.01693,
            84: 0.01495,
            96: 0.01348,
            108: 0.01238
        };

        if (plazo <= 48) {
            valorCuotaUF = saldoUF / plazo;
        } else {
            const tasa = tasasStandard[plazo] || 0;
            valorCuotaUF = saldoUF * tasa;
        }

        if (plazo < 36) {
            const baseCLP = saldoCLP / plazo;
            const seguroCLP = 1750;
            const gaCLP = 3500;
            totalCuotaCLP = Math.round(baseCLP + seguroCLP + gaCLP);
            totalCuotaUF = totalCuotaCLP / currentUFValue;
            
            valorCuotaUF = baseCLP / currentUFValue;
            seguroUF = seguroCLP / currentUFValue;
            gastoAdminUF = gaCLP / currentUFValue;
        } else {
            seguroUF = 0.05;
            gastoAdminUF = 0.10;
            totalCuotaUF = valorCuotaUF + seguroUF + gastoAdminUF;
            totalCuotaCLP = Math.round(totalCuotaUF * currentUFValue);
        }

        tablaCuotasHTML += `
            <tr>
                <td style="font-weight: bold;">${plazo} cuotas</td>
                <td>${valorCuotaUF.toFixed(4).replace('.', ',')}</td>
                <td>${seguroUF.toFixed(4).replace('.', ',')}</td>
                <td>${gastoAdminUF.toFixed(4).replace('.', ',')}</td>
                <td style="font-weight: bold;">${totalCuotaUF.toFixed(4).replace('.', ',')}</td>
                <td style="font-weight: bold; font-size: 15px; color: var(--primary-green);">${formatCurrency(totalCuotaCLP)}</td>
            </tr>
        `;
    });

    if (elements.sepulturaLiberadorCuotasBody) {
        elements.sepulturaLiberadorCuotasBody.innerHTML = tablaCuotasHTML;
    }

    const [cap, red] = select.value.split('-').map(Number);
    if (elements.rightsInput) elements.rightsInput.value = cap;
    if (elements.reduccionesInput) elements.reduccionesInput.value = red;

    renderSepulturaLiberadorGraphic(cap);
}

// Inicialización de la página dedicada a Sepultura con Beneficios
document.addEventListener('DOMContentLoaded', () => {
    initDOMElements();

    const today = new Date();
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        dateEl.textContent = today.toLocaleDateString('es-CL', { 
            day: '2-digit', month: '2-digit', year: 'numeric' 
        }).replace(/\//g, '-');
    }

    const parkSelector = document.getElementById('parque-name');
    const displayEl = document.getElementById('park-name-display') || document.getElementById('park-display');
    if (displayEl && parkSelector) {
        displayEl.textContent = 'PARQUE ' + parkSelector.value.replace(/_/g, ' ');
    }

    if (parkSelector) {
        parkSelector.addEventListener('change', () => {
            if (displayEl) displayEl.textContent = 'PARQUE ' + parkSelector.value.replace(/_/g, ' ');
            
            // Configurar Pie y Descuento por defecto al cambiar de parque
            const descPercentEl = document.getElementById('porcentaje-descuento-main');
            if (descPercentEl) descPercentEl.value = (parkSelector.value === 'PRADO') ? 20 : 0;
            
            const piePercentEl = document.getElementById('pie-percent');
            if (piePercentEl) piePercentEl.value = (parkSelector.value === 'PRADO') ? 5 : 10;
            
            calculateSepulturaLiberador('park');
        });
    }

    const capRedSelect = document.getElementById('capacidad-reducciones-select');
    if (capRedSelect) {
        capRedSelect.addEventListener('change', () => calculateSepulturaLiberador('cap-red'));
    }

    // Selector de tipo de producto superior para navegación
    const productSelector = document.getElementById('product-type') || document.getElementById('product-type-select');
    if (productSelector) {
        productSelector.addEventListener('change', () => {
            const productPageMap = {
                'sepultacion': 'index.html',
                'sepultura-liberador': 'sepultura-liberador.html',
                'cremacion': 'cremacion.html',
                'aumento-capacidad': 'aumento-capacidad.html',
                'mantencion': 'mantencion.html'
            };
            window.location.href = productPageMap[productSelector.value] || 'sepultura-liberador.html';
        });
    }

    // Event listeners de inputs
    const ufInput = document.getElementById('uf-value-input');
    if (ufInput) {
        ufInput.addEventListener('input', () => {
            const val = parseFloat(ufInput.value);
            if (!isNaN(val) && val > 0) {
                currentUFValue = val;
                calculateSepulturaLiberador('uf-manual');
            }
        });
    }

    const refUfInput = document.getElementById('ref-uf-input');
    if (refUfInput) {
        refUfInput.addEventListener('input', () => calculateSepulturaLiberador('ref-uf'));
    }

    const refClpInput = document.getElementById('ref-clp-input');
    if (refClpInput) {
        refClpInput.addEventListener('input', () => {
            const val = parseCLP(refClpInput.value);
            const calcUf = currentUFValue > 0 ? (val / currentUFValue) : 0;
            if (refUfInput) refUfInput.value = calcUf > 0 ? calcUf.toFixed(2) : '';
            calculateSepulturaLiberador('ref-clp');
        });
        refClpInput.addEventListener('blur', () => {
            const val = parseCLP(refClpInput.value);
            if (val > 0) setCLPValue(refClpInput, val);
        });
    }

    const descPercentEl = document.getElementById('porcentaje-descuento-main');
    if (descPercentEl) {
        descPercentEl.addEventListener('input', () => calculateSepulturaLiberador('discount-manual'));
    }

    const valorNiUf = document.getElementById('valor-ni-uf');
    if (valorNiUf) {
        valorNiUf.addEventListener('input', () => calculateSepulturaLiberador('ni-uf'));
    }

    const valorNiClpInput = document.getElementById('valor-ni-clp-input');
    if (valorNiClpInput) {
        valorNiClpInput.addEventListener('input', () => calculateSepulturaLiberador('ni-clp'));
        valorNiClpInput.addEventListener('blur', () => {
            const val = parseCLP(valorNiClpInput.value);
            if (val > 0) setCLPValue(valorNiClpInput, val);
        });
    }

    const piePercentEl = document.getElementById('pie-percent');
    if (piePercentEl) {
        piePercentEl.addEventListener('input', () => calculateSepulturaLiberador('pie-percent'));
    }

    const pieUfInput = document.getElementById('pie-uf');
    if (pieUfInput) {
        pieUfInput.addEventListener('input', () => calculateSepulturaLiberador('pie-uf'));
    }

    const pieClpInput = document.getElementById('pie-clp-input');
    if (pieClpInput) {
        pieClpInput.addEventListener('input', () => calculateSepulturaLiberador('pie-clp'));
        pieClpInput.addEventListener('blur', () => {
            const val = parseCLP(pieClpInput.value);
            if (val > 0) setCLPValue(pieClpInput, val);
        });
    }

    const saldoFinanciarUfInput = document.getElementById('saldo-financiar-uf-input');
    if (saldoFinanciarUfInput) {
        saldoFinanciarUfInput.addEventListener('input', () => calculateSepulturaLiberador('saldo-uf'));
    }

    const saldoFinanciarClpInput = document.getElementById('saldo-financiar-clp-input');
    if (saldoFinanciarClpInput) {
        saldoFinanciarClpInput.addEventListener('input', () => calculateSepulturaLiberador('saldo-clp'));
        saldoFinanciarClpInput.addEventListener('blur', () => {
            const val = parseCLP(saldoFinanciarClpInput.value);
            if (val > 0) setCLPValue(saldoFinanciarClpInput, val);
        });
    }

    fetchUFValue().then(() => {
        calculateSepulturaLiberador('init');
    }).catch(() => {
        calculateSepulturaLiberador('init');
    });
});

function renderSepulturaLiberadorGraphic(count) {
    const container = document.getElementById('sepultacion-graphic-container');
    if (!container) return;

    container.style.display = 'block';
    container.style.width = '100%';
    container.style.maxWidth = '250px';
    container.style.margin = '15px auto 0 auto';
    container.classList.add('active');
    container.innerHTML = '';

    const reduccionesInput = document.getElementById('cantidad-reducciones');
    const reducciones = reduccionesInput ? (parseInt(reduccionesInput.value) || 0) : 0;
    const capacidad = count;

    // Título del gráfico
    const titulo = document.createElement('div');
    titulo.style.textAlign = 'center';
    titulo.style.fontWeight = 'bold';
    titulo.style.fontSize = '13px';
    titulo.style.marginBottom = '10px';
    titulo.style.color = '#333';
    titulo.textContent = `Capacidad ${capacidad} - ${reducciones} Reducciones`;
    container.appendChild(titulo);

    // Contenedor de cuadrados apilados verticalmente
    const stackContainer = document.createElement('div');
    stackContainer.style.display = 'flex';
    stackContainer.style.flexDirection = 'column';
    stackContainer.style.alignItems = 'center';
    stackContainer.style.gap = '4px';

    // Cuadrado 1: capacidad base (siempre limpio, sin subdivisiones)
    const baseBox = document.createElement('div');
    baseBox.style.width = '120px';
    baseBox.style.height = '120px';
    baseBox.style.border = '3px solid var(--primary-green)';
    baseBox.style.borderRadius = '8px';
    baseBox.style.display = 'flex';
    baseBox.style.alignItems = 'center';
    baseBox.style.justifyContent = 'center';
    baseBox.style.backgroundColor = '#e8f5e9';
    baseBox.style.fontWeight = 'bold';
    baseBox.style.fontSize = '11px';
    baseBox.style.color = '#333';
    baseBox.style.textAlign = 'center';
    baseBox.textContent = 'CAPACIDAD 1';
    stackContainer.appendChild(baseBox);

    // Cuadrados adicionales: cada uno dividido en 4 reducciones
    const reduccionesPorCapacidad = 4;
    for (let i = 2; i <= capacidad; i++) {
        const capBox = document.createElement('div');
        capBox.style.width = '120px';
        capBox.style.height = '120px';
        capBox.style.border = '3px solid var(--primary-green)';
        capBox.style.borderRadius = '8px';
        capBox.style.display = 'grid';
        capBox.style.gridTemplateColumns = '1fr 1fr';
        capBox.style.gridTemplateRows = '1fr 1fr';
        capBox.style.overflow = 'hidden';
        capBox.style.backgroundColor = '#fff';

        const startReduc = (i - 2) * reduccionesPorCapacidad + 1;
        for (let r = 0; r < reduccionesPorCapacidad; r++) {
            const reducNum = startReduc + r;
            const cell = document.createElement('div');
            cell.style.display = 'flex';
            cell.style.alignItems = 'center';
            cell.style.justifyContent = 'center';
            cell.style.fontSize = '10px';
            cell.style.fontWeight = 'bold';
            cell.style.color = '#fff';
            cell.style.backgroundColor = 'var(--primary-green)';
            cell.style.border = '1px solid #3d8b40';

            if (reducNum <= reducciones) {
                cell.textContent = 'R' + reducNum;
            } else {
                cell.style.backgroundColor = '#d0d0d0';
                cell.style.color = '#999';
                cell.textContent = 'R' + reducNum;
            }
            capBox.appendChild(cell);
        }

        stackContainer.appendChild(capBox);
    }

    container.appendChild(stackContainer);
}
