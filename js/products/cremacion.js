// js/products/cremacion.js - Lógica Financiera e Inicialización de Cremación Anticipada

function calculateCremacion(triggeredBy = '') {
    const qtyInput = document.getElementById('cantidad-rights');
    if (!qtyInput) return;
    let qty = parseInt(qtyInput.value) || 1;
    if (qty > 4) {
        qty = 4;
        qtyInput.value = 4;
    } else if (qty < 1) {
        qty = 1;
        qtyInput.value = 1;
    }

    // DOM Elements
    const refUfInput = document.getElementById('ref-uf-input');
    const refClpInput = document.getElementById('ref-clp-input');
    const descPercentEl = document.getElementById('porcentaje-descuento-main');
    const valorNiUfDisplay = document.getElementById('valor-ni-uf');
    const valorNiClpInput = document.getElementById('valor-ni-clp-input');
    const piePercentEl = document.getElementById('pie-percent');
    const pieUfInput = document.getElementById('pie-uf');
    const pieClpInput = document.getElementById('pie-clp-input');
    const saldoFinanciarUfInput = document.getElementById('saldo-financiar-uf-input');
    const saldoFinanciarClpInput = document.getElementById('saldo-financiar-clp-input');

    // Valores Reales y Promocionales fijos en CLP según cantidad
    const valoresRealCremacionCLP = {
        1: 1102806,
        2: 1699143,
        3: 2287308,
        4: 2679418
    };

    const valoresPromoCremacionCLP = {
        1: 926727,
        2: 1427851,
        3: 1922108,
        4: 2251612
    };

    // Si es qty o init, inicializar los valores de los inputs usando las tablas oficiales
    if (triggeredBy === 'qty' || triggeredBy === 'init') {
        const realCLP = valoresRealCremacionCLP[qty] || (1102806 * qty);
        const promoCLP = valoresPromoCremacionCLP[qty] || (926727 * qty);
        
        const realUF = currentUFValue > 0 ? (realCLP / currentUFValue) : 0;
        const promoUF = currentUFValue > 0 ? (promoCLP / currentUFValue) : 0;
        
        if (refUfInput) refUfInput.value = realUF.toFixed(2);
        if (valorNiUfDisplay) valorNiUfDisplay.value = promoUF.toFixed(2);
        if (piePercentEl) piePercentEl.value = "10";
    }

    // Leer valores de los inputs
    const valorRealUF = parseFloat(refUfInput ? refUfInput.value : '') || 0;
    const valorRealCLP = valorRealUF * currentUFValue;
    if (refClpInput && document.activeElement !== refClpInput) {
        setCLPValue(refClpInput, Math.round(valorRealCLP));
    }

    let valorPromoUF = parseFloat(valorNiUfDisplay ? valorNiUfDisplay.value : '') || 0;
    let descPercent = descPercentEl ? (descPercentEl.value === '' ? 16 : parseFloat(descPercentEl.value)) : 16;
    let piePercent = piePercentEl ? (piePercentEl.value === '' ? 10 : parseFloat(piePercentEl.value)) : 10;

    let pieCapitalUF = 0;
    let pieTotalUF = 0;
    let montoFinanciarUF = 0;

    // Lógica bidireccional
    if (triggeredBy === 'qty' || triggeredBy === 'init') {
        // En inicialización o cambio de cantidad, calcular descuento porcentual exacto
        descPercent = valorRealUF > 0 ? ((valorRealUF - valorPromoUF) / valorRealUF) * 100 : 0;
        if (descPercentEl) descPercentEl.value = Math.round(descPercent).toString();
        
        pieCapitalUF = valorPromoUF * (piePercent / 100);
        pieTotalUF = pieCapitalUF * 1.19;
        montoFinanciarUF = valorPromoUF - pieCapitalUF;
    } else if (triggeredBy === 'discount-manual' && descPercentEl) {
        descPercent = parseFloat(descPercentEl.value) || 0;
        valorPromoUF = valorRealUF * (1 - descPercent / 100);
        
        pieCapitalUF = valorPromoUF * (piePercent / 100);
        pieTotalUF = pieCapitalUF * 1.19;
        montoFinanciarUF = valorPromoUF - pieCapitalUF;
    } else if (triggeredBy === 'ni-uf' && valorNiUfDisplay) {
        valorPromoUF = parseFloat(valorNiUfDisplay.value) || 0;
        const descUF = Math.max(0, valorRealUF - valorPromoUF);
        descPercent = valorRealUF > 0 ? (descUF / valorRealUF) * 100 : 0;
        if (descPercentEl) descPercentEl.value = Math.round(descPercent).toString();
        
        pieCapitalUF = valorPromoUF * (piePercent / 100);
        pieTotalUF = pieCapitalUF * 1.19;
        montoFinanciarUF = valorPromoUF - pieCapitalUF;
    } else if (triggeredBy === 'ni-clp' && valorNiClpInput) {
        const clpVal = parseCLP(valorNiClpInput.value);
        valorPromoUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (valorNiUfDisplay) valorNiUfDisplay.value = valorPromoUF.toFixed(2);
        
        const descUF = Math.max(0, valorRealUF - valorPromoUF);
        descPercent = valorRealUF > 0 ? (descUF / valorRealUF) * 100 : 0;
        if (descPercentEl) descPercentEl.value = Math.round(descPercent).toString();
        
        pieCapitalUF = valorPromoUF * (piePercent / 100);
        pieTotalUF = pieCapitalUF * 1.19;
        montoFinanciarUF = valorPromoUF - pieCapitalUF;
    } else if (triggeredBy === 'ref-uf' || triggeredBy === 'ref-clp') {
        valorPromoUF = valorRealUF * (1 - descPercent / 100);
        
        pieCapitalUF = valorPromoUF * (piePercent / 100);
        pieTotalUF = pieCapitalUF * 1.19;
        montoFinanciarUF = valorPromoUF - pieCapitalUF;
    } else if (triggeredBy === 'pie-percent' && piePercentEl) {
        piePercent = parseFloat(piePercentEl.value) || 0;
        
        pieCapitalUF = valorPromoUF * (piePercent / 100);
        pieTotalUF = pieCapitalUF * 1.19;
        montoFinanciarUF = valorPromoUF - pieCapitalUF;
    } else if (triggeredBy === 'pie-uf' && pieUfInput) {
        pieTotalUF = parseFloat(pieUfInput.value) || 0;
        pieCapitalUF = pieTotalUF / 1.19;
        piePercent = valorPromoUF > 0 ? (pieCapitalUF / valorPromoUF) * 100 : 0;
        if (piePercentEl) piePercentEl.value = Math.round(piePercent).toString();
        montoFinanciarUF = valorPromoUF - pieCapitalUF;
    } else if (triggeredBy === 'pie-clp' && pieClpInput) {
        const clpVal = parseCLP(pieClpInput.value);
        pieTotalUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (pieUfInput) pieUfInput.value = pieTotalUF.toFixed(2);
        
        pieCapitalUF = pieTotalUF / 1.19;
        piePercent = valorPromoUF > 0 ? (pieCapitalUF / valorPromoUF) * 100 : 0;
        if (piePercentEl) piePercentEl.value = Math.round(piePercent).toString();
        montoFinanciarUF = valorPromoUF - pieCapitalUF;
    } else if (triggeredBy === 'saldo-uf' && saldoFinanciarUfInput) {
        montoFinanciarUF = parseFloat(saldoFinanciarUfInput.value) || 0;
        pieCapitalUF = valorPromoUF - montoFinanciarUF;
        pieTotalUF = pieCapitalUF * 1.19;
        piePercent = valorPromoUF > 0 ? (pieCapitalUF / valorPromoUF) * 100 : 0;
        if (piePercentEl) piePercentEl.value = Math.round(piePercent).toString();
    } else if (triggeredBy === 'saldo-clp' && saldoFinanciarClpInput) {
        const clpVal = parseCLP(saldoFinanciarClpInput.value);
        montoFinanciarUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (saldoFinanciarUfInput) saldoFinanciarUfInput.value = montoFinanciarUF.toFixed(2);
        
        pieCapitalUF = valorPromoUF - montoFinanciarUF;
        pieTotalUF = pieCapitalUF * 1.19;
        piePercent = valorPromoUF > 0 ? (pieCapitalUF / valorPromoUF) * 100 : 0;
        if (piePercentEl) piePercentEl.value = Math.round(piePercent).toString();
    } else {
        pieCapitalUF = valorPromoUF * (piePercent / 100);
        pieTotalUF = pieCapitalUF * 1.19;
        montoFinanciarUF = valorPromoUF - pieCapitalUF;
    }

    // Actualizar valor de descuento en pantalla
    const descuentoUF = Math.max(0, valorRealUF - valorPromoUF);
    const descuentoCLP = descuentoUF * currentUFValue;
    const descUfOutput = document.getElementById('label-descuento-uf');
    const descOutput = document.getElementById('label-descuento-output');
    if (descUfOutput) {
        descUfOutput.textContent = `${descuentoUF.toFixed(2).replace('.', ',')} UF`;
    }
    if (descOutput) {
        descOutput.textContent = formatCurrency(Math.round(descuentoCLP));
    }

    // Actualizar valor promocional en pantalla
    if (valorNiUfDisplay && document.activeElement !== valorNiUfDisplay) {
        valorNiUfDisplay.value = valorPromoUF.toFixed(2);
    }
    const valorPromoCLP = valorPromoUF * currentUFValue;
    if (valorNiClpInput && document.activeElement !== valorNiClpInput) {
        setCLPValue(valorNiClpInput, Math.round(valorPromoCLP));
    }

    // Actualizar Pie Capital (desglose)
    const labelPieCapitalUf = document.getElementById('label-pie-capital-uf');
    const labelPieCapitalClp = document.getElementById('label-pie-capital-output');
    if (labelPieCapitalUf) {
        labelPieCapitalUf.textContent = `${pieCapitalUF.toFixed(2).replace('.', ',')} UF`;
    }
    if (labelPieCapitalClp) {
        labelPieCapitalClp.textContent = formatCurrency(Math.round(pieCapitalUF * currentUFValue));
    }

    // Actualizar IVA Pie (desglose)
    const ivaPieUF = pieCapitalUF * 0.19;
    const labelIvaPieUf = document.getElementById('label-iva-pie-uf');
    const labelIvaPieClp = document.getElementById('label-iva-pie-output');
    if (labelIvaPieUf) {
        labelIvaPieUf.textContent = `${ivaPieUF.toFixed(2).replace('.', ',')} UF`;
    }
    if (labelIvaPieClp) {
        labelIvaPieClp.textContent = formatCurrency(Math.round(ivaPieUF * currentUFValue));
    }

    // Actualizar Pie Total en inputs
    if (pieUfInput && document.activeElement !== pieUfInput) {
        pieUfInput.value = pieTotalUF.toFixed(2);
    }
    const pieTotalCLP = pieTotalUF * currentUFValue;
    if (pieClpInput && document.activeElement !== pieClpInput) {
        setCLPValue(pieClpInput, Math.round(pieTotalCLP));
    }

    // Actualizar Monto a Financiar (Saldo)
    if (saldoFinanciarUfInput && document.activeElement !== saldoFinanciarUfInput) {
        saldoFinanciarUfInput.value = montoFinanciarUF.toFixed(2);
    }
    const montoFinanciarCLP = montoFinanciarUF * currentUFValue;
    if (saldoFinanciarClpInput && document.activeElement !== saldoFinanciarClpInput) {
        setCLPValue(saldoFinanciarClpInput, Math.round(montoFinanciarCLP));
    }

    // Calcular cuotas
    const plazos = [12, 24, 36, 48];

    plazos.forEach(plazo => {
        let cuotaCLP = 0;
        let cuotaUF = 0;

        if (plazo <= 24) {
            // Hasta 24 cuotas: dividir monto a financiar por plazo, sumarle 19% IVA, más GA 3500 y seguro 1750
            const cuotaNetaBase = montoFinanciarCLP / plazo;
            const cuotaConIva = cuotaNetaBase * 1.19;
            cuotaCLP = Math.round(cuotaConIva + 3500 + 1750);
            cuotaUF = currentUFValue > 0 ? (cuotaCLP / currentUFValue) : 0;
        } else {
            // De 36 cuotas para arriba: se calcula en UF sumando 0.15 UF de cargos fijos
            const cuotaNetaBaseUF = montoFinanciarUF / plazo;
            const cuotaConIvaUF = cuotaNetaBaseUF * 1.19;
            cuotaUF = cuotaConIvaUF + 0.15;
            cuotaCLP = Math.round(cuotaUF * currentUFValue);
        }

        const factorEl = document.getElementById(`factor-${plazo}`);
        const cuotaEl = document.getElementById(`cuota-${plazo}`);

        if (factorEl) factorEl.textContent = cuotaUF.toFixed(4).replace('.', ',');
        if (cuotaEl) cuotaEl.textContent = formatCurrency(cuotaCLP);
    });

    renderCremacionGraphic(qty);
}

