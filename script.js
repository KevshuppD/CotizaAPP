const elements = {
    date: document.getElementById('current-date'),
    ufDisplay: document.getElementById('uf-value-display'),
    productType: document.getElementById('product-type'),
    mainTitle: document.getElementById('main-title'),
    parkSelector: document.getElementById('parque-name'),
    parkLabel: document.getElementById('park-label'),
    parkStaticValue: document.getElementById('park-static-value'),
    parkDisplay: document.getElementById('park-name-display'),
    capacityUnit: document.getElementById('capacity-unit'),
    valorNiUf: document.getElementById('valor-ni-uf'),
    valorNiClp: document.getElementById('valor-ni-clp'),
    descuentoRowMain: document.getElementById('discount-row-main'),
    porcentajeDescuentoMain: document.getElementById('porcentaje-descuento-main'),
    valorAntUf: document.getElementById('valor-ant-uf'),
    valorAntClp: document.getElementById('valor-ant-clp'),
    pieUf: document.getElementById('pie-uf'),
    pieClp: document.getElementById('pie-clp'),
    piePercent: document.getElementById('pie-percent'),
    rightsInput: document.getElementById('cantidad-rights'),
    refUfInput: document.getElementById('ref-uf-input'),
    refClpDisplay: document.getElementById('ref-clp-display'),
    refValueContainer: document.getElementById('ref-value-container'),
    refLabel: document.getElementById('ref-label'),
    refUfDisplay: document.getElementById('ref-uf-display'),
    sepultacionGraphicContainer: document.getElementById('sepultacion-graphic-container'),
    serviceImageContainer: document.getElementById('service-image-container'),
    sepultacionFields: document.getElementById('sepultacion-fields'),
    aumentoCapacidadFields: document.getElementById('aumento-capacidad-fields'),
    mantencionFields: document.getElementById('mantencion-fields'),
    sepulturaLiberadorFields: document.getElementById('sepultura-liberador-fields'),
    sepultacionOutput: document.getElementById('sepultacion-output'),
    mantencionOutput: document.getElementById('mantencion-output'),
    sepulturaLiberadorOutput: document.getElementById('sepultura-liberador-output'),
    valorPlanUf: document.getElementById('valor-plan-uf'),
    descuentoPorcentaje: document.getElementById('descuento-porcentaje'),
    valorRealUf: document.getElementById('valor-real-uf'),
    porcentajeDescuentoSep: document.getElementById('porcentaje-descuento-sep'),
    tipoPie: document.getElementById('tipo-pie'),
    porcentajePieSep: document.getElementById('porcentaje-pie-sep'),
    pieValorUF: document.getElementById('pie-valor-uf'),
    pieValorCLP: document.getElementById('pie-valor-clp'),
    rightsInputLib: document.getElementById('cantidad-rights-lib'),
    parqueAumento: document.getElementById('parque-aumento'),
    capacidadAumento: document.getElementById('capacidad-aumento'),
    valorRealAumentoUf: document.getElementById('valor-real-aumento-uf'),
    valorRealAumentoClp: document.getElementById('valor-real-aumento-clp'),
    valorAntAumentoUf: document.getElementById('valor-ant-aumento-uf'),
    valorAntAumentoClp: document.getElementById('valor-ant-aumento-clp'),
    pieUfAumento: document.getElementById('pie-uf-aumento'),
    pieClpAumento: document.getElementById('pie-clp-aumento'),
    piePercentAumento: document.getElementById('pie-percent-aumento'),
    porcentajeDescuentoAumento: document.getElementById('porcentaje-descuento-aumento'),
    mantencionResumen: document.getElementById('mantencion-resumen'),
    mantencionCuotasBody: document.getElementById('mantencion-cuotas-body'),
    sepulturaLiberadorResumen: document.getElementById('sepultura-liberador-resumen'),
    sepulturaLiberadorCuotasBody: document.getElementById('sepultura-liberador-cuotas-body'),
    liberadorGraphicContainer: document.getElementById('liberador-graphic-container'),
    visualGraphic: document.getElementById('visual-graphic'),
    toggleGraphic: document.getElementById('toggle-graphic'),
    tipoDescuentoMain: document.getElementById('tipo-descuento-main'),
    labelValorNi: document.getElementById('label-valor-ni'),
    labelDescuento: document.getElementById('label-descuento'),
    labelDescuentoOutput: document.getElementById('label-descuento-output'),
    labelValorAnt: document.getElementById('label-valor-ant'),
    labelPie: document.getElementById('label-pie'),
    labelPiePercent: document.getElementById('label-pie-percent'),
    saldoFinanciarRow: document.getElementById('saldo-financiar-row'),
    saldoFinanciarUf: document.getElementById('saldo-financiar-uf'),
    saldoFinanciarClp: document.getElementById('saldo-financiar-clp'),
    factors: {
        36: document.getElementById('factor-36'),
        48: document.getElementById('factor-48')
    },
    cuotas: {
        12: document.getElementById('cuota-12'),
        24: document.getElementById('cuota-24'),
        36: document.getElementById('cuota-36'),
        48: document.getElementById('cuota-48')
    },
    adjustments: {
        12: document.getElementById('adj-12'),
        24: document.getElementById('adj-24'),
        36: document.getElementById('adj-36'),
        48: document.getElementById('adj-48')
    },
    mainCuotasTable: document.getElementById('main-cuotas-table')
};

