// js/products/mantencion.js - Lógica Financiera de Mantención Perpetua

let mantencionState = {
    anualUF: 0,
    anualCLP: 0,
    valorRealUF: 0,
    valorRealCLP: 0,
    descuentoPercent: 0,
    descuentoUF: 0,
    descuentoCLP: 0,
    saldoUF: 0,
    saldoCLP: 0,
    selectedCuotas: 'all' // 'all', '1', '2', '3', '4', '5', '6'
};

function adjustInputFontSize(input) {
    if (!input) return;
    const len = (input.value || '').length;
    if (len > 14) {
        input.style.fontSize = '12px';
    } else if (len > 11) {
        input.style.fontSize = '13px';
    } else if (len > 9) {
        input.style.fontSize = '14px';
    } else {
        input.style.fontSize = '15px';
    }
}

function calculateMantencion(triggeredBy = '') {
    const ufVal = currentUFValue > 0 ? currentUFValue : 40844.79;

    // 1. Manejo de Mantención Anual (IVA incluido)
    const anualUfInput = document.getElementById('mantencion-anual-uf');
    const anualClpInput = document.getElementById('mantencion-anual-clp');

    if (triggeredBy === 'anual-uf') {
        mantencionState.anualUF = parseFloat(anualUfInput.value) || 0;
        mantencionState.anualCLP = Math.round(mantencionState.anualUF * ufVal);
        if (anualClpInput) {
            anualClpInput.value = mantencionState.anualCLP > 0 ? formatCurrency(mantencionState.anualCLP) : '';
        }
    } else if (triggeredBy === 'anual-clp') {
        mantencionState.anualCLP = parseCLP(anualClpInput.value);
        mantencionState.anualUF = ufVal > 0 ? mantencionState.anualCLP / ufVal : 0;
        if (anualUfInput) {
            anualUfInput.value = mantencionState.anualUF > 0 ? mantencionState.anualUF.toFixed(2) : '';
        }
    } else if (triggeredBy === 'uf-change' || triggeredBy === 'init') {
        if (mantencionState.anualUF > 0) {
            mantencionState.anualCLP = Math.round(mantencionState.anualUF * ufVal);
            if (anualClpInput) anualClpInput.value = formatCurrency(mantencionState.anualCLP);
        }
    }

    // 2. Manejo de Valor Real (IVA incluido)
    const realUfInput = document.getElementById('valor-real-uf');
    const realClpInput = document.getElementById('valor-real-clp');

    if (triggeredBy === 'real-uf') {
        mantencionState.valorRealUF = parseFloat(realUfInput.value) || 0;
        mantencionState.valorRealCLP = Math.round(mantencionState.valorRealUF * ufVal);
        if (realClpInput) {
            realClpInput.value = mantencionState.valorRealCLP > 0 ? formatCurrency(mantencionState.valorRealCLP) : '';
        }
    } else if (triggeredBy === 'real-clp') {
        mantencionState.valorRealCLP = parseCLP(realClpInput.value);
        mantencionState.valorRealUF = ufVal > 0 ? mantencionState.valorRealCLP / ufVal : 0;
        if (realUfInput) {
            realUfInput.value = mantencionState.valorRealUF > 0 ? mantencionState.valorRealUF.toFixed(2) : '';
        }
    } else if (triggeredBy === 'uf-change' || triggeredBy === 'init') {
        if (mantencionState.valorRealUF > 0) {
            mantencionState.valorRealCLP = Math.round(mantencionState.valorRealUF * ufVal);
            if (realClpInput) realClpInput.value = formatCurrency(mantencionState.valorRealCLP);
        }
    }

    // 3. Manejo de Descuento Comercial (%, UF, CLP)
    const descPercentInput = document.getElementById('descuento-percent');
    const descUfInput = document.getElementById('descuento-uf');
    const descClpInput = document.getElementById('descuento-clp');

    if (triggeredBy === 'desc-percent') {
        mantencionState.descuentoPercent = parseFloat(descPercentInput.value) || 0;
        mantencionState.descuentoUF = mantencionState.valorRealUF * (mantencionState.descuentoPercent / 100);
        mantencionState.descuentoCLP = Math.round(mantencionState.valorRealCLP * (mantencionState.descuentoPercent / 100));

        if (descUfInput) descUfInput.value = mantencionState.descuentoUF > 0 ? mantencionState.descuentoUF.toFixed(2) : '';
        if (descClpInput) descClpInput.value = mantencionState.descuentoCLP > 0 ? formatCurrency(mantencionState.descuentoCLP) : '';
    } else if (triggeredBy === 'desc-uf') {
        mantencionState.descuentoUF = parseFloat(descUfInput.value) || 0;
        mantencionState.descuentoCLP = Math.round(mantencionState.descuentoUF * ufVal);
        mantencionState.descuentoPercent = mantencionState.valorRealUF > 0 ? (mantencionState.descuentoUF / mantencionState.valorRealUF) * 100 : 0;

        if (descPercentInput) descPercentInput.value = mantencionState.descuentoPercent > 0 ? parseFloat(mantencionState.descuentoPercent.toFixed(1)) : '';
        if (descClpInput) descClpInput.value = mantencionState.descuentoCLP > 0 ? formatCurrency(mantencionState.descuentoCLP) : '';
    } else if (triggeredBy === 'desc-clp') {
        mantencionState.descuentoCLP = parseCLP(descClpInput.value);
        mantencionState.descuentoUF = ufVal > 0 ? mantencionState.descuentoCLP / ufVal : 0;
        mantencionState.descuentoPercent = mantencionState.valorRealCLP > 0 ? (mantencionState.descuentoCLP / mantencionState.valorRealCLP) * 100 : 0;

        if (descPercentInput) descPercentInput.value = mantencionState.descuentoPercent > 0 ? parseFloat(mantencionState.descuentoPercent.toFixed(1)) : '';
        if (descUfInput) descUfInput.value = mantencionState.descuentoUF > 0 ? mantencionState.descuentoUF.toFixed(2) : '';
    } else if (triggeredBy === 'real-uf' || triggeredBy === 'real-clp' || triggeredBy === 'uf-change') {
        // Recalcular descuento según porcentaje si existe
        if (mantencionState.descuentoPercent > 0) {
            mantencionState.descuentoUF = mantencionState.valorRealUF * (mantencionState.descuentoPercent / 100);
            mantencionState.descuentoCLP = Math.round(mantencionState.valorRealCLP * (mantencionState.descuentoPercent / 100));
            if (descUfInput) descUfInput.value = mantencionState.descuentoUF > 0 ? mantencionState.descuentoUF.toFixed(2) : '';
            if (descClpInput) descClpInput.value = mantencionState.descuentoCLP > 0 ? formatCurrency(mantencionState.descuentoCLP) : '';
        } else if (mantencionState.descuentoUF > 0) {
            mantencionState.descuentoCLP = Math.round(mantencionState.descuentoUF * ufVal);
            if (descClpInput) descClpInput.value = mantencionState.descuentoCLP > 0 ? formatCurrency(mantencionState.descuentoCLP) : '';
        }
    }

    // 4. Saldo a Financiar = Valor Real - Descuento
    mantencionState.saldoUF = Math.max(0, mantencionState.valorRealUF - mantencionState.descuentoUF);
    mantencionState.saldoCLP = Math.max(0, mantencionState.valorRealCLP - mantencionState.descuentoCLP);

    const saldoUfInput = document.getElementById('saldo-financiar-uf');
    const saldoClpInput = document.getElementById('saldo-financiar-clp');

    if (saldoUfInput) {
        saldoUfInput.value = mantencionState.saldoUF > 0 ? mantencionState.saldoUF.toFixed(2) : (mantencionState.valorRealUF > 0 ? '0.00' : '');
    }
    if (saldoClpInput) {
        saldoClpInput.value = mantencionState.saldoCLP > 0 ? formatCurrency(mantencionState.saldoCLP) : (mantencionState.valorRealCLP > 0 ? '$0' : '');
    }

    // 5. Renderizado de Cuotas
    renderCuotas();
}

