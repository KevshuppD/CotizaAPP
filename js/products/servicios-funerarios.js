// js/products/servicios-funerarios.js - Lógica Financiera e Inicialización de Servicios Funerarios

function calculateServiciosFunerarios(triggeredBy = '') {
    const typeSelector = document.getElementById('funerario-type');
    const qtySelector = document.getElementById('funerario-qty');

    const serviceType = typeSelector ? typeSelector.value : 'INICIAL';
    const qty = parseInt(qtySelector ? qtySelector.value : '1') || 1;

    // 1. Obtener valor real base según tipo y cantidad
    const valorUnitario = (serviceType === 'INICIAL') ? 35 : 40;
    const valorRealBase = valorUnitario * qty;

    const refUfInput = document.getElementById('ref-uf-input');
    const refClpInput = document.getElementById('ref-clp-input');

    // Actualizar Valor Real si fue disparado por cambio de selectores o al inicio
    if (triggeredBy === 'service-type' || triggeredBy === 'qty' || triggeredBy === 'init' || (refUfInput && refUfInput.value.trim() === '')) {
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
    const piePercentEl = document.getElementById('pie-percent');
    const pieUfInput = document.getElementById('pie-uf');
    const pieClpInput = document.getElementById('pie-clp-input');
    const saldoFinanciarUfInput = document.getElementById('saldo-financiar-uf-input');
    const saldoFinanciarClpInput = document.getElementById('saldo-financiar-clp-input');

    let descPercent = descPercentEl ? (parseFloat(descPercentEl.value) || 0) : 0;
    let valorPromoUF = valorRealUF * (1 - descPercent / 100);
    let piePercent = piePercentEl ? (parseFloat(piePercentEl.value) || 0) : 10;
    let pieUF = valorRealUF * (piePercent / 100);
    let saldoUF = valorPromoUF - pieUF;

    // Lógica principal bidireccional dependiendo del input gatillado
    if (triggeredBy === 'saldo-uf' && saldoFinanciarUfInput) {
        saldoUF = parseFloat(saldoFinanciarUfInput.value) || 0;
        // Leer Pie actual en UF
        pieUF = parseFloat(pieUfInput ? pieUfInput.value : '') || 0;
        valorPromoUF = saldoUF + pieUF;
        
        // Recalcular Descuento
        const descUF = Math.max(0, valorRealUF - valorPromoUF);
        descPercent = valorRealUF > 0 ? (descUF / valorRealUF) * 100 : 0;
        if (descPercentEl) descPercentEl.value = Math.round(descPercent).toString();
    } else if (triggeredBy === 'saldo-clp' && saldoFinanciarClpInput) {
        const clpVal = parseCLP(saldoFinanciarClpInput.value);
        saldoUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (saldoFinanciarUfInput) saldoFinanciarUfInput.value = saldoUF.toFixed(2);
        
        // Leer Pie actual en UF
        pieUF = parseFloat(pieUfInput ? pieUfInput.value : '') || 0;
        valorPromoUF = saldoUF + pieUF;

        // Recalcular Descuento
        const descUF = Math.max(0, valorRealUF - valorPromoUF);
        descPercent = valorRealUF > 0 ? (descUF / valorRealUF) * 100 : 0;
        if (descPercentEl) descPercentEl.value = Math.round(descPercent).toString();
    } else if (triggeredBy === 'ni-uf' && valorNiUfDisplay) {
        valorPromoUF = parseFloat(valorNiUfDisplay.value) || 0;
        const descUF = Math.max(0, valorRealUF - valorPromoUF);
        descPercent = valorRealUF > 0 ? (descUF / valorRealUF) * 100 : 0;
        if (descPercentEl) descPercentEl.value = Math.round(descPercent).toString();
        
        // Recalcular Saldo
        piePercent = piePercentEl ? (parseFloat(piePercentEl.value) || 0) : 10;
        pieUF = valorRealUF * (piePercent / 100);
        saldoUF = valorPromoUF - pieUF;
    } else if (triggeredBy === 'ni-clp' && valorNiClpInput) {
        const clpVal = parseCLP(valorNiClpInput.value);
        valorPromoUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (valorNiUfDisplay) valorNiUfDisplay.value = valorPromoUF.toFixed(2);
        
        const descUF = Math.max(0, valorRealUF - valorPromoUF);
        descPercent = valorRealUF > 0 ? (descUF / valorRealUF) * 100 : 0;
        if (descPercentEl) descPercentEl.value = Math.round(descPercent).toString();
        
        // Recalcular Saldo
        piePercent = piePercentEl ? (parseFloat(piePercentEl.value) || 0) : 10;
        pieUF = valorRealUF * (piePercent / 100);
        saldoUF = valorPromoUF - pieUF;
    } else if (triggeredBy === 'pie-uf' && pieUfInput) {
        pieUF = parseFloat(pieUfInput.value) || 0;
        piePercent = valorRealUF > 0 ? (pieUF / valorRealUF) * 100 : 0;
        if (descPercentEl) descPercentEl.value = Math.round(descPercent).toString();
        saldoUF = valorPromoUF - pieUF;
    } else if (triggeredBy === 'pie-clp' && pieClpInput) {
        const clpVal = parseCLP(pieClpInput.value);
        pieUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (pieUfInput) pieUfInput.value = pieUF.toFixed(2);
        piePercent = valorRealUF > 0 ? (pieUF / valorRealUF) * 100 : 0;
        if (piePercentEl) piePercentEl.value = Math.round(piePercent).toString();
        saldoUF = valorPromoUF - pieUF;
    } else if (triggeredBy === 'pie-percent' && piePercentEl) {
        piePercent = parseFloat(piePercentEl.value) || 0;
        pieUF = valorRealUF * (piePercent / 100);
        if (pieUfInput) pieUfInput.value = pieUF.toFixed(2);
        saldoUF = valorPromoUF - pieUF;
    } else {
        descPercent = descPercentEl ? (parseFloat(descPercentEl.value) || 0) : 0;
        valorPromoUF = valorRealUF * (1 - descPercent / 100);
        piePercent = piePercentEl ? (parseFloat(piePercentEl.value) || 0) : 10;
        pieUF = valorRealUF * (piePercent / 100);
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

    // 6. Calcular Cuotas de Servicios Funerarios (12, 24, 36, 48 cuotas)
    const plazos = [12, 24, 36, 48];

    plazos.forEach(plazo => {
        let totalCuotaUF = 0;
        let totalCuotaCLP = 0;

        if (plazo <= 24) {
            // Hasta 24 cuotas: (Monto a financiar CLP / plazo) * 1.19 + $5.250
            const baseCLP = saldoCLP / plazo;
            const ivaCLP = baseCLP * 0.19;
            const recargoCLP = 5250;
            totalCuotaCLP = Math.round(baseCLP + ivaCLP + recargoCLP);
            totalCuotaUF = totalCuotaCLP / currentUFValue;
        } else {
            // Desde 36 cuotas en adelante: (Monto a financiar UF / plazo) * 1.19 + 0.15 UF
            const baseUF = saldoUF / plazo;
            const ivaUF = baseUF * 0.19;
            const recargoUF = 0.15;
            totalCuotaUF = baseUF + ivaUF + recargoUF;
            totalCuotaCLP = Math.round(totalCuotaUF * currentUFValue);
        }

        const factorEl = document.getElementById(`factor-${plazo}`);
        const cuotaEl = document.getElementById(`cuota-${plazo}`);
        
        if (factorEl) factorEl.textContent = totalCuotaUF.toFixed(4).replace('.', ',');
        if (cuotaEl) cuotaEl.textContent = formatCurrency(totalCuotaCLP);
    });

    // 7. Actualizar imagen de urna según tipo de servicio
    const serviceImage = document.getElementById('service-image');
    if (serviceImage) {
        if (serviceType === 'INICIAL') {
            serviceImage.src = 'src/urnabasica.jpeg';
            serviceImage.alt = 'Urna Básica';
        } else {
            serviceImage.src = 'src/plus.jpeg';
            serviceImage.alt = 'Urna Plus';
        }
    }
}

// Inicialización de la página dedicada a Servicios Funerarios
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

    // Configurar encabezado del producto
    const typeSelector = document.getElementById('funerario-type');
    const displayEl = document.getElementById('park-name-display') || document.getElementById('park-display');
    if (displayEl && typeSelector) {
        displayEl.textContent = 'FUNERARIO ' + typeSelector.value;
    }

    if (typeSelector) {
        typeSelector.addEventListener('change', () => {
            if (displayEl) displayEl.textContent = 'FUNERARIO ' + typeSelector.value;
            calculateServiciosFunerarios('service-type');
        });
    }

    const qtySelector = document.getElementById('funerario-qty');
    if (qtySelector) {
        qtySelector.addEventListener('change', () => calculateServiciosFunerarios('qty'));
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
            window.location.href = productPageMap[productSelector.value] || 'servicios-funerarios.html';
        });
    }

    // Event listeners de inputs numéricos específicos
    const ufInput = document.getElementById('uf-value-input');
    if (ufInput) {
        ufInput.addEventListener('input', () => {
            const val = parseFloat(ufInput.value);
            if (!isNaN(val) && val > 0) {
                currentUFValue = val;
                calculateServiciosFunerarios('uf-manual');
            }
        });
    }

    const refUfInput = document.getElementById('ref-uf-input');
    if (refUfInput) {
        refUfInput.addEventListener('input', () => calculateServiciosFunerarios('ref-uf'));
    }

    const refClpInput = document.getElementById('ref-clp-input');
    if (refClpInput) {
        refClpInput.addEventListener('input', () => {
            const val = parseCLP(refClpInput.value);
            const calcUf = currentUFValue > 0 ? (val / currentUFValue) : 0;
            if (refUfInput) refUfInput.value = calcUf > 0 ? calcUf.toFixed(2) : '';
            calculateServiciosFunerarios('ref-clp');
        });
        refClpInput.addEventListener('blur', () => {
            const val = parseCLP(refClpInput.value);
            if (val > 0) setCLPValue(refClpInput, val);
        });
    }

    const descPercentEl = document.getElementById('porcentaje-descuento-main');
    if (descPercentEl) {
        descPercentEl.addEventListener('input', () => calculateServiciosFunerarios('discount-manual'));
    }

    const valorNiUf = document.getElementById('valor-ni-uf');
    if (valorNiUf) {
        valorNiUf.addEventListener('input', () => calculateServiciosFunerarios('ni-uf'));
    }

    const valorNiClpInput = document.getElementById('valor-ni-clp-input');
    if (valorNiClpInput) {
        valorNiClpInput.addEventListener('input', () => calculateServiciosFunerarios('ni-clp'));
        valorNiClpInput.addEventListener('blur', () => {
            const val = parseCLP(valorNiClpInput.value);
            if (val > 0) setCLPValue(valorNiClpInput, val);
        });
    }

    const piePercentEl = document.getElementById('pie-percent');
    if (piePercentEl) {
        piePercentEl.addEventListener('input', () => calculateServiciosFunerarios('pie-percent'));
    }

    const pieUfInput = document.getElementById('pie-uf');
    if (pieUfInput) {
        pieUfInput.addEventListener('input', () => calculateServiciosFunerarios('pie-uf'));
    }

    const pieClpInput = document.getElementById('pie-clp-input');
    if (pieClpInput) {
        pieClpInput.addEventListener('input', () => calculateServiciosFunerarios('pie-clp'));
        pieClpInput.addEventListener('blur', () => {
            const val = parseCLP(pieClpInput.value);
            if (val > 0) setCLPValue(pieClpInput, val);
        });
    }

    const saldoFinanciarUfInput = document.getElementById('saldo-financiar-uf-input');
    if (saldoFinanciarUfInput) {
        saldoFinanciarUfInput.addEventListener('input', () => calculateServiciosFunerarios('saldo-uf'));
    }

    const saldoFinanciarClpInput = document.getElementById('saldo-financiar-clp-input');
    if (saldoFinanciarClpInput) {
        saldoFinanciarClpInput.addEventListener('input', () => calculateServiciosFunerarios('saldo-clp'));
        saldoFinanciarClpInput.addEventListener('blur', () => {
            const val = parseCLP(saldoFinanciarClpInput.value);
            if (val > 0) setCLPValue(saldoFinanciarClpInput, val);
        });
    }

    // Obtener valor UF del día por API
    fetchUFValue().then(() => {
        calculateServiciosFunerarios('init');
    }).catch(() => {
        calculateServiciosFunerarios('init');
    });
});