let currentUFValue = 40013.88; // Default value

async function fetchUF() {
    try {
        const response = await fetch("https://findic.cl/api/", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "GET"
        });
        const data = await response.json();
        if (data && data.uf && data.uf.valor) {
            // some APIs return as "40.013,88" (string) or 40013.88 (number)
            // findic usually returns number, but we sanitize
            const val = typeof data.uf.valor === 'string' 
                ? parseFloat(data.uf.valor.replace('.', '').replace(',', '.')) 
                : data.uf.valor;
            
            currentUFValue = val;
            elements.ufDisplay.textContent = '$ ' + currentUFValue.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            updateCalculations();
        }
    } catch (error) {
        console.error('Error fetching UF from findic:', error);
        // Fallback to mindicador if findic fails
        try {
            const res = await fetch('https://mindicador.cl/api/uf');
            const d = await res.json();
            if (d && d.serie && d.serie[0]) {
                currentUFValue = d.serie[0].valor;
                elements.ufDisplay.textContent = '$ ' + currentUFValue.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                updateCalculations();
            }
        } catch (e) {
            elements.ufDisplay.textContent = '$ ' + currentUFValue.toLocaleString('de-DE');
            updateCalculations();
        }
    }
}

function formatCurrency(value) {
    return '$ ' + Math.round(value).toLocaleString('de-DE');
}

function formatUF(value) {
    return value.toLocaleString('de-DE', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).replace('.', ',');
}

