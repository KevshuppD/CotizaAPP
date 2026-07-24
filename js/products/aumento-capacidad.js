// js/products/aumento-capacidad.js - Lógica Financiera e Inicialización de Aumento de Capacidad

function calculateAumentoCapacidad(triggeredBy = '') {
    const parkSelector = document.getElementById('parque-name');
    const parkValue = parkSelector ? parkSelector.value : 'EL PRADO';
    
    const rightsInput = document.getElementById('cantidad-rights');
    let parsedVal = parseInt(rightsInput ? rightsInput.value : '1');
    const capacidad = isNaN(parsedVal) ? 1 : Math.max(1, Math.min(2, parsedVal));

    // 1. Obtener valor real base según parque y capacidad
    const valorRealBase = (parkValue.toUpperCase().includes('PRADO'))
        ? (capacidad === 2 ? 100 : 80)
        : (capacidad === 2 ? 80 : 50);

    const refUfInput = document.getElementById('ref-uf-input');
    const refClpInput = document.getElementById('ref-clp-input');

    // Actualizar Valor Real si fue disparado por cambio de capacidad, parque o inicio
    if (triggeredBy === 'rights' || triggeredBy === 'park' || triggeredBy === 'init' || (refUfInput && refUfInput.value.trim() === '')) {
        if (refUfInput) refUfInput.value = valorRealBase.toFixed(2);
    }

    const valorRealUF = parseFloat(refUfInput ? refUfInput.value : '') || valorRealBase;
    const valorRealCLP = valorRealUF * currentUFValue;

    if (refClpInput && document.activeElement !== refClpInput) {
        setCLPValue(refClpInput, Math.round(valorRealCLP));
    }

    const descPercentEl = document.getElementById('porcentaje-descuento-main');
    const valorNiUfDisplay = document.getElementById('valor-ni-uf');
    const valorNiClpInput = document.getElementById('valor-ni-clp-input');

    let descPercent = 0;
    let valorPromoUF = valorRealUF;

    // Lógica bidireccional de Descuento vs Valor Promocional
    if (triggeredBy === 'ni-uf' && valorNiUfDisplay) {
        valorPromoUF = parseFloat(valorNiUfDisplay.value) || 0;
        const descUF = Math.max(0, valorRealUF - valorPromoUF);
        descPercent = valorRealUF > 0 ? (descUF / valorRealUF) * 100 : 0;
        if (descPercentEl) descPercentEl.value = Math.round(descPercent);
    } else if (triggeredBy === 'ni-clp' && valorNiClpInput) {
        const clpVal = parseCLP(valorNiClpInput.value);
        valorPromoUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (valorNiUfDisplay) valorNiUfDisplay.value = valorPromoUF.toFixed(2);
        const descUF = Math.max(0, valorRealUF - valorPromoUF);
        descPercent = valorRealUF > 0 ? (descUF / valorRealUF) * 100 : 0;
        if (descPercentEl) descPercentEl.value = Math.round(descPercent);
    } else {
        descPercent = descPercentEl ? (parseFloat(descPercentEl.value) || 0) : 0;
        valorPromoUF = valorRealUF * (1 - descPercent / 100);
        if (valorNiUfDisplay && document.activeElement !== valorNiUfDisplay) {
            valorNiUfDisplay.value = valorPromoUF.toFixed(2);
        }
    }

    const descuentoUF = valorRealUF - valorPromoUF;
    const descuentoCLP = descuentoUF * currentUFValue;
    const valorPromoCLP = valorPromoUF * currentUFValue;

    const descUfOutput = document.getElementById('label-descuento-uf');
    const descOutput = document.getElementById('label-descuento-output');
    if (descUfOutput) {
        descUfOutput.textContent = `${descuentoUF.toFixed(2).replace('.', ',')} UF`;
    }
    if (descOutput) {
        descOutput.textContent = formatCurrency(Math.round(descuentoCLP));
    }

    if (valorNiClpInput && document.activeElement !== valorNiClpInput) {
        setCLPValue(valorNiClpInput, Math.round(valorPromoCLP));
    }

    // 4. Pie (editable %, default 10%)
    const piePercentEl = document.getElementById('pie-percent');
    const pieUfInput = document.getElementById('pie-uf');
    const pieClpInput = document.getElementById('pie-clp-input');

    let piePercent = 10;
    let pieUF = valorPromoUF * 0.10;

    if (triggeredBy === 'pie-uf' && pieUfInput) {
        pieUF = parseFloat(pieUfInput.value) || 0;
        piePercent = valorPromoUF > 0 ? (pieUF / valorPromoUF) * 100 : 0;
        if (piePercentEl) piePercentEl.value = Math.round(piePercent);
    } else if (triggeredBy === 'pie-clp' && pieClpInput) {
        const clpVal = parseCLP(pieClpInput.value);
        pieUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (pieUfInput) pieUfInput.value = pieUF.toFixed(2);
        piePercent = valorPromoUF > 0 ? (pieUF / valorPromoUF) * 100 : 0;
        if (piePercentEl) piePercentEl.value = Math.round(piePercent);
    } else {
        piePercent = piePercentEl ? (parseFloat(piePercentEl.value) || 0) : 10;
        pieUF = valorPromoUF * (piePercent / 100);
        if (pieUfInput && document.activeElement !== pieUfInput) {
            pieUfInput.value = pieUF.toFixed(2);
        }
    }

    const pieCLP = pieUF * currentUFValue;
    if (pieClpInput && document.activeElement !== pieClpInput) {
        setCLPValue(pieClpInput, Math.round(pieCLP));
    }

    // 5. Monto a financiar (Valor Promocional - Pie)
    const saldoUF = valorPromoUF - pieUF;
    const saldoCLP = valorPromoCLP - pieCLP;

    const saldoFinanciarUfInput = document.getElementById('saldo-financiar-uf-input');
    const saldoFinanciarClpInput = document.getElementById('saldo-financiar-clp-input');

    if (saldoFinanciarUfInput) {
        saldoFinanciarUfInput.value = saldoUF.toFixed(2);
    }
    if (saldoFinanciarClpInput && document.activeElement !== saldoFinanciarClpInput) {
        setCLPValue(saldoFinanciarClpInput, Math.round(saldoCLP));
    }

    // 6. Calcular Cuotas de Aumento (12, 24, 36, 48 cuotas)
    const plazos = [12, 24, 36, 48];

    plazos.forEach(plazo => {
        let valorCuotaUF = 0;
        let seguroUF = 0;
        let gastoAdminUF = 0;
        let totalCuotaUF = 0;
        let totalCuotaCLP = 0;

        if (plazo <= 24) {
            const baseCLP = saldoCLP / plazo;
            const recargoCLP = 5250;
            totalCuotaCLP = Math.round(baseCLP + recargoCLP);
            totalCuotaUF = totalCuotaCLP / currentUFValue;
            
            valorCuotaUF = baseCLP / currentUFValue;
            seguroUF = 1750 / currentUFValue;
            gastoAdminUF = 3500 / currentUFValue;
        } else {
            valorCuotaUF = saldoUF / plazo;
            seguroUF = 0.05;
            gastoAdminUF = 0.10;
            totalCuotaUF = valorCuotaUF + seguroUF + gastoAdminUF;
            totalCuotaCLP = Math.round(totalCuotaUF * currentUFValue);
        }

        const factorEl = document.getElementById(`factor-${plazo}`);
        const cuotaEl = document.getElementById(`cuota-${plazo}`);
        
        if (factorEl) factorEl.textContent = totalCuotaUF.toFixed(4).replace('.', ',');
        if (cuotaEl) cuotaEl.textContent = formatCurrency(totalCuotaCLP);
    });

    renderAumentoCapacidadGraphic(capacidad);
}

