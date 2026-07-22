// js/products/sepultura-liberador.js - Lógica Financiera de Sepultura con Beneficios (Liberador)

function calculateSepulturaLiberador() {
    if (elements.valorNiUf && elements.valorNiUf.value.trim() === '') {
        elements.valorNiUf.value = '46.41';
    }
    const valorRealUF = parseFloat(elements.valorNiUf ? elements.valorNiUf.value : '') || 0;
    const tipoDesc = elements.tipoDescuentoMain ? elements.tipoDescuentoMain.value : 'percent';
    const rawDesc = elements.porcentajeDescuentoMain ? (parseFloat(elements.porcentajeDescuentoMain.value) || 0) : 0;
    
    let porcentajeDescuento = 0;
    if (valorRealUF > 0) {
        if (tipoDesc === 'percent') {
            porcentajeDescuento = Math.max(0, Math.min(100, rawDesc)) / 100;
        } else if (tipoDesc === 'uf') {
            porcentajeDescuento = rawDesc / valorRealUF;
        } else if (tipoDesc === 'clp') {
            porcentajeDescuento = (rawDesc / currentUFValue) / valorRealUF;
        }
    }

    const percentagePieValue = elements.piePercent ? (parseFloat(elements.piePercent.value) || 0) : 0;
    const porcentajePie = percentagePieValue / 100;

    const valorRealCLP = valorRealUF * currentUFValue;
    const descuentoUF = valorRealUF * porcentajeDescuento;
    const descuentoCLP = descuentoUF * currentUFValue;
    const precioVentaUF = valorRealUF - descuentoUF;
    const precioVentaCLP = precioVentaUF * currentUFValue;

    const pieCalculadoUF = valorRealUF * porcentajePie;
    const pieCLP = pieCalculadoUF * currentUFValue;
    const saldoFinanciarUF = precioVentaUF - pieCalculadoUF;
    const saldoFinanciarCLP = saldoFinanciarUF * currentUFValue;

    if (elements.labelValorNi) elements.labelValorNi.textContent = 'Valor Real';
    
    if (elements.labelDescuento) {
        let labelText = 'Descuento';
        if (tipoDesc === 'percent') labelText += ' (%)';
        else if (tipoDesc === 'uf') labelText += ' (UF)';
        else if (tipoDesc === 'clp') labelText += ' ($)';
        elements.labelDescuento.textContent = labelText;
    }

    if (elements.labelDescuentoOutput) {
        elements.labelDescuentoOutput.textContent = `${descuentoUF.toFixed(2)} UF (${formatCurrency(descuentoCLP)})`;
    }
    if (elements.labelValorAnt) elements.labelValorAnt.textContent = 'Precio Venta';
    if (elements.labelPie) elements.labelPie.innerHTML = `Pie (${percentagePieValue.toFixed(0)}%)`;
    
    if (elements.saldoFinanciarRow) elements.saldoFinanciarRow.style.display = 'table-row';
    if (elements.saldoFinanciarUf) elements.saldoFinanciarUf.textContent = `${saldoFinanciarUF.toFixed(2)} UF`;
    if (elements.saldoFinanciarClp) {
        elements.saldoFinanciarClp.textContent = formatCurrency(saldoFinanciarCLP);
    }

    if (elements.sepulturaLiberadorResumen) elements.sepulturaLiberadorResumen.innerHTML = '';

    const plazosYTasas = [
        { plazo: 12, tasa: 0 },
        { plazo: 24, tasa: 0 },
        { plazo: 36, tasa: 0 },
        { plazo: 48, tasa: 0 },
        { plazo: 60, tasa: 0.0197 },
        { plazo: 72, tasa: 0.01693 },
        { plazo: 84, tasa: 0.01495 },
        { plazo: 96, tasa: 0.01348 },
        { plazo: 108, tasa: 0.01235 }
    ];

    let tablaCuotasHTML = '';
    plazosYTasas.forEach(({ plazo, tasa }) => {
        let valorCuotaUF;
        if (plazo <= 48) {
            valorCuotaUF = saldoFinanciarUF / plazo;
        } else {
            valorCuotaUF = saldoFinanciarUF * tasa;
        }

        if (plazo === 108) {
            valorCuotaUF += 0.003;
        }

        const seguroUF = (saldoFinanciarUF > 0 && plazo > 0) ? (0.0016 * saldoFinanciarUF) : 0;
        const gastoAdminUF = 0.02;
        const totalCuotaUF = valorCuotaUF + seguroUF + gastoAdminUF;
        const totalCuotaCLP = totalCuotaUF * currentUFValue;

        tablaCuotasHTML += `
            <tr>
                <td>${plazo} cuotas</td>
                <td>${valorCuotaUF.toFixed(4)}</td>
                <td>${seguroUF.toFixed(4)}</td>
                <td>${gastoAdminUF.toFixed(4)}</td>
                <td>${totalCuotaUF.toFixed(4)}</td>
                <td>${formatCurrency(totalCuotaCLP)}</td>
            </tr>
        `;
    });

    if (elements.sepulturaLiberadorCuotasBody) {
        elements.sepulturaLiberadorCuotasBody.innerHTML = tablaCuotasHTML;
    }

    const rights = elements.rightsInput ? (parseInt(elements.rightsInput.value) || 1) : 1;
    if (typeof renderVisualGraphic === 'function') {
        renderVisualGraphic('sepultura-liberador', rights);
    }
}