function setProductVisibility(type) {
    const isSepultacionFamily = type === 'sepultacion' || type === 'cremacion';
    const isLiberador = type === 'sepultura-liberador';
    const isMantencion = type === 'mantencion';
    const isAumento = type === 'aumento-capacidad';

    // Ajustar límites de capacidad según el producto
    if (isAumento) {
        elements.rightsInput.max = 2;
        if (parseInt(elements.rightsInput.value) > 2) {
            elements.rightsInput.value = 2;
        }
    } else if (isLiberador) {
        elements.rightsInput.max = 4;
        if (parseInt(elements.rightsInput.value) > 4) {
            elements.rightsInput.value = 4;
        }
    } else if (type === 'cremacion') {
        elements.rightsInput.max = 4;
        if (parseInt(elements.rightsInput.value) > 4) {
            elements.rightsInput.value = 4;
        }
    } else {
        elements.rightsInput.max = 10; // Valor original para sepultación
    }

    // Aumento usa el mismo layout base que cremación para mantener diseño y cuotas
    elements.sepultacionFields.style.display = (isSepultacionFamily || isAumento || isLiberador) ? 'block' : 'none';
    elements.mantencionFields.style.display = isMantencion ? 'block' : 'none';
    elements.sepulturaLiberadorFields.style.display = 'none';
    elements.aumentoCapacidadFields.style.display = 'none';

    // Asegurar que el contenedor del gráfico sea visible para Aumento y Liberador
    if (elements.liberadorGraphicContainer) {
        if (isAumento || isLiberador) {
            elements.liberadorGraphicContainer.style.setProperty('display', 'block', 'important');
        } else {
            elements.liberadorGraphicContainer.style.display = 'none';
        }
    }

    elements.descuentoRowMain.style.display = (isAumento || isLiberador) ? '' : 'none';

    elements.sepultacionOutput.style.display = (isSepultacionFamily || isAumento || isLiberador) ? 'block' : 'none';
    elements.mantencionOutput.style.display = isMantencion ? 'block' : 'none';
    elements.sepulturaLiberadorOutput.style.display = isLiberador ? 'block' : 'none';
    
    // Reset labels and visibility for other products
    if (!isLiberador) {
        if (elements.labelValorNi) elements.labelValorNi.textContent = 'Valor uso inmediato(IVA Inclu)';
        if (elements.labelValorAnt) elements.labelValorAnt.textContent = 'Valor anticipado(IVA Incluido)';
        if (elements.labelPie) elements.labelPie.innerHTML = 'Pie mínimo';
        if (elements.saldoFinanciarRow) elements.saldoFinanciarRow.style.display = 'none';
        if (elements.labelDescuentoOutput) elements.labelDescuentoOutput.innerHTML = '&nbsp;';
    }

    if (elements.mainCuotasTable) {
        elements.mainCuotasTable.style.display = isLiberador ? 'none' : '';
    }

    // Toggle global visual column visibility to reclaim space
    const visualCol = document.querySelector('.visual-col');
    if (visualCol) {
        visualCol.style.display = (isLiberador || isMantencion || isAumento || type === 'sepultacion') ? 'none' : 'flex';
    }

    if (isMantencion) {
        elements.parkSelector.disabled = true;
        elements.parkSelector.style.display = 'none';
        elements.parkStaticValue.style.display = 'inline';
        elements.parkStaticValue.textContent = 'Nuestros Parques';
        elements.parkLabel.textContent = 'Nuestros Parques';
        elements.parkDisplay.textContent = 'NUESTROS PARQUES';
        elements.capacityUnit.textContent = 'derechos';
        elements.mainTitle.textContent = 'Mantención';
        elements.serviceImageContainer.style.display = 'none';
        
        elements.refValueContainer.style.display = 'none';
    } else if (isSepultacionFamily || isAumento || isLiberador) {
        elements.parkSelector.disabled = false;
        elements.parkSelector.style.display = '';
        elements.parkStaticValue.style.display = 'none';
        elements.parkLabel.textContent = 'Parque';
        elements.parkDisplay.textContent = 'PARQUE ' + elements.parkSelector.value;
        elements.capacityUnit.textContent = (type === 'cremacion') ? 'Anforas' : (isAumento ? 'capacidades' : 'derechos');
        elements.mainTitle.textContent = (type === 'cremacion')
            ? 'Cremación Anticipada'
            : (isAumento ? 'Aumento de Capacidad' : (isLiberador ? 'Sepultación Parques' : 'Cotización Derecho de Sepultación Anticipada'));
        elements.refValueContainer.style.display = type === 'sepultacion' ? 'block' : 'none';
        elements.serviceImageContainer.style.display = type === 'cremacion' ? 'block' : 'none';
        elements.refLabel.textContent = 'Valor referencia por 1 derecho';
    }
}

