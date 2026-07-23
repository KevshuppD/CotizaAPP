// js/products/mantencion.js - Lógica Financiera de Mantención

function calculateMantencion(triggeredBy = '') {
    const valorPlanUfInput = document.getElementById('valor-plan-uf');
    const descPercentInput = document.getElementById('descuento-porcentaje');
    if (!valorPlanUfInput) return;

    const valorPlan = parseFloat(valorPlanUfInput.value) || 0;
    const descuentoPorcentaje = parseFloat(descPercentInput ? descPercentInput.value : '0') || 0;
    const descuento = valorPlan * (descuentoPorcentaje / 100);
    const totalConIVA = valorPlan - descuento;
    const pie = valorPlan * 0.10;
    const ivaPie = pie * 0.19;
    const pieTotal = pie + ivaPie;
    const saldo = totalConIVA - pie;

    const resumenEl = document.getElementById('mantencion-resumen');
    if (resumenEl) {
        resumenEl.innerHTML = `
            <div style="font-size:12px; line-height:1.6; color:#333;">
                <div><strong>Valor Plan + IVA:</strong> ${valorPlan.toFixed(2).replace('.', ',')} UF (${formatCurrency(Math.round(valorPlan * currentUFValue))})</div>
                <div><strong>Descuento (${descuentoPorcentaje.toFixed(0)}%):</strong> ${descuento.toFixed(2).replace('.', ',')} UF (${formatCurrency(Math.round(descuento * currentUFValue))})</div>
                <div><strong>Total + IVA:</strong> ${totalConIVA.toFixed(2).replace('.', ',')} UF (${formatCurrency(Math.round(totalConIVA * currentUFValue))})</div>
                <div><strong>Pie (10%):</strong> ${pie.toFixed(2).replace('.', ',')} UF (${formatCurrency(Math.round(pie * currentUFValue))})</div>
                <div><strong>IVA Pie (19%):</strong> ${ivaPie.toFixed(2).replace('.', ',')} UF (${formatCurrency(Math.round(ivaPie * currentUFValue))})</div>
                <div><strong>Pie Total a pagar:</strong> ${pieTotal.toFixed(2).replace('.', ',')} UF (${formatCurrency(Math.round(pieTotal * currentUFValue))})</div>
                <div><strong>Saldo a financiar:</strong> ${saldo.toFixed(2).replace('.', ',')} UF (${formatCurrency(Math.round(saldo * currentUFValue))})</div>
            </div>
        `;
    }

    const plazos = [24, 36, 48];
    let tablaCuotasHTML = '';
    
    plazos.forEach(plazo => {
        const cuotaBase = saldo / plazo;
        const ivaUF = cuotaBase * 0.19;
        const totalCuotaUF = cuotaBase + 0.02 + 0.02 + ivaUF;
        const totalCuotaCLP = Math.round(totalCuotaUF * currentUFValue);

        tablaCuotasHTML += `
            <tr>
                <td style="font-weight: bold;">${plazo} cuotas</td>
                <td>${cuotaBase.toFixed(4).replace('.', ',')}</td>
                <td>${(0.02).toFixed(4).replace('.', ',')}</td>
                <td>${(0.02).toFixed(4).replace('.', ',')}</td>
                <td>${ivaUF.toFixed(4).replace('.', ',')}</td>
                <td style="font-weight: bold;">${totalCuotaUF.toFixed(4).replace('.', ',')}</td>
                <td style="font-weight: bold; font-size: 15px; color: var(--primary-green);">${formatCurrency(totalCuotaCLP)}</td>
            </tr>
        `;
    });

    const cuotasBody = document.getElementById('mantencion-cuotas-body');
    if (cuotasBody) {
        cuotasBody.innerHTML = tablaCuotasHTML;
    }
}

// Inicialización de la página dedicada a Mantención
document.addEventListener('DOMContentLoaded', () => {
    initDOMElements();

    const today = new Date();
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        dateEl.textContent = today.toLocaleDateString('es-CL', { 
            day: '2-digit', month: '2-digit', year: 'numeric' 
        }).replace(/\//g, '-');
    }

    const valorPlanUfInput = document.getElementById('valor-plan-uf');
    if (valorPlanUfInput) {
        valorPlanUfInput.addEventListener('input', () => calculateMantencion('plan-uf'));
    }

    const descPercentInput = document.getElementById('descuento-porcentaje');
    if (descPercentInput) {
        descPercentInput.addEventListener('input', () => calculateMantencion('discount-percent'));
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
            window.location.href = productPageMap[productSelector.value] || 'mantencion.html';
        });
    }

    // Event listeners de inputs
    const ufInput = document.getElementById('uf-value-input');
    if (ufInput) {
        ufInput.addEventListener('input', () => {
            const val = parseFloat(ufInput.value);
            if (!isNaN(val) && val > 0) {
                currentUFValue = val;
                calculateMantencion('uf-manual');
            }
        });
    }

    fetchUFValue().then(() => {
        calculateMantencion('init');
    }).catch(() => {
        calculateMantencion('init');
    });
});