function renderCuotas() {
    const cuotasBody = document.getElementById('mantencion-cuotas-body');
    if (!cuotasBody) return;

    const cuotasSelect = document.getElementById('cuotas-select');
    const selectedOption = cuotasSelect ? cuotasSelect.value : 'all';

    let plazos = [1, 2, 3, 4, 5, 6];
    const parsedOpt = parseInt(selectedOption, 10);
    if (!isNaN(parsedOpt) && parsedOpt >= 1 && parsedOpt <= 6) {
        plazos = [parsedOpt];
    }

    let html = '';

    plazos.forEach(n => {
        const cuotaUF = mantencionState.saldoUF > 0 ? (mantencionState.saldoUF / n) : 0;
        const cuotaCLP = mantencionState.saldoCLP > 0 ? Math.round(mantencionState.saldoCLP / n) : 0;
        const totalCLP = cuotaCLP * n;

        const valUFDisplay = cuotaUF > 0 ? cuotaUF.toFixed(2) : '';
        const valCLPDisplay = cuotaCLP > 0 ? formatCurrency(cuotaCLP) : '';
        const totalCLPDisplay = totalCLP > 0 ? formatCurrency(totalCLP) : '';

        const labelPlazo = n === 1 ? '1 cuota (Contado / Directo)' : `${n} cuotas`;

        html += `
            <tr id="cuota-row-${n}">
                <td style="font-weight: bold; color: #333; font-size: 14px;">${labelPlazo}</td>
                <td class="uf-col">
                    <input type="number" class="input-inline editable-field cuota-uf-input" data-plazo="${n}" value="${valUFDisplay}" placeholder="0.00" step="0.01" style="font-weight: bold; text-align: center; color: #168053; width: 100%; font-size: 15px;">
                </td>
                <td class="clp-col yellow-bg">
                    <div class="currency-input-wrapper" style="width: 100%;">
                        <input type="text" class="input-inline editable-field cuota-clp-input" data-plazo="${n}" value="${valCLPDisplay}" placeholder="$0" style="font-weight: bold; text-align: right; color: #189860; font-size: 15px; width: 100%;">
                    </div>
                </td>
                <td style="text-align: right;">
                    <div class="currency-input-wrapper" style="width: 100%;">
                        <input type="text" class="input-inline editable-field cuota-total-input" data-plazo="${n}" value="${totalCLPDisplay}" placeholder="$0" style="font-size: 15px; text-align: right; color: #222; font-weight: bold; width: 100%;">
                    </div>
                </td>
            </tr>
        `;
    });

    cuotasBody.innerHTML = html;

    // Ajustar tamaños de fuente de inicio
    document.querySelectorAll('.cuota-uf-input, .cuota-clp-input, .cuota-total-input').forEach(adjustInputFontSize);

    // Vincular event listeners para edición manual de cada cuota
    attachCuotasEventListeners();
}