function calculateMantencion() {
    const valorPlan = parseFloat(elements.valorPlanUf.value) || 0;
    const descuentoPorcentaje = parseFloat(elements.descuentoPorcentaje.value) || 0;
    const descuento = valorPlan * (descuentoPorcentaje / 100);
    const totalConIVA = valorPlan - descuento;
    const pie = valorPlan * 0.10;
    const ivaPie = pie * 0.19;
    const pieTotal = pie + ivaPie;
    const saldo = totalConIVA - pie;

    elements.mantencionResumen.innerHTML = `
        <p><strong>Valor Plan + IVA:</strong> ${valorPlan.toFixed(2)} UF</p>
        <p><strong>Descuento (${descuentoPorcentaje.toFixed(0)}%):</strong> ${descuento.toFixed(2)} UF</p>
        <p><strong>Total + IVA:</strong> ${totalConIVA.toFixed(2)} UF</p>
        <p><strong>Pie (10%):</strong> ${pie.toFixed(2)} UF</p>
        <p><strong>IVA Pie:</strong> ${ivaPie.toFixed(2)} UF</p>
        <p><strong>Pie Total:</strong> ${pieTotal.toFixed(2)} UF</p>
        <p><strong>Saldo:</strong> ${saldo.toFixed(2)} UF</p>
    `;

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
                <td>${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalCuotaCLP)}</td>
            </tr>
        `;
    });

    elements.mantencionCuotasBody.innerHTML = tablaCuotasHTML;
}

function calculateAumentoCapacidad(triggeredBy = '') {
    const parque = elements.parkSelector.value;
    const capacidad = Math.max(1, Math.min(2, parseInt(elements.rightsInput.value) || 1));
    if (String(capacidad) !== elements.rightsInput.value) {
        elements.rightsInput.value = String(capacidad);
    }

    const valorRealBase = (parque === 'EL PRADO')
        ? (capacidad === 2 ? 100 : 80)
        : (capacidad === 2 ? 80 : 45);

    const descuento = Math.max(0, Math.min(100, parseFloat(elements.porcentajeDescuentoMain.value) || 0));

    elements.valorNiUf.value = valorRealBase.toFixed(2);

    if (triggeredBy === 'ant-manual') {
        const antManual = parseFloat(elements.valorAntUf.value) || 0;
        if (valorRealBase > 0) {
            const descCalc = Math.max(0, Math.min(100, ((valorRealBase - antManual) / valorRealBase) * 100));
            elements.porcentajeDescuentoMain.value = Math.round(descCalc).toString();
        }
    } else {
        const valorAnticipado = valorRealBase * (1 - (descuento / 100));
        elements.valorAntUf.value = valorAnticipado.toFixed(2);
    }
}

function calculateSepulturaLiberador() {
    // Usa los valores del layout principal para mantener diseño unificado
    const valorRealUF = parseFloat(elements.valorNiUf.value) || 0;
    const tipoDesc = elements.tipoDescuentoMain ? elements.tipoDescuentoMain.value : 'percent';
    const rawDesc = parseFloat(elements.porcentajeDescuentoMain.value) || 0;
    
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

    const percentagePieValue = (parseFloat(elements.piePercent.value) || 0);
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

    // Actualizar etiquetas y valores en la tabla unificada
    if (elements.labelValorNi) elements.labelValorNi.textContent = 'Valor Real';
    
    // Ajustar etiqueta de descuento según el tipo
    if (elements.labelDescuento) {
        let labelText = 'Descuento';
        if (tipoDesc === 'percent') labelText += ' (%)';
        else if (tipoDesc === 'uf') labelText += ' (UF)';
        else if (tipoDesc === 'clp') labelText += ' ($)';
        elements.labelDescuento.textContent = labelText;
    }

    if (elements.labelDescuentoOutput) {
        if (tipoDesc === 'clp') {
             // Si el descuento es en CLP, mostramos el valor en UF calculado
             elements.labelDescuentoOutput.textContent = `${descuentoUF.toFixed(2)} UF (${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(descuentoCLP)})`;
        } else {
             elements.labelDescuentoOutput.textContent = `${descuentoUF.toFixed(2)} UF (${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(descuentoCLP)})`;
        }
    }
    if (elements.labelValorAnt) elements.labelValorAnt.textContent = 'Precio Venta';
    if (elements.labelPie) elements.labelPie.innerHTML = `Pie (${percentagePieValue.toFixed(0)}%)`;
    
    // Mostrar Saldo a Financiar
    if (elements.saldoFinanciarRow) elements.saldoFinanciarRow.style.display = 'table-row';
    if (elements.saldoFinanciarUf) elements.saldoFinanciarUf.textContent = `${saldoFinanciarUF.toFixed(2)} UF`;
    if (elements.saldoFinanciarClp) {
        elements.saldoFinanciarClp.textContent = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(saldoFinanciarCLP);
    }

    elements.sepulturaLiberadorResumen.innerHTML = ''; // Limpiar resumen antiguo unificado

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

        // Para el plazo de 108 meses, sumar 0.003 UF adicionales al valor de la cuota
        if (plazo === 108) {
            valorCuotaUF += 0.003;
        }

        const valorCuotaCLP = valorCuotaUF * currentUFValue;

        if (plazo <= 24) {
            const seguroCLP = 1750;
            const gastoCLP = 3500;
            const totalCuotaCLP = valorCuotaCLP + seguroCLP + gastoCLP;

            tablaCuotasHTML += `
                <tr>
                    <td>${plazo}</td>
                    <td>${valorCuotaUF.toFixed(2)} UF</td>
                    <td>${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valorCuotaCLP)}</td>
                    <td>${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(seguroCLP)} (${(seguroCLP / currentUFValue).toFixed(3)} UF)</td>
                    <td>${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(gastoCLP)} (${(gastoCLP / currentUFValue).toFixed(3)} UF)</td>
                    <td>${(totalCuotaCLP / currentUFValue).toFixed(3)} UF</td>
                    <td>${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalCuotaCLP)}</td>
                </tr>
            `;
        } else {
            const seguroUF = 0.05;
            const gastoUF = 0.1;
            const totalCuotaUF = valorCuotaUF + seguroUF + gastoUF;
            const totalCuotaCLP = totalCuotaUF * currentUFValue;

            tablaCuotasHTML += `
                <tr>
                    <td>${plazo}</td>
                    <td>${valorCuotaUF.toFixed(2)} UF</td>
                    <td>${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valorCuotaCLP)}</td>
                    <td>${seguroUF.toFixed(3)} UF</td>
                    <td>${gastoUF.toFixed(3)} UF</td>
                    <td>${totalCuotaUF.toFixed(3)} UF</td>
                    <td>${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalCuotaCLP)}</td>
                </tr>
            `;
        }
    });

    elements.sepulturaLiberadorCuotasBody.innerHTML = tablaCuotasHTML;
}

function cambiarTipoPie() {
    const tipoPie = elements.tipoPie.value;
    document.getElementById('pie-porcentaje-lib').style.display = tipoPie === 'porcentaje' ? 'block' : 'none';
    document.getElementById('pie-uf-lib').style.display = tipoPie === 'uf' ? 'block' : 'none';
    document.getElementById('pie-clp-lib').style.display = tipoPie === 'clp' ? 'block' : 'none';
}

function updateVisualGraphic(count, type) {
    if (!elements.toggleGraphic.checked) {
        if (elements.visualGraphic) {
            elements.visualGraphic.style.display = 'none';
            elements.visualGraphic.classList.remove('active');
        }
        if (elements.sepultacionGraphicContainer) {
            elements.sepultacionGraphicContainer.innerHTML = '';
            elements.sepultacionGraphicContainer.style.display = 'none';
        }
        if (elements.liberadorGraphicContainer) elements.liberadorGraphicContainer.innerHTML = '';
        return;
    }
    
    const targetGraphic = (type === 'sepultacion' && elements.sepultacionGraphicContainer)
        ? elements.sepultacionGraphicContainer
        : elements.visualGraphic;

    if (!targetGraphic) return;

    if (type === 'sepultacion' && elements.visualGraphic) {
        elements.visualGraphic.style.display = 'none';
        elements.visualGraphic.classList.remove('active');
    }
    if (type !== 'sepultacion' && elements.sepultacionGraphicContainer) {
        elements.sepultacionGraphicContainer.style.display = 'none';
        elements.sepultacionGraphicContainer.innerHTML = '';
    }

    targetGraphic.innerHTML = '';
    if (elements.liberadorGraphicContainer) {
        elements.liberadorGraphicContainer.innerHTML = '';
        elements.liberadorGraphicContainer.style.display = 'none';
    }

    if (type === 'sepultacion') {
        targetGraphic.style.display = 'block'; // Change to block to allow vertical stack
        targetGraphic.style.width = '100%';
        targetGraphic.style.maxWidth = '250px';
        targetGraphic.style.margin = '0 auto';
        targetGraphic.classList.add('active');
        
        const top = document.createElement('div');
        top.className = 'sepultura-header';
        targetGraphic.appendChild(top);

        for (let i = count - 1; i >= 0; i--) {
            const level = document.createElement('div');
            level.className = 'sepultura-level';
            level.textContent = 'ESPACIO ' + (i + 1);
            targetGraphic.appendChild(level);
        }

        const base = document.createElement('div');
        base.className = 'sepultura-base';
        targetGraphic.appendChild(base);
    } else if (type === 'cremacion') {
        elements.visualGraphic.style.display = 'flex';
        elements.visualGraphic.classList.add('active');
        
        // Cremation / Anforas layout
        const container = document.createElement('div');
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(2, minmax(140px, 1fr))';
        container.style.gap = '16px';
        container.style.padding = '10px';
        
        for (let i = 0; i < count; i++) {
            const anforaWrapper = document.createElement('div');
            anforaWrapper.className = 'anfora-wrapper';
            const anforaImg = document.createElement('img');
            anforaImg.src = 'anfora.png';
            anforaImg.alt = 'Ánfora';
            anforaImg.className = 'anfora-img';
            anforaImg.style.width = '150px';
            anforaImg.style.maxWidth = '150px';
            anforaImg.style.height = 'auto';
            anforaImg.onerror = function() { anforaWrapper.style.display = 'none'; };
            anforaWrapper.appendChild(anforaImg);
            container.appendChild(anforaWrapper);
        }
        elements.visualGraphic.appendChild(container);
    } else if (type === 'sepultura-liberador') {
        // Draw in the specific container below fields
        const container = elements.liberadorGraphicContainer;
        if (!container) return;
        
        container.style.display = 'block';
        container.style.width = '240px'; 
        container.style.margin = '30px auto 0 auto'; 
        container.style.transform = 'scale(1.2)'; 
        container.style.transformOrigin = 'top center'; 
        
        const base = document.createElement('div');
        base.className = 'sepultura-base';
        container.appendChild(base);

        const levels = Math.max(1, Math.min(4, parseInt(elements.rightsInput.value) || 1));

        // Add the "+1" Sepultación representation FIRST
        const sepultacionPlus = document.createElement('div');
        sepultacionPlus.className = 'sepultura-level';
        sepultacionPlus.style.backgroundColor = '#4caf50';
        sepultacionPlus.style.color = 'white';
        sepultacionPlus.style.fontWeight = 'bold';
        sepultacionPlus.textContent = '+1 SEPULTACIÓN';
        container.appendChild(sepultacionPlus);

        for (let i = levels - 1; i >= 0; i--) {
            const level = document.createElement('div');
            level.className = 'sepultura-level';
            level.textContent = 'ESPACIO ' + (i + 1);
            container.appendChild(level);
        }

        const top = document.createElement('div');
        top.className = 'sepultura-header';
        container.appendChild(top);
    } else if (type === 'aumento-capacidad') {
        const container = elements.liberadorGraphicContainer;
        if (!container) return;
        
        container.style.display = 'block';
        container.style.width = '240px'; 
        container.style.margin = '30px auto 0 auto'; 
        container.style.transform = 'scale(1.2)'; 
        container.style.transformOrigin = 'top center'; 
        
        const base = document.createElement('div');
        base.className = 'sepultura-base';
        container.appendChild(base);

        const levels = Math.max(1, Math.min(2, parseInt(elements.rightsInput.value) || 1));
        
        for (let i = 0; i < levels; i++) {
            const level = document.createElement('div');
            level.className = 'sepultura-level';
            level.style.backgroundColor = '#2196F3'; // Blue for added capacity
            level.style.color = 'white';
            level.textContent = 'AUMENTO ' + (i + 1);
            container.appendChild(level);
        }

        const top = document.createElement('div');
        top.className = 'sepultura-header';
        container.appendChild(top);
    } else {
        elements.visualGraphic.style.display = 'none';
        elements.visualGraphic.classList.remove('active');
    }
}

// Logic for Pie calculation
let isManualPie = false;

function updateCalculations(triggeredBy = '') {
    const uf = currentUFValue;
    const type = elements.productType.value;
    const piePercentRow = document.getElementById('pie-percent-row');
    const isSepultacionFamily = type === 'sepultacion' || type === 'cremacion';

    if (type === 'aumento-capacidad') {
        calculateAumentoCapacidad(triggeredBy);
    } else if (type === 'sepultura-liberador') {
        // Mantener fórmulas de Sepultación Parques sobre el layout principal
        const valorRealUF = parseFloat(elements.valorNiUf.value) || 0;
        const tipoDesc = elements.tipoDescuentoMain ? elements.tipoDescuentoMain.value : 'percent';
        const rawDesc = parseFloat(elements.porcentajeDescuentoMain.value) || 0;
        
        if (triggeredBy === 'ant-manual') {
            const antManual = parseFloat(elements.valorAntUf.value) || 0;
            if (valorRealUF > 0) {
                const descCalcRatio = Math.max(0, Math.min(1, (valorRealUF - antManual) / valorRealUF));
                if (tipoDesc === 'percent') {
                   elements.porcentajeDescuentoMain.value = (descCalcRatio * 100).toFixed(0);
                } else if (tipoDesc === 'uf') {
                   elements.porcentajeDescuentoMain.value = (valorRealUF - antManual).toFixed(2);
                } else if (tipoDesc === 'clp') {
                   elements.porcentajeDescuentoMain.value = Math.round((valorRealUF - antManual) * currentUFValue);
                }
            }
        } else {
            let valorAnticipado = valorRealUF;
            if (tipoDesc === 'percent') {
                valorAnticipado = valorRealUF * (1 - (Math.max(0, Math.min(100, rawDesc)) / 100));
            } else if (tipoDesc === 'uf') {
                valorAnticipado = Math.max(0, valorRealUF - rawDesc);
            } else if (tipoDesc === 'clp') {
                valorAnticipado = Math.max(0, valorRealUF - (rawDesc / currentUFValue));
            }
            elements.valorAntUf.value = valorAnticipado.toFixed(2);
        }
    }

    setProductVisibility(type);
    piePercentRow.style.display = (type === 'sepultacion' || type === 'cremacion' || type === 'aumento-capacidad' || type === 'sepultura-liberador') ? '' : 'none';

    // Update graphics logic: hide for maintenance
    if (type === 'mantencion' || !elements.toggleGraphic.checked) {
        elements.visualGraphic.style.display = 'none';
        elements.visualGraphic.classList.remove('active');
    } else {
        const rights = parseInt(elements.rightsInput.value) || 1;
        updateVisualGraphic(rights, type);
    }

    if (type === 'mantencion') {
        if (elements.liberadorGraphicContainer) {
            elements.liberadorGraphicContainer.innerHTML = '';
            elements.liberadorGraphicContainer.style.display = 'none';
        }
        calculateMantencion();
        return;
    }

    if (type === 'sepultura-liberador') {
        calculateSepulturaLiberador();
    }

    if (type === 'aumento-capacidad' && elements.liberadorGraphicContainer) {
        // Aumento usa el contenedor gráfico lateral en este layout
        elements.liberadorGraphicContainer.style.display = 'block';
    }

    // Clean up custom graphic only when not in modes that use it
    if (elements.liberadorGraphicContainer && type !== 'sepultura-liberador' && type !== 'aumento-capacidad') {
        elements.liberadorGraphicContainer.innerHTML = '';
        elements.liberadorGraphicContainer.style.display = 'none';
    }

    const rights = parseInt(elements.rightsInput.value) || 1;

    // Lógica de valores automáticos para Cremación
    if (type === 'cremacion' && triggeredBy !== 'ant-manual') {
        const valoresCremacion = {
            1: 27,
            2: 41.59,
            3: 55.98,
            4: 65.59
        };
        if (valoresCremacion[rights]) {
            elements.valorAntUf.value = valoresCremacion[rights];
        }
    }

    const niUf = parseFloat(elements.valorNiUf.value) || 0;
    const antUf = parseFloat(elements.valorAntUf.value) || 0;
    const refUf = parseFloat(elements.refUfInput.value) || 0;

    // Handle Pie logic
    const pieBaseUf = type === 'sepultura-liberador' ? niUf : antUf;
    if (triggeredBy === 'percent' || (triggeredBy !== 'pie' && !isManualPie)) {
        const percent = parseFloat(elements.piePercent.value) || 0;
        const newPieUf = (pieBaseUf * percent) / 100;
        elements.pieUf.value = newPieUf.toFixed(2);
        isManualPie = false;
        // Update pie label in UI for Liberador/Parques
        if (type === 'sepultura-liberador' && elements.labelPie) {
            elements.labelPie.innerHTML = `Pie (${percent.toFixed(0)}%)`;
        }
    } else if (triggeredBy === 'pie') {
        isManualPie = true;
        const pieUfVal = parseFloat(elements.pieUf.value) || 0;
        if (pieBaseUf > 0) {
            elements.piePercent.value = ((pieUfVal / pieBaseUf) * 100).toFixed(0);
        }
    }

    const pieUfVal = parseFloat(elements.pieUf.value) || 0;
    const balanceUf = antUf - pieUfVal;
    const balanceClp = (antUf * uf) - (pieUfVal * uf);

    elements.refClpDisplay.textContent = formatCurrency(refUf * uf);
    if (elements.refUfDisplay) {
        elements.refUfDisplay.textContent = refUf.toFixed(2).replace('.', ',') + ' UF (IVA INCLUIDO)';
    }

    // Basic CLP conversions
    elements.valorNiClp.textContent = formatCurrency(niUf * uf);
    elements.valorAntClp.textContent = formatCurrency(antUf * uf);
    elements.pieClp.textContent = formatCurrency(pieUfVal * uf);

    // Product specific factors
    let adminFee = 1400; // default for sepultacion
    let factor36_extra = 0.04;
    let factor48_extra = 0.04;

    if (type === 'cremacion' || type === 'aumento-capacidad') {
        adminFee = 5250;
        factor36_extra = 0.15;
        factor48_extra = 0.15;
    }

    const cuota12 = (balanceClp / 12) + adminFee;
    const cuota24 = (balanceClp / 24) + adminFee;

    elements.cuotas[12].textContent = formatCurrency(cuota12);
    elements.cuotas[24].textContent = formatCurrency(cuota24);
    elements.adjustments[12].textContent = `Incluye + $ ${adminFee.toLocaleString('de-DE')}`;
    elements.adjustments[24].textContent = `Incluye + $ ${adminFee.toLocaleString('de-DE')}`;

    const factor36 = (balanceUf / 36) + factor36_extra;
    const factor48 = (balanceUf / 48) + factor48_extra;

    elements.factors[36].textContent = formatUF(factor36);
    elements.factors[48].textContent = formatUF(factor48);
    elements.cuotas[36].textContent = formatCurrency(factor36 * uf);
    elements.cuotas[48].textContent = formatCurrency(factor48 * uf);
    elements.adjustments[36].textContent = `Incluye + ${factor36_extra.toFixed(2).replace('.', ',')} UF`;
    elements.adjustments[48].textContent = `Incluye + ${factor48_extra.toFixed(2).replace('.', ',')} UF`;
}

function toggleGraphic() {
    updateCalculations();
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    elements.date.textContent = today.toLocaleDateString('es-CL', { 
        day: '2-digit', month: '2-digit', year: 'numeric' 
    }).replace(/\//g, '-');

    // Event listeners
    elements.valorNiUf.addEventListener('input', () => updateCalculations('ni'));
    elements.valorAntUf.addEventListener('input', () => updateCalculations('ant-manual'));
    elements.pieUf.addEventListener('input', () => updateCalculations('pie'));
    elements.piePercent.addEventListener('input', () => updateCalculations('percent'));
    elements.rightsInput.addEventListener('input', () => updateCalculations('rights'));
    elements.refUfInput.addEventListener('input', () => updateCalculations('ref'));
    
    // Parque Liberador specific listeners
    elements.valorPlanUf.addEventListener('input', () => updateCalculations('mantencion'));
    elements.descuentoPorcentaje.addEventListener('input', () => updateCalculations('mantencion'));
    elements.valorRealUf.addEventListener('input', () => updateCalculations('sepultura-liberador'));
    elements.rightsInputLib.addEventListener('input', () => updateCalculations('sepultura-liberador'));
    elements.porcentajeDescuentoSep.addEventListener('input', () => updateCalculations('sepultura-liberador'));
    elements.tipoPie.addEventListener('change', () => { cambiarTipoPie(); updateCalculations('sepultura-liberador'); });
    elements.porcentajePieSep.addEventListener('input', () => updateCalculations('sepultura-liberador'));
    elements.pieValorUF.addEventListener('input', () => updateCalculations('sepultura-liberador'));
    elements.pieValorCLP.addEventListener('input', () => updateCalculations('sepultura-liberador'));
    
    // Descuento listeners
    if (elements.tipoDescuentoMain) {
        elements.tipoDescuentoMain.addEventListener('change', () => updateCalculations('discount-manual'));
    }
    elements.porcentajeDescuentoMain.addEventListener('input', () => updateCalculations('discount-manual'));
    
    elements.parkSelector.addEventListener('change', () => updateCalculations('park'));
    elements.productType.addEventListener('change', () => { cambiarTipoPie(); updateCalculations('product'); });
    elements.toggleGraphic.addEventListener('change', toggleGraphic);

    fetchUF();
});

async function captureWithoutPiePercent() {
    const captureArea = document.getElementById('capture-area');
    const piePercentRow = document.getElementById('pie-percent-row');
    const type = elements.productType.value;
    
    // Logic for hiding pie settings during export
    const hidePieSettings = () => {
        if (type === 'aumento-capacidad') {
            const rows = document.querySelectorAll('#aumento-capacidad-fields tr');
            // Try to find the row containing % Pie in Aumento
            rows.forEach(row => {
                if (row.textContent.includes('% Pie:')) row.style.display = 'none';
            });
        } else {
            piePercentRow.style.display = 'none';
        }
    };

    const restorePieSettings = () => {
        if (type === 'aumento-capacidad') {
            const rows = document.querySelectorAll('#aumento-capacidad-fields tr');
            rows.forEach(row => {
                if (row.textContent.includes('% Pie:')) row.style.display = '';
            });
        } else {
            piePercentRow.style.display = (type === 'sepultacion' || type === 'cremacion') ? '' : 'none';
        }
    };

    const adjNotes = Array.from(captureArea.querySelectorAll('.small-note'));
    const originalAdjDisplays = adjNotes.map(el => el.style.display);

    hidePieSettings();
    adjNotes.forEach(el => el.style.display = 'none');

    const canvas = await html2canvas(captureArea, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
    });

    restorePieSettings();
    adjNotes.forEach((el, index) => el.style.display = originalAdjDisplays[index]);
    return canvas;
}

async function exportAsImage() {
    const canvas = await captureWithoutPiePercent();
    if (canvas.toBlob) {
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.download = `Cotizacion-${new Date().getTime()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 'image/png');
    } else {
        const link = document.createElement('a');
        link.style.display = 'none';
        link.download = `Cotizacion-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

async function shareAsImage() {
    const canvas = await captureWithoutPiePercent();
    canvas.toBlob(async (blob) => {
        const file = new File([blob], 'cotizacion.png', { type: 'image/png' });
        if (navigator.share) {
            try {
                await navigator.share({
                    files: [file],
                    title: 'Cotización Sepultura',
                    text: 'Detalle de cotización anticipada'
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            alert('Navegador no compatible con compartir.');
        }
    }, 'image/png');
}
