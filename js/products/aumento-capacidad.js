// js/products/aumento-capacidad.js - Lógica Financiera de Aumento de Capacidad

function calculateAumentoCapacidad(triggeredBy = '') {
    const parque = elements.parkSelector ? elements.parkSelector.value : 'EL PRADO';
    let parsedVal = parseInt(elements.rightsInput.value);
    const capacidad = isNaN(parsedVal) ? 1 : Math.max(1, Math.min(2, parsedVal));

    const valorRealBase = (parque === 'EL PRADO')
        ? (capacidad === 2 ? 100 : 80)
        : (capacidad === 2 ? 80 : 45);

    const descuento = (elements.porcentajeDescuentoMain && elements.porcentajeDescuentoMain.value)
        ? Math.max(0, Math.min(100, parseFloat(elements.porcentajeDescuentoMain.value) || 0))
        : 0;

    if (elements.valorNiUf) elements.valorNiUf.value = valorRealBase.toFixed(2);

    if (triggeredBy === 'ant-manual') {
        const antManual = parseFloat(elements.valorAntUf.value) || 0;
        if (valorRealBase > 0 && elements.porcentajeDescuentoMain) {
            const descCalc = Math.max(0, Math.min(100, ((valorRealBase - antManual) / valorRealBase) * 100));
            elements.porcentajeDescuentoMain.value = Math.round(descCalc).toString();
        }
    } else if (elements.valorAntUf) {
        const valorAnticipado = valorRealBase * (1 - (descuento / 100));
        elements.valorAntUf.value = valorAnticipado.toFixed(2);
    }

    // Actualizar desglose de descuento
    const descuentoUF = valorRealBase * (descuento / 100);
    const descuentoCLP = descuentoUF * currentUFValue;
    if (elements.labelDescuentoOutput) {
        elements.labelDescuentoOutput.textContent = `${descuentoUF.toFixed(2)} UF (${formatCurrency(descuentoCLP)})`;
    }
}
