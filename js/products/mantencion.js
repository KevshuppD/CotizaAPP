// js/products/mantencion.js - Lógica Financiera de Mantención

function calculateMantencion() {
    const valorPlan = parseFloat(elements.valorPlanUf.value) || 0;
    const descuentoPorcentaje = parseFloat(elements.descuentoPorcentaje.value) || 0;
    const descuento = valorPlan * (descuentoPorcentaje / 100);
    const totalConIVA = valorPlan - descuento;
    const pie = valorPlan * 0.10;
    const ivaPie = pie * 0.19;
    const pieTotal = pie + ivaPie;
    const saldo = totalConIVA - pie;

    if (elements.mantencionResumen) {
        elements.mantencionResumen.innerHTML = `
            <p><strong>Valor Plan + IVA:</strong> ${valorPlan.toFixed(2)} UF</p>
            <p><strong>Descuento (${descuentoPorcentaje.toFixed(0)}%):</strong> ${descuento.toFixed(2)} UF</p>
            <p><strong>Total + IVA:</strong> ${totalConIVA.toFixed(2)} UF</p>
            <p><strong>Pie (10%):</strong> ${pie.toFixed(2)} UF</p>
            <p><strong>IVA Pie:</strong> ${ivaPie.toFixed(2)} UF</p>
            <p><strong>Pie Total:</strong> ${pieTotal.toFixed(2)} UF</p>
            <p><strong>Saldo:</strong> ${saldo.toFixed(2)} UF</p>
        `;
    }

    const plazos = [24, 36, 48];
    let tablaCuotasHTML = '';
    plazos.forEach(plazo => {
        const cuotaBase = saldo / plazo;
        const ivaUF = cuotaBase * 0.19;
        const totalCuotaUF = cuotaBase + 0.02 + 0.02 + ivaUF;
        const totalCuotaCLP = totalCuotaUF * currentUFValue;

        tablaCuotasHTML += `
            <tr>
                <td>${plazo} cuotas</td>
                <td>${cuotaBase.toFixed(4)}</td>
                <td>${(0.02).toFixed(4)}</td>
                <td>${(0.02).toFixed(4)}</td>
                <td>${ivaUF.toFixed(4)}</td>
                <td>${totalCuotaUF.toFixed(4)}</td>
                <td>${formatCurrency(totalCuotaCLP)}</td>
            </tr>
        `;
    });

    if (elements.mantencionCuotasBody) {
        elements.mantencionCuotasBody.innerHTML = tablaCuotasHTML;
    }
}