// Inicialización de la página dedicada a Cremación Anticipada
document.addEventListener('DOMContentLoaded', () => {
    initDOMElements();

    const today = new Date();
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        dateEl.textContent = today.toLocaleDateString('es-CL', { 
            day: '2-digit', month: '2-digit', year: 'numeric' 
        }).replace(/\//g, '-');
    }

    const qtyInput = document.getElementById('cantidad-rights');
    if (qtyInput) {
        qtyInput.addEventListener('input', () => calculateCremacion('qty'));
        qtyInput.addEventListener('change', () => calculateCremacion('qty'));
    }

    const parkSelector = document.getElementById('parque-name') || document.getElementById('parque-select');
    const displayEl = document.getElementById('park-name-display') || document.getElementById('park-display');
    if (displayEl && parkSelector) {
        displayEl.textContent = 'PARQUE ' + parkSelector.value.replace(/_/g, ' ');
    }

    if (parkSelector) {
        parkSelector.addEventListener('change', () => {
            if (displayEl) displayEl.textContent = 'PARQUE ' + parkSelector.value.replace(/_/g, ' ');
            calculateCremacion('park');
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
    if (refUfInput) {
        refUfInput.addEventListener('input', () => calculateCremacion('ref-uf'));
    }

    const refClpInput = document.getElementById('ref-clp-input');
    if (refClpInput) {
        refClpInput.addEventListener('input', () => {
            const val = parseCLP(refClpInput.value);
            const calcUf = currentUFValue > 0 ? (val / currentUFValue) : 0;
            if (refUfInput) refUfInput.value = calcUf > 0 ? calcUf.toFixed(2) : '';
            calculateCremacion('ref-clp');
        });
        refClpInput.addEventListener('blur', () => {
            const val = parseCLP(refClpInput.value);
            if (val > 0) setCLPValue(refClpInput, val);
        });
    }

    const descPercentEl = document.getElementById('porcentaje-descuento-main');
    if (descPercentEl) {
        descPercentEl.addEventListener('input', () => calculateCremacion('discount-manual'));
    }

    const valorNiUf = document.getElementById('valor-ni-uf');
    if (valorNiUf) {
        valorNiUf.addEventListener('input', () => calculateCremacion('ni-uf'));
    }

    const valorNiClpInput = document.getElementById('valor-ni-clp-input');
    if (valorNiClpInput) {
        valorNiClpInput.addEventListener('input', () => calculateCremacion('ni-clp'));
        valorNiClpInput.addEventListener('blur', () => {
            const val = parseCLP(valorNiClpInput.value);
            if (val > 0) setCLPValue(valorNiClpInput, val);
        });
    }

    const piePercentEl = document.getElementById('pie-percent');
    if (piePercentEl) {
        piePercentEl.addEventListener('input', () => calculateCremacion('pie-percent'));
    }

    const pieUfInput = document.getElementById('pie-uf');
    if (pieUfInput) {
        pieUfInput.addEventListener('input', () => calculateCremacion('pie-uf'));
    }

    const pieClpInput = document.getElementById('pie-clp-input');
    if (pieClpInput) {
        pieClpInput.addEventListener('input', () => calculateCremacion('pie-clp'));
        pieClpInput.addEventListener('blur', () => {
            const val = parseCLP(pieClpInput.value);
            if (val > 0) setCLPValue(pieClpInput, val);
        });
    }

    const saldoFinanciarUfInput = document.getElementById('saldo-financiar-uf-input');
    if (saldoFinanciarUfInput) {
        saldoFinanciarUfInput.addEventListener('input', () => calculateCremacion('saldo-uf'));
    }

    const saldoFinanciarClpInput = document.getElementById('saldo-financiar-clp-input');
    if (saldoFinanciarClpInput) {
        saldoFinanciarClpInput.addEventListener('input', () => calculateCremacion('saldo-clp'));
        saldoFinanciarClpInput.addEventListener('blur', () => {
            const val = parseCLP(saldoFinanciarClpInput.value);
            if (val > 0) setCLPValue(saldoFinanciarClpInput, val);
        });
    }

    fetchUFValue().then(() => {
        calculateCremacion('init');
    }).catch(() => {
        calculateCremacion('init');
    });
});

function renderCremacionGraphic(count) {
    const container = document.getElementById('sepultacion-graphic-container');
    if (!container) return;

    container.style.display = 'block';
    container.style.width = '100%';
    container.style.maxWidth = '250px';
    container.style.margin = '15px auto 0 auto';
    container.classList.add('active');
    container.innerHTML = '';

    container.style.maxWidth = '100%';
    const bannerImg = document.createElement('img');
    bannerImg.src = 'cremacion.png';
    bannerImg.alt = 'Servicio de Cremación';
    bannerImg.style.width = '100%';
    bannerImg.style.maxWidth = '100%';
    bannerImg.style.height = 'auto';
    bannerImg.style.borderRadius = '8px';
    bannerImg.style.marginBottom = '12px';
    bannerImg.style.border = '1px solid #00763a';
    bannerImg.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
    container.appendChild(bannerImg);

    const gridContainer = document.createElement('div');
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = 'repeat(2, minmax(100px, 1fr))';
    gridContainer.style.gap = '10px';
    gridContainer.style.padding = '5px';
    gridContainer.style.width = '100%';
    
    for (let i = 0; i < count; i++) {
        const anforaWrapper = document.createElement('div');
        anforaWrapper.style.display = 'flex';
        anforaWrapper.style.flexDirection = 'column';
        anforaWrapper.style.alignItems = 'center';
        anforaWrapper.style.padding = '8px';
        anforaWrapper.style.border = '2px dashed var(--primary-green)';
        anforaWrapper.style.borderRadius = '10px';
        anforaWrapper.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        anforaWrapper.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';

        const img = document.createElement('img');
        img.src = 'anfora.png';
        img.alt = 'Ánfora ' + (i + 1);
        img.style.width = '55px';
        img.style.height = '55px';
        img.style.objectFit = 'contain';
        img.style.marginBottom = '4px';

        const label = document.createElement('span');
        label.textContent = 'Ánfora ' + (i + 1);
        label.style.fontSize = '12px';
        label.style.fontWeight = 'bold';
        label.style.color = 'var(--text-dark)';

        anforaWrapper.appendChild(img);
        anforaWrapper.appendChild(label);
        gridContainer.appendChild(anforaWrapper);
    }
    
    container.appendChild(gridContainer);
}
