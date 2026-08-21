// js/products/sepultacion.js - Lógica Financiera e Inicialización de Derecho de Sepultación

function calculateSepultacion(triggeredBy = '') {
    const refUfInput = document.getElementById('ref-uf-input');
    const refClpInput = document.getElementById('ref-clp-input');
    const valorNiUfDisplay = document.getElementById('valor-ni-uf');
    const valorNiClpInput = document.getElementById('valor-ni-clp-input');
    const descuentoUfInput = document.getElementById('descuento-uf-input');
    const descOutput = document.getElementById('label-descuento-output');

    let valorRealUF = parseFloat(refUfInput && refUfInput.value ? refUfInput.value : '0') || 0;
    let valorPromoUF = parseFloat(valorNiUfDisplay && valorNiUfDisplay.value ? valorNiUfDisplay.value : '0') || 0;

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

    // Bidireccionalidad Valor Promocional UF <-> CLP
    if (triggeredBy === 'ni-clp' && valorNiClpInput) {
        const clpVal = parseCLP(valorNiClpInput.value);
        valorPromoUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (valorNiUfDisplay) valorNiUfDisplay.value = valorPromoUF > 0 ? valorPromoUF.toFixed(2) : '';
    } else if (triggeredBy === 'ni-uf' && valorNiUfDisplay) {
        valorPromoUF = parseFloat(valorNiUfDisplay.value) || 0;
        if (valorNiClpInput && document.activeElement !== valorNiClpInput) {
            setCLPValue(valorNiClpInput, valorPromoUF > 0 ? Math.round(valorPromoUF * currentUFValue) : '');
        }
    }

    // Si se modifica manualmente el descuento
    if (triggeredBy === 'descuento-uf' && descuentoUfInput) {
        const descUF = parseFloat(descuentoUfInput.value) || 0;
        valorPromoUF = Math.max(0, valorRealUF - descUF);
        if (valorNiUfDisplay) valorNiUfDisplay.value = valorPromoUF > 0 ? valorPromoUF.toFixed(2) : '';
        if (valorNiClpInput) setCLPValue(valorNiClpInput, valorPromoUF > 0 ? Math.round(valorPromoUF * currentUFValue) : '');
    }

    // Calcular Descuento (Valor Real - Valor Promocional)
    const descuentoUF = (valorRealUF > 0 && valorPromoUF > 0) ? Math.max(0, valorRealUF - valorPromoUF) : 0;
    const descuentoCLP = descuentoUF * currentUFValue;

    if (descuentoUfInput && document.activeElement !== descuentoUfInput) {
        descuentoUfInput.value = descuentoUF > 0 ? descuentoUF.toFixed(2) : '';
    }
    if (descOutput) {
        descOutput.textContent = descuentoCLP > 0 ? formatCurrency(Math.round(descuentoCLP)) : '$0';
    }

    // Actualizar valores CLP al cambiar UF manualmente o en inicio
    if (triggeredBy === 'uf-manual' || triggeredBy === 'init') {
        if (refClpInput && valorRealUF > 0) setCLPValue(refClpInput, Math.round(valorRealUF * currentUFValue));
        if (valorNiClpInput && valorPromoUF > 0) setCLPValue(valorNiClpInput, Math.round(valorPromoUF * currentUFValue));
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
            window.location.href = productPageMap[productSelector.value] || 'index.html';
        });
    }

    // Event listeners de inputs
    const ufInput = document.getElementById('uf-value-input');
    if (ufInput) {
        ufInput.addEventListener('input', () => {
            const val = parseFloat(ufInput.value);
            if (!isNaN(val) && val > 0) {
                currentUFValue = val;
                calculateSepultacion('uf-manual');
            }
        });
    }

    const refUfInput = document.getElementById('ref-uf-input');
    if (refUfInput) {
        refUfInput.addEventListener('input', () => calculateSepultacion('ref-uf'));
    }

    const refClpInput = document.getElementById('ref-clp-input');
    if (refClpInput) {
        refClpInput.addEventListener('input', () => calculateSepultacion('ref-clp'));
        refClpInput.addEventListener('blur', () => {
            const val = parseCLP(refClpInput.value);
            if (val > 0) setCLPValue(refClpInput, val);
        });
    }

    const valorNiUf = document.getElementById('valor-ni-uf');
    if (valorNiUf) {
        valorNiUf.addEventListener('input', () => calculateSepultacion('ni-uf'));
    }

    const valorNiClpInput = document.getElementById('valor-ni-clp-input');
    if (valorNiClpInput) {
        valorNiClpInput.addEventListener('input', () => calculateSepultacion('ni-clp'));
        valorNiClpInput.addEventListener('blur', () => {
            const val = parseCLP(valorNiClpInput.value);
            if (val > 0) setCLPValue(valorNiClpInput, val);
        });
    }

    const descuentoUfInput = document.getElementById('descuento-uf-input');
    if (descuentoUfInput) {
        descuentoUfInput.addEventListener('input', () => calculateSepultacion('descuento-uf'));
    }

    fetchUFValue().then(() => {
        calculateSepultacion('init');
    }).catch(() => {
        calculateSepultacion('init');
    });
});