// Inicialización de la página dedicada a Aumento de Capacidad
document.addEventListener('DOMContentLoaded', () => {
    initDOMElements();
    
    // Configurar fecha
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
        if (parkSelector.value === 'MANANTIAL_SANTIAGO_CANAAN') {
            displayEl.textContent = 'EL MANANTIAL / SANTIAGO / CANAÁN';
        } else {
            displayEl.textContent = 'PARQUE ' + parkSelector.value.replace(/_/g, ' ');
        }
    }

    // Selector de parque
    if (parkSelector) {
        parkSelector.addEventListener('change', () => {
            const displayEl = document.getElementById('park-name-display') || document.getElementById('park-display');
            if (displayEl) {
                if (parkSelector.value === 'MANANTIAL_SANTIAGO_CANAAN') {
                    displayEl.textContent = 'EL MANANTIAL / SANTIAGO / CANAÁN';
                } else {
                    displayEl.textContent = 'PARQUE ' + parkSelector.value.replace(/_/g, ' ');
                }
            }
            calculateAumentoCapacidad('park');
        });
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
                'mantencion': 'mantencion.html',
                'servicios-funerarios': 'servicios-funerarios.html'
            };
            window.location.href = productPageMap[productSelector.value] || 'aumento-capacidad.html';
        });
    }

    // Event listeners de inputs numéricos específicos
    const ufInput = document.getElementById('uf-value-input');
    if (ufInput) {
        ufInput.addEventListener('input', () => {
            const val = parseFloat(ufInput.value);
            if (!isNaN(val) && val > 0) {
                currentUFValue = val;
                calculateAumentoCapacidad('uf-manual');
            }
        });
    }

    const refUfInput = document.getElementById('ref-uf-input');
    if (refUfInput) {
        refUfInput.addEventListener('input', () => calculateAumentoCapacidad('ref-uf'));
    }

    const refClpInput = document.getElementById('ref-clp-input');
    if (refClpInput) {
        refClpInput.addEventListener('input', () => {
            const val = parseCLP(refClpInput.value);
            const calcUf = currentUFValue > 0 ? (val / currentUFValue) : 0;
            if (refUfInput) refUfInput.value = calcUf > 0 ? calcUf.toFixed(2) : '';
            calculateAumentoCapacidad('ref-clp');
        });
        refClpInput.addEventListener('blur', () => {
            const val = parseCLP(refClpInput.value);
            if (val > 0) setCLPValue(refClpInput, val);
        });
    }

    const rightsInput = document.getElementById('cantidad-rights');
    if (rightsInput) {
        rightsInput.addEventListener('input', () => calculateAumentoCapacidad('rights'));
    }

    const descPercentEl = document.getElementById('porcentaje-descuento-main');
    if (descPercentEl) {
        descPercentEl.addEventListener('input', () => calculateAumentoCapacidad('discount-manual'));
    }

    const valorNiUf = document.getElementById('valor-ni-uf');
    if (valorNiUf) {
        valorNiUf.addEventListener('input', () => calculateAumentoCapacidad('ni-uf'));
    }

    const valorNiClpInput = document.getElementById('valor-ni-clp-input');
    if (valorNiClpInput) {
        valorNiClpInput.addEventListener('input', () => calculateAumentoCapacidad('ni-clp'));
        valorNiClpInput.addEventListener('blur', () => {
            const val = parseCLP(valorNiClpInput.value);
            if (val > 0) setCLPValue(valorNiClpInput, val);
        });
    }

    const piePercentEl = document.getElementById('pie-percent');
    if (piePercentEl) {
        piePercentEl.addEventListener('input', () => calculateAumentoCapacidad('pie-percent'));
    }

    const pieUfInput = document.getElementById('pie-uf');
    if (pieUfInput) {
        pieUfInput.addEventListener('input', () => calculateAumentoCapacidad('pie-uf'));
    }

    const pieClpInput = document.getElementById('pie-clp-input');
    if (pieClpInput) {
        pieClpInput.addEventListener('input', () => calculateAumentoCapacidad('pie-clp'));
        pieClpInput.addEventListener('blur', () => {
            const val = parseCLP(pieClpInput.value);
            if (val > 0) setCLPValue(pieClpInput, val);
        });
    }

    fetchUFValue().then(() => {
        calculateAumentoCapacidad('init');
    }).catch(() => {
        calculateAumentoCapacidad('init');
    });
});