function attachCuotasEventListeners() {
    const ufVal = currentUFValue > 0 ? currentUFValue : 40844.79;

    // 1. Edición de Cuota UF
    document.querySelectorAll('.cuota-uf-input').forEach(input => {
        input.addEventListener('input', (e) => {
            adjustInputFontSize(e.target);
            const plazo = parseInt(e.target.dataset.plazo, 10) || 1;
            const valUF = parseFloat(e.target.value) || 0;
            const valCLP = Math.round(valUF * ufVal);
            const totalCLP = valCLP * plazo;

            const row = document.getElementById(`cuota-row-${plazo}`);
            if (row) {
                const clpInput = row.querySelector('.cuota-clp-input');
                const totalInput = row.querySelector('.cuota-total-input');
                if (clpInput) {
                    clpInput.value = valCLP > 0 ? formatCurrency(valCLP) : '';
                    adjustInputFontSize(clpInput);
                }
                if (totalInput) {
                    totalInput.value = totalCLP > 0 ? formatCurrency(totalCLP) : '';
                    adjustInputFontSize(totalInput);
                }
            }
        });
    });

    // 2. Edición de Cuota CLP
    document.querySelectorAll('.cuota-clp-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const plazo = parseInt(e.target.dataset.plazo, 10) || 1;
            const valCLP = parseCLP(e.target.value);
            e.target.value = valCLP > 0 ? formatCurrency(valCLP) : '';
            adjustInputFontSize(e.target);

            const valUF = ufVal > 0 ? valCLP / ufVal : 0;
            const totalCLP = valCLP * plazo;

            const row = document.getElementById(`cuota-row-${plazo}`);
            if (row) {
                const ufInput = row.querySelector('.cuota-uf-input');
                const totalInput = row.querySelector('.cuota-total-input');
                if (ufInput) {
                    ufInput.value = valUF > 0 ? valUF.toFixed(2) : '';
                    adjustInputFontSize(ufInput);
                }
                if (totalInput) {
                    totalInput.value = totalCLP > 0 ? formatCurrency(totalCLP) : '';
                    adjustInputFontSize(totalInput);
                }
            }
        });
    });

    // 3. Edición de Total CLP
    document.querySelectorAll('.cuota-total-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const plazo = parseInt(e.target.dataset.plazo, 10) || 1;
            const totalCLP = parseCLP(e.target.value);
            e.target.value = totalCLP > 0 ? formatCurrency(totalCLP) : '';
            adjustInputFontSize(e.target);

            const valCLP = plazo > 0 ? Math.round(totalCLP / plazo) : 0;
            const valUF = ufVal > 0 ? valCLP / ufVal : 0;

            const row = document.getElementById(`cuota-row-${plazo}`);
            if (row) {
                const ufInput = row.querySelector('.cuota-uf-input');
                const clpInput = row.querySelector('.cuota-clp-input');
                if (ufInput) {
                    ufInput.value = valUF > 0 ? valUF.toFixed(2) : '';
                    adjustInputFontSize(ufInput);
                }
                if (clpInput) {
                    clpInput.value = valCLP > 0 ? formatCurrency(valCLP) : '';
                    adjustInputFontSize(clpInput);
                }
            }
        });
    });
}

