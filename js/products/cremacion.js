// js/products/cremacion.js - Lógica Financiera e Inicialización de Cremación Anticipada

function calculateCremacion(triggeredBy = '') {
    const qtyInput = document.getElementById('cantidad-rights');
    if (!qtyInput) return;
    const qty = parseInt(qtyInput.value) || 1;

    // 1. Obtener Valor Real base según cantidad de ánforas (30 UF por ánfora)
    const valorRealBase = 30.00 * qty;

    const refUfInput = document.getElementById('ref-uf-input');
    const refClpInput = document.getElementById('ref-clp-input');

    if (triggeredBy === 'qty' || triggeredBy === 'init' || (refUfInput && refUfInput.value.trim() === '')) {
        if (refUfInput) refUfInput.value = valorRealBase.toFixed(2);
    }

    const valorRealUF = parseFloat(refUfInput ? refUfInput.value : '') || valorRealBase;
    const valorRealCLP = valorRealUF * currentUFValue;

    if (refClpInput && document.activeElement !== refClpInput) {
        setCLPValue(refClpInput, Math.round(valorRealCLP));
    }

    // 2. Descuento %, Valor Promocional y Pie
    const descPercentEl = document.getElementById('porcentaje-descuento-main');
    const valorNiUfDisplay = document.getElementById('valor-ni-uf');
    const valorNiClpInput = document.getElementById('valor-ni-clp-input');
    const piePercentEl = document.getElementById('pie-percent');
    const pieUfInput = document.getElementById('pie-uf');
    const pieClpInput = document.getElementById('pie-clp-input');
    const saldoFinanciarUfInput = document.getElementById('saldo-financiar-uf-input');
    const saldoFinanciarClpInput = document.getElementById('saldo-financiar-clp-input');

    // Valores promocionales fijos en CLP según cantidad
    const valoresCremacionCLP = {
        1: 1102806,
        2: 1699143,
        3: 2287308,
        4: 2679418
    };

    let descPercent = descPercentEl ? (parseFloat(descPercentEl.value) || 0) : 0;
    let valorPromoUF = valorRealUF * (1 - descPercent / 100);
    let piePercent = piePercentEl ? (parseFloat(piePercentEl.value) || 0) : 10;
    let pieUF = valorRealUF * (piePercent / 100);
    let saldoUF = valorPromoUF - pieUF;

    // Lógica bidireccional
    if (triggeredBy === 'qty' || triggeredBy === 'init') {
        // En inicialización o cambio de cantidad, se fuerza el valor promocional fijo si existe en el mapa
        const fixedPromoCLP = valoresCremacionCLP[qty] || (1102806 * qty);
        valorPromoUF = currentUFValue > 0 ? (fixedPromoCLP / currentUFValue) : 0;
        
        // Recalcular Descuento
        const descUF = Math.max(0, valorRealUF - valorPromoUF);
        descPercent = valorRealUF > 0 ? (descUF / valorRealUF) * 100 : 0;
        if (descPercentEl) descPercentEl.value = Math.round(descPercent).toString();
        
        // Recalcular Saldo
        pieUF = valorPromoUF * (piePercent / 100);
        saldoUF = valorPromoUF - pieUF;
    } else if (triggeredBy === 'saldo-uf' && saldoFinanciarUfInput) {
        saldoUF = parseFloat(saldoFinanciarUfInput.value) || 0;
        pieUF = parseFloat(pieUfInput ? pieUfInput.value : '') || 0;
        valorPromoUF = saldoUF + pieUF;

        const descUF = Math.max(0, valorRealUF - valorPromoUF);
        descPercent = valorRealUF > 0 ? (descUF / valorRealUF) * 100 : 0;
        if (descPercentEl) descPercentEl.value = Math.round(descPercent).toString();
    } else if (triggeredBy === 'saldo-clp' && saldoFinanciarClpInput) {
        const clpVal = parseCLP(saldoFinanciarClpInput.value);
        saldoUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (saldoFinanciarUfInput) saldoFinanciarUfInput.value = saldoUF.toFixed(2);
        
        pieUF = parseFloat(pieUfInput ? pieUfInput.value : '') || 0;
        valorPromoUF = saldoUF + pieUF;

        const descUF = Math.max(0, valorRealUF - valorPromoUF);
        descPercent = valorRealUF > 0 ? (descUF / valorRealUF) * 100 : 0;
        if (descPercentEl) descPercentEl.value = Math.round(descPercent).toString();
    } else if (triggeredBy === 'ni-uf' && valorNiUfDisplay) {
        valorPromoUF = parseFloat(valorNiUfDisplay.value) || 0;
        const descUF = Math.max(0, valorRealUF - valorPromoUF);
        descPercent = valorRealUF > 0 ? (descUF / valorRealUF) * 100 : 0;
        if (descPercentEl) descPercentEl.value = Math.round(descPercent).toString();
        saldoUF = valorPromoUF - pieUF;
    } else if (triggeredBy === 'ni-clp' && valorNiClpInput) {
        const clpVal = parseCLP(valorNiClpInput.value);
        valorPromoUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (valorNiUfDisplay) valorNiUfDisplay.value = valorPromoUF.toFixed(2);
        
        const descUF = Math.max(0, valorRealUF - valorPromoUF);
        descPercent = valorRealUF > 0 ? (descUF / valorRealUF) * 100 : 0;
        if (descPercentEl) descPercentEl.value = Math.round(descPercent).toString();
        saldoUF = valorPromoUF - pieUF;
    } else if (triggeredBy === 'discount-manual' && descPercentEl) {
        descPercent = parseFloat(descPercentEl.value) || 0;
        valorPromoUF = valorRealUF * (1 - descPercent / 100);
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
        descPercent = descPercentEl ? (parseFloat(descPercentEl.value) || 0) : 0;
        valorPromoUF = valorRealUF * (1 - descPercent / 100);
        piePercent = piePercentEl ? (parseFloat(piePercentEl.value) || 0) : 10;
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
    if (descOutput) {
        descOutput.textContent = `${descuentoUF.toFixed(2).replace('.', ',')} UF (${formatCurrency(Math.round(descuentoCLP))})`;
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

    // Calcular cuotas (12, 24, 36, 48 plazos con $5.250 de recargo fijo de GA + Seguro)
    const plazos = [12, 24, 36, 48];
    const recargoFijoCLP = 3500 + 1750; // $5.250 CLP

    plazos.forEach(plazo => {
        const cuotaCLP = Math.round((saldoCLP / plazo) + recargoFijoCLP);
        const cuotaUF = currentUFValue > 0 ? (cuotaCLP / currentUFValue) : 0;

        const factorEl = document.getElementById(`factor-${plazo}`);
        const cuotaEl = document.getElementById(`cuota-${plazo}`);

        if (factorEl) factorEl.textContent = cuotaUF.toFixed(4).replace('.', ',');
        if (cuotaEl) cuotaEl.textContent = formatCurrency(cuotaCLP);
    });

    if (typeof renderVisualGraphic === 'function') {
        renderVisualGraphic('cremacion', qty);
    }
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