function renderAumentoCapacidadGraphic(count) {
    const container = document.getElementById('sepultacion-graphic-container');
    if (!container) return;

    container.style.display = 'block';
    container.style.width = '100%';
    container.style.maxWidth = '250px';
    container.style.margin = '15px auto 0 auto';
    container.classList.add('active');
    container.innerHTML = '';

    // Título del gráfico
    const titulo = document.createElement('div');
    titulo.style.textAlign = 'center';
    titulo.style.fontWeight = 'bold';
    titulo.style.fontSize = '13px';
    titulo.style.marginBottom = '10px';
    titulo.style.color = '#333';
    titulo.textContent = `Aumento de Capacidad: +${count}`;
    container.appendChild(titulo);

    const stackContainer = document.createElement('div');
    stackContainer.style.display = 'flex';
    stackContainer.style.flexDirection = 'column';
    stackContainer.style.alignItems = 'center';
    stackContainer.style.gap = '4px';

    // Renderizar bloques apilados limpios
    for (let i = count; i >= 1; i--) {
        const box = document.createElement('div');
        box.style.width = '120px';
        box.style.height = '60px';
        box.style.border = '3px solid var(--primary-green)';
        box.style.borderRadius = '8px';
        box.style.display = 'flex';
        box.style.alignItems = 'center';
        box.style.justifyContent = 'center';
        box.style.backgroundColor = '#e8f5e9';
        box.style.fontWeight = 'bold';
        box.style.fontSize = '11px';
        box.style.color = '#333';
        box.textContent = `CAPACIDAD +${i}`;
        stackContainer.appendChild(box);
    }

    container.appendChild(stackContainer);
}