// Inicialización de DOM y Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initDOMElements();

    // Fecha actual
    const today = new Date();
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        dateEl.textContent = today.toLocaleDateString('es-CL', { 
            day: '2-digit', month: '2-digit', year: 'numeric' 
        }).replace(/\//g, '-');
    }

    // 1. Mantención Anual
    const anualUfInput = document.getElementById('mantencion-anual-uf');
    if (anualUfInput) {
        anualUfInput.addEventListener('input', () => calculateMantencion('anual-uf'));
    }

    const anualClpInput = document.getElementById('mantencion-anual-clp');
    if (anualClpInput) {
        anualClpInput.addEventListener('input', (e) => {
            const parsed = parseCLP(e.target.value);
            e.target.value = parsed > 0 ? formatCurrency(parsed) : '';
            calculateMantencion('anual-clp');
        });
    }

    // 2. Valor Real
    const realUfInput = document.getElementById('valor-real-uf');
    if (realUfInput) {
        realUfInput.addEventListener('input', () => calculateMantencion('real-uf'));
    }

    const realClpInput = document.getElementById('valor-real-clp');
    if (realClpInput) {
        realClpInput.addEventListener('input', (e) => {
            const parsed = parseCLP(e.target.value);
            e.target.value = parsed > 0 ? formatCurrency(parsed) : '';
            calculateMantencion('real-clp');
        });
    }

    // 3. Descuento Comercial
    const descPercentInput = document.getElementById('descuento-percent');
    if (descPercentInput) {
        descPercentInput.addEventListener('input', () => calculateMantencion('desc-percent'));
    }

    const descUfInput = document.getElementById('descuento-uf');
    if (descUfInput) {
        descUfInput.addEventListener('input', () => calculateMantencion('desc-uf'));
    }

    const descClpInput = document.getElementById('descuento-clp');
    if (descClpInput) {
        descClpInput.addEventListener('input', (e) => {
            const parsed = parseCLP(e.target.value);
            e.target.value = parsed > 0 ? formatCurrency(parsed) : '';
            calculateMantencion('desc-clp');
        });
    }

    // 4. Saldo a Financiar (si el usuario quiere editarlo directamente)
    const saldoUfInput = document.getElementById('saldo-financiar-uf');
    if (saldoUfInput) {
        saldoUfInput.addEventListener('input', () => {
            mantencionState.saldoUF = parseFloat(saldoUfInput.value) || 0;
            mantencionState.saldoCLP = Math.round(mantencionState.saldoUF * currentUFValue);
            const saldoClpInput = document.getElementById('saldo-financiar-clp');
            if (saldoClpInput) saldoClpInput.value = mantencionState.saldoCLP > 0 ? formatCurrency(mantencionState.saldoCLP) : '';
            renderCuotas();
        });
    }

    const saldoClpInput = document.getElementById('saldo-financiar-clp');
    if (saldoClpInput) {
        saldoClpInput.addEventListener('input', (e) => {
            const parsed = parseCLP(e.target.value);
            e.target.value = parsed > 0 ? formatCurrency(parsed) : '';
            mantencionState.saldoCLP = parsed;
            mantencionState.saldoUF = currentUFValue > 0 ? parsed / currentUFValue : 0;
            if (saldoUfInput) saldoUfInput.value = mantencionState.saldoUF > 0 ? mantencionState.saldoUF.toFixed(2) : '';
            renderCuotas();
        });
    }

    // 5. Selector de Cuotas
    const cuotasSelect = document.getElementById('cuotas-select');
    if (cuotasSelect) {
        cuotasSelect.addEventListener('change', () => {
            renderCuotas();
        });
    }

    // 6. Selector de Producto para Navegación
    const productSelector = document.getElementById('product-type');
    if (productSelector) {
        productSelector.addEventListener('change', () => {
            const productPageMap = {
                'sepultacion': 'index.html',
                'sepultura-auco': 'sepultura-auco.html',
                'sepultura-auco-uf': 'sepultura-auco.html',
                'sepultura-auco-pesos': 'sepultura-auco.html',
                'jardin-auco': 'jardin-auco.html',
                'jardin-auco-uf': 'jardin-auco.html',
                'jardin-auco-pesos': 'jardin-auco.html',
                'fuente-auco': 'fuente-auco.html',
                'fuente-auco-uf': 'fuente-auco.html',
                'fuente-auco-pesos': 'fuente-auco.html',
                'cremacion': 'cremacion.html',
                'aumento-capacidad': 'aumento-capacidad.html',
                'mantencion': 'mantencion.html',
                'servicios-funerarios': 'servicios-funerarios.html'
            };
            window.location.href = productPageMap[productSelector.value] || 'mantencion.html';
        });
    }

    // 7. UF Hoy
    const ufInput = document.getElementById('uf-value-input');
    if (ufInput) {
        ufInput.addEventListener('input', () => {
            const val = parseFloat(ufInput.value);
            if (!isNaN(val) && val > 0) {
                currentUFValue = val;
                calculateMantencion('uf-change');
            }
        });
    }

    // Cargar UF inicial desde la API
    fetchUFValue().then(() => {
        calculateMantencion('init');
    }).catch(() => {
        calculateMantencion('init');
    });
});
