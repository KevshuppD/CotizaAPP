// script.js - Orquestador Principal, Control de Visibilidad y Enrutamiento de Cálculos

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
    } else if (isLiberador || type === 'cremacion') {
        elements.rightsInput.max = 4;
        if (parseInt(elements.rightsInput.value) > 4) {
            elements.rightsInput.value = 4;
        }
    } else {
        elements.rightsInput.max = 10;
    }

    elements.sepultacionFields.style.display = (isSepultacionFamily || isAumento || isLiberador) ? 'block' : 'none';
    elements.mantencionFields.style.display = isMantencion ? 'block' : 'none';

    if (elements.liberadorGraphicContainer) {
        if (isAumento || isLiberador) {
            elements.liberadorGraphicContainer.style.display = elements.toggleGraphic.checked ? 'block' : 'none';
            if (!elements.toggleGraphic.checked) {
                elements.liberadorGraphicContainer.innerHTML = '';
            }
        } else {
            elements.liberadorGraphicContainer.style.display = 'none';
        }
    }

    if (elements.descuentoRowMain) {
        elements.descuentoRowMain.style.display = (isSepultacionFamily || isAumento || isLiberador) ? '' : 'none';
    }

    elements.sepultacionOutput.style.display = (isSepultacionFamily || isAumento || isLiberador) ? 'block' : 'none';
    elements.mantencionOutput.style.display = isMantencion ? 'block' : 'none';
    elements.sepulturaLiberadorOutput.style.display = isLiberador ? 'block' : 'none';
    
    if (elements.reduccionesContainer) {
        elements.reduccionesContainer.style.display = (isLiberador || isAumento) ? 'flex' : 'none';
    }
    
    if (!isLiberador) {
        if (elements.labelValorNi) elements.labelValorNi.textContent = 'Valor Promocional (Uso Inmediato)';
        if (elements.labelValorAnt) elements.labelValorAnt.textContent = 'Valor anticipado(IVA Incluido)';
        if (elements.labelPie) elements.labelPie.innerHTML = 'Pie mínimo';
        if (elements.saldoFinanciarRow) elements.saldoFinanciarRow.style.display = 'none';
        if (elements.labelDescuentoOutput && !isAumento) elements.labelDescuentoOutput.innerHTML = '&nbsp;';
    }

    if (elements.mainCuotasTable) {
        elements.mainCuotasTable.style.display = isLiberador ? 'none' : '';
    }

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
        elements.capacityUnit.textContent = (type === 'cremacion') ? 'Anforas' : (isAumento ? 'capacidades' : (isLiberador ? 'criptas' : 'derechos'));
        elements.mainTitle.textContent = (type === 'cremacion')
            ? 'Cremación Anticipada'
            : (isAumento ? 'Aumento de Capacidad' : (isLiberador ? 'Sepultura con Beneficios' : 'Cotización Derecho de Sepultación Anticipada'));
        elements.refValueContainer.style.display = type === 'sepultacion' ? 'block' : 'none';
        elements.serviceImageContainer.style.display = type === 'cremacion' ? 'block' : 'none';
        elements.refLabel.textContent = type === 'sepultacion' ? 'Valor referencia por 1 derecho' : 'Valor referencia por 1 cripta';
    }
}

function getReduccionesFromCapacidad(capacidad) {
    const map = {
        1: 0,
        2: 4,
        3: 8,
        4: 12,
        8: 20
    };
    if (map[capacidad] !== undefined) return map[capacidad];
    if (capacidad <= 1) return 0;
    if (capacidad === 5) return 14;
    if (capacidad === 6) return 16;
    if (capacidad === 7) return 18;
    return capacidad * 2;
}

function updateCapacidadReduccionesOptions() {
    const select = elements.capacidadReduccionesSelect;
    if (!select) return;

    const parque = elements.parkSelector ? elements.parkSelector.value : '';
    const esPrado = parque.toUpperCase().includes('PRADO');

    select.innerHTML = '';

    if (esPrado) {
        const opt = document.createElement('option');
        opt.value = '4-8';
        opt.textContent = 'Capacidad 4 - 8 Reducciones';
        select.appendChild(opt);
    } else {
        const opciones = [
            { value: '2-4', text: 'Capacidad 2 - 4 Reducciones' },
            { value: '3-8', text: 'Capacidad 3 - 8 Reducciones' },
            { value: '4-12', text: 'Capacidad 4 - 12 Reducciones' },
            { value: '8-20', text: 'Capacidad 8 - 20 Reducciones' }
        ];
        opciones.forEach(o => {
            const opt = document.createElement('option');
            opt.value = o.value;
            opt.textContent = o.text;
            select.appendChild(opt);
        });
    }

    // Sincronizar inputs ocultos con la nueva selección
    const [cap, red] = select.value.split('-').map(Number);
    if (elements.rightsInput) elements.rightsInput.value = cap;
    if (elements.reduccionesInput) elements.reduccionesInput.value = red;
}

function updateCalculations(triggeredBy = '') {
    if (elements.ufInput && elements.ufInput.value.trim() !== '') {
        const manualVal = parseFloat(elements.ufInput.value);
        if (!isNaN(manualVal) && manualVal > 0) {
            currentUFValue = manualVal;
        }
    }

    const type = elements.productType ? elements.productType.value : 'sepultacion';
    const uf = currentUFValue;

    if (elements.parkDisplay) {
        elements.parkDisplay.textContent = 'PARQUE ' + elements.parkSelector.value;
    }

    if (type === 'mantencion') {
        calculateMantencion();
        return;
    }

    if (type === 'sepultura-liberador') {
        calculateSepulturaLiberador();
        return;
    }

    if (type === 'aumento-capacidad' && elements.liberadorGraphicContainer) {
        const toggleChecked = elements.toggleGraphic ? elements.toggleGraphic.checked : true;
        elements.liberadorGraphicContainer.style.display = toggleChecked ? 'block' : 'none';
        if (!toggleChecked) elements.liberadorGraphicContainer.innerHTML = '';
    }

    if (elements.liberadorGraphicContainer && type !== 'sepultura-liberador' && type !== 'aumento-capacidad') {
        elements.liberadorGraphicContainer.innerHTML = '';
        elements.liberadorGraphicContainer.style.display = 'none';
    }

    const rights = parseInt(elements.rightsInput.value) || 1;

    if (elements.reduccionesInput && (triggeredBy === 'rights' || triggeredBy === 'product' || triggeredBy === 'init')) {
        elements.reduccionesInput.value = getReduccionesFromCapacidad(rights);
    }

    // 1. Actualizar Valor Real / Lista en UF y CLP
    if (triggeredBy === 'ref-clp' && elements.refClpInput) {
        const clpVal = parseCLP(elements.refClpInput.value);
        const calcUf = uf > 0 ? (clpVal / uf) : 0;
        if (elements.refUfInput) elements.refUfInput.value = calcUf > 0 ? calcUf.toFixed(2) : '';
    } else if (triggeredBy === 'ref-uf') {
        const refUfVal = parseFloat(elements.refUfInput ? elements.refUfInput.value : '') || 0;
        if (elements.refClpInput) setCLPValue(elements.refClpInput, refUfVal > 0 ? Math.round(refUfVal * uf) : '');
    } else if (triggeredBy === 'rights' || triggeredBy === 'product' || triggeredBy === 'init') {
        const unitRefUf = (type === 'cremacion') ? 30.00 : 15.47;
        const baseRefUf = unitRefUf * rights;
        if (elements.refUfInput) elements.refUfInput.value = baseRefUf.toFixed(2);
        if (elements.refClpInput) setCLPValue(elements.refClpInput, Math.round(baseRefUf * uf));
    }

    const defaultUnitRef = (type === 'cremacion') ? 30.00 : 15.47;
    const totalRefUf = parseFloat(elements.refUfInput ? elements.refUfInput.value : '') || (defaultUnitRef * rights);
    const totalRefClp = totalRefUf * uf;

    if (elements.refClpInput && triggeredBy !== 'ref-clp') {
        setCLPValue(elements.refClpInput, Math.round(totalRefClp));
    }
    if (elements.refClpDisplay) {
        elements.refClpDisplay.textContent = formatCurrency(totalRefClp);
    }
    if (elements.refUfDisplay) {
        elements.refUfDisplay.textContent = totalRefUf.toFixed(2).replace('.', ',') + ' UF (IVA INCLUIDO)';
    }
    if (elements.refLabel) {
        const unitName = (type === 'cremacion') ? 'ánfora' : (type === 'aumento-capacidad' ? 'capacidad' : (type === 'sepultura-liberador' ? 'cripta' : 'derecho'));
        const pluralUnitName = (type === 'cremacion') ? 'ánforas' : (type === 'aumento-capacidad' ? 'capacidades' : (type === 'sepultura-liberador' ? 'criptas' : 'derechos'));
        elements.refLabel.textContent = `Valor referencia por ${rights} ${rights === 1 ? unitName : pluralUnitName}`;
    }

    // 2. Manejo bidireccional de Valor Promocional según el producto seleccionado
    if (triggeredBy === 'rights' || triggeredBy === 'product' || triggeredBy === 'init' || (elements.valorNiClpInput && elements.valorNiClpInput.value.trim() === '' && elements.valorNiUf && elements.valorNiUf.value.trim() === '')) {
        if (type === 'sepultacion') {
            const { promoClp, promoUf } = calculateSepultacionPromo(rights, uf);
            if (elements.valorNiClpInput) setCLPValue(elements.valorNiClpInput, promoClp);
            if (elements.valorNiUf && uf > 0) elements.valorNiUf.value = promoUf.toFixed(2);
        } else if (type === 'cremacion') {
            const { promoUf, promoClp, montoFinanciarClp, montoFinanciarUf, pieTotalClp } = calculateCremacionPreset(rights, uf);
            if (elements.valorNiUf) elements.valorNiUf.value = promoUf.toFixed(2);
            if (elements.valorNiClpInput) setCLPValue(elements.valorNiClpInput, promoClp);
            if (elements.pieClpInput) setCLPValue(elements.pieClpInput, pieTotalClp);
            if (elements.saldoFinanciarClpInput) setCLPValue(elements.saldoFinanciarClpInput, montoFinanciarClp);
            if (elements.saldoFinanciarUfInput) elements.saldoFinanciarUfInput.value = montoFinanciarUf.toFixed(2);
        } else if (type === 'aumento-capacidad') {
            calculateAumentoCapacidad(triggeredBy);
        }
    }

    if (triggeredBy === 'ni-clp' && elements.valorNiClpInput) {
        const clpVal = parseCLP(elements.valorNiClpInput.value);
        if (clpVal === 0) {
            elements.valorNiUf.value = '';
        } else {
            const calcUf = uf > 0 ? (clpVal / uf) : 0;
            elements.valorNiUf.value = calcUf > 0 ? calcUf.toFixed(2) : '';
        }
    } else if (triggeredBy === 'ni-uf' && elements.valorNiUf) {
        const rawUf = elements.valorNiUf.value.trim();
        if (rawUf === '') {
            if (elements.valorNiClpInput) setCLPValue(elements.valorNiClpInput, '');
        } else if (elements.valorNiClpInput) {
            const niUfVal = parseFloat(rawUf) || 0;
            setCLPValue(elements.valorNiClpInput, niUfVal > 0 ? Math.round(niUfVal * uf) : '');
        }
    } else if (triggeredBy !== 'ni-clp' && triggeredBy !== 'ni-uf') {
        const rawUf = elements.valorNiUf ? elements.valorNiUf.value.trim() : '';
        if (rawUf !== '' && elements.valorNiClpInput) {
            const niUfVal = parseFloat(rawUf) || 0;
            setCLPValue(elements.valorNiClpInput, niUfVal > 0 ? Math.round(niUfVal * uf) : '');
        }
    }

    const niUfRaw = elements.valorNiUf ? elements.valorNiUf.value.trim() : '';
    const niUf = parseFloat(niUfRaw) || 0;
    const hasPromoVal = niUfRaw !== '' && !isNaN(niUf) && niUf > 0;

    // 3. Descuento = Valor Referencia - Valor Promocional (Uso Inmediato)
    let descUf = 0;
    let descClp = 0;
    if (hasPromoVal) {
        descUf = Math.max(0, totalRefUf - niUf);
        descClp = descUf * uf;
    }

    if (elements.labelDescuentoUf) {
        elements.labelDescuentoUf.textContent = hasPromoVal ? formatUF(descUf) + ' UF' : '0,00 UF';
    }
    if (elements.labelDescuentoOutput) {
        elements.labelDescuentoOutput.textContent = hasPromoVal ? formatCurrency(descClp) : '$0';
    }

    // 4. Lógica de valores automáticos para Cremación o Sincronización con Valor Anticipado
    if (type === 'cremacion' && triggeredBy !== 'ant-manual' && triggeredBy !== 'ant-clp' && triggeredBy !== 'ant-uf') {
        const { promoUf } = calculateCremacionPreset(rights, uf);
        elements.valorAntUf.value = promoUf.toFixed(2);
    } else if (triggeredBy !== 'ant-uf' && triggeredBy !== 'ant-clp') {
        if (hasPromoVal) {
            elements.valorAntUf.value = niUf.toFixed(2);
            if (elements.valorAntClpInput) setCLPValue(elements.valorAntClpInput, Math.round(niUf * uf));
        } else {
            elements.valorAntUf.value = '';
            if (elements.valorAntClpInput) setCLPValue(elements.valorAntClpInput, '');
        }
    }

    if (triggeredBy === 'ant-clp' && elements.valorAntClpInput) {
        const clpVal = parseCLP(elements.valorAntClpInput.value);
        const calcUf = uf > 0 ? (clpVal / uf) : 0;
        elements.valorAntUf.value = calcUf > 0 ? calcUf.toFixed(2) : '';
    }
    const antUf = parseFloat(elements.valorAntUf.value) || 0;
    if (triggeredBy !== 'ant-clp' && elements.valorAntClpInput && elements.valorAntUf.value !== '') {
        setCLPValue(elements.valorAntClpInput, Math.round(antUf * uf));
    }

    // 5. Pie Mínimo y Monto a Financiar (Sincronización Bidireccional)
    const pieBaseUf = niUf;

    if (type !== 'cremacion') {
        if (triggeredBy === 'saldo-clp' && elements.saldoFinanciarClpInput) {
            const clpVal = parseCLP(elements.saldoFinanciarClpInput.value);
            const calcSaldoUf = uf > 0 ? (clpVal / uf) : 0;
            if (elements.saldoFinanciarUfInput) elements.saldoFinanciarUfInput.value = calcSaldoUf > 0 ? calcSaldoUf.toFixed(2) : '';
            
            const calcPieUf = Math.max(0, pieBaseUf - calcSaldoUf);
            if (elements.pieUf) elements.pieUf.value = hasPromoVal ? calcPieUf.toFixed(2) : '';
            if (elements.pieClpInput) setCLPValue(elements.pieClpInput, hasPromoVal ? Math.round(calcPieUf * uf) : '');
            if (pieBaseUf > 0 && elements.piePercent) {
                elements.piePercent.value = ((calcPieUf / pieBaseUf) * 100).toFixed(0);
            }
        } else if (triggeredBy === 'saldo-uf' && elements.saldoFinanciarUfInput) {
            const calcSaldoUf = parseFloat(elements.saldoFinanciarUfInput.value) || 0;
            if (elements.saldoFinanciarClpInput) setCLPValue(elements.saldoFinanciarClpInput, hasPromoVal ? Math.round(calcSaldoUf * uf) : '');
            
            const calcPieUf = Math.max(0, pieBaseUf - calcSaldoUf);
            if (elements.pieUf) elements.pieUf.value = hasPromoVal ? calcPieUf.toFixed(2) : '';
            if (elements.pieClpInput) setCLPValue(elements.pieClpInput, hasPromoVal ? Math.round(calcPieUf * uf) : '');
            if (pieBaseUf > 0 && elements.piePercent) {
                elements.piePercent.value = ((calcPieUf / pieBaseUf) * 100).toFixed(0);
            }
        } else if (triggeredBy === 'pie-clp' && elements.pieClpInput) {
            const clpVal = parseCLP(elements.pieClpInput.value);
            const calcPieUf = uf > 0 ? (clpVal / uf) : 0;
            if (elements.pieUf) elements.pieUf.value = calcPieUf > 0 ? calcPieUf.toFixed(2) : '';
            if (pieBaseUf > 0 && elements.piePercent) {
                elements.piePercent.value = ((calcPieUf / pieBaseUf) * 100).toFixed(0);
            }
            const calcSaldoUf = Math.max(0, pieBaseUf - calcPieUf);
            if (elements.saldoFinanciarUfInput) elements.saldoFinanciarUfInput.value = hasPromoVal ? calcSaldoUf.toFixed(2) : '';
            if (elements.saldoFinanciarClpInput) setCLPValue(elements.saldoFinanciarClpInput, hasPromoVal ? Math.round(calcSaldoUf * uf) : '');
        } else if (triggeredBy === 'pie-uf' && elements.pieUf) {
            const pieUfVal = parseFloat(elements.pieUf.value) || 0;
            if (pieBaseUf > 0 && elements.piePercent) {
                elements.piePercent.value = ((pieUfVal / pieBaseUf) * 100).toFixed(0);
            }
            if (elements.pieClpInput) setCLPValue(elements.pieClpInput, hasPromoVal ? Math.round(pieUfVal * uf) : '');
            const calcSaldoUf = Math.max(0, pieBaseUf - pieUfVal);
            if (elements.saldoFinanciarUfInput) elements.saldoFinanciarUfInput.value = hasPromoVal ? calcSaldoUf.toFixed(2) : '';
            if (elements.saldoFinanciarClpInput) setCLPValue(elements.saldoFinanciarClpInput, hasPromoVal ? Math.round(calcSaldoUf * uf) : '');
        } else if (triggeredBy === 'percent') {
            const perc = parseFloat(elements.piePercent.value) || 0;
            const pieUfVal = pieBaseUf * (perc / 100);
            if (elements.pieUf) elements.pieUf.value = hasPromoVal ? pieUfVal.toFixed(2) : '';
            if (elements.pieClpInput) setCLPValue(elements.pieClpInput, hasPromoVal ? Math.round(pieUfVal * uf) : '');
            const calcSaldoUf = Math.max(0, pieBaseUf - pieUfVal);
            if (elements.saldoFinanciarUfInput) elements.saldoFinanciarUfInput.value = hasPromoVal ? calcSaldoUf.toFixed(2) : '';
            if (elements.saldoFinanciarClpInput) setCLPValue(elements.saldoFinanciarClpInput, hasPromoVal ? Math.round(calcSaldoUf * uf) : '');
        } else {
            const perc = parseFloat(elements.piePercent.value) || 10;
            const pieUfVal = pieBaseUf * (perc / 100);
            if (elements.pieUf) elements.pieUf.value = hasPromoVal ? pieUfVal.toFixed(2) : '';
            if (elements.pieClpInput) setCLPValue(elements.pieClpInput, hasPromoVal ? Math.round(pieUfVal * uf) : '');
            const calcSaldoUf = Math.max(0, pieBaseUf - pieUfVal);
            if (elements.saldoFinanciarUfInput) elements.saldoFinanciarUfInput.value = hasPromoVal ? calcSaldoUf.toFixed(2) : '';
            if (elements.saldoFinanciarClpInput) setCLPValue(elements.saldoFinanciarClpInput, hasPromoVal ? Math.round(calcSaldoUf * uf) : '');
        }
    }

    const pieUfVal = parseFloat(elements.pieUf ? elements.pieUf.value : '') || 0;
    const balanceUf = parseFloat(elements.saldoFinanciarUfInput ? elements.saldoFinanciarUfInput.value : '') || Math.max(0, antUf - pieUfVal);
    let cuotasResult;
    if (type === 'cremacion') {
        const montoFinanciarClp = parseCLP(elements.saldoFinanciarClpInput ? elements.saldoFinanciarClpInput.value : 0);
        const promoClpVal = parseCLP(elements.valorNiClpInput ? elements.valorNiClpInput.value : 0);
        const pieClpVal = parseCLP(elements.pieClpInput ? elements.pieClpInput.value : 0);
        cuotasResult = calculateCremacionCuotas(montoFinanciarClp, promoClpVal, pieClpVal, uf, hasPromoVal);
    } else {
        cuotasResult = calculateSepultacionCuotas(balanceUf, uf, hasPromoVal);
    }
    const { factor12, factor24, factor36, factor48, cuota12, cuota24, cuota36, cuota48, notes } = cuotasResult;

    if (elements.factors[12]) elements.factors[12].textContent = hasPromoVal ? formatUF(factor12) : '-';
    if (elements.factors[24]) elements.factors[24].textContent = hasPromoVal ? formatUF(factor24) : '-';
    if (elements.factors[36]) elements.factors[36].textContent = hasPromoVal ? formatUF(factor36) : '-';
    if (elements.factors[48]) elements.factors[48].textContent = hasPromoVal ? formatUF(factor48) : '-';

    elements.cuotas[12].textContent = hasPromoVal ? formatCurrency(cuota12) : '$0';
    elements.cuotas[24].textContent = hasPromoVal ? formatCurrency(cuota24) : '$0';
    elements.cuotas[36].textContent = hasPromoVal ? formatCurrency(cuota36) : '$0';
    elements.cuotas[48].textContent = hasPromoVal ? formatCurrency(cuota48) : '$0';

    if (elements.adjustments[12]) elements.adjustments[12].textContent = notes ? notes[12] : '';
    if (elements.adjustments[24]) elements.adjustments[24].textContent = notes ? notes[24] : '';
    if (elements.adjustments[36]) elements.adjustments[36].textContent = notes ? notes[36] : '';
    if (elements.adjustments[48]) elements.adjustments[48].textContent = notes ? notes[48] : '';

    renderVisualGraphic(type, rights);
}

// Inicialización de la Aplicación
document.addEventListener('DOMContentLoaded', () => {
    initDOMElements();
    const today = new Date();
    if (elements.date) {
        elements.date.textContent = today.toLocaleDateString('es-CL', { 
            day: '2-digit', month: '2-digit', year: 'numeric' 
        }).replace(/\//g, '-');
    }

    // Event Listeners principales
    if (elements.ufInput) {
        const handleUFChange = () => {
            const manualVal = parseFloat(elements.ufInput.value);
            if (!isNaN(manualVal) && manualVal > 0) {
                currentUFValue = manualVal;
                updateCalculations('uf-manual');
            }
        };
        elements.ufInput.addEventListener('input', handleUFChange);
        elements.ufInput.addEventListener('change', handleUFChange);
    }

    if (elements.valorNiUf) elements.valorNiUf.addEventListener('input', () => updateCalculations('ni-uf'));
    if (elements.valorNiClpInput) elements.valorNiClpInput.addEventListener('input', () => updateCalculations('ni-clp'));

    if (elements.valorAntUf) elements.valorAntUf.addEventListener('input', () => updateCalculations('ant-uf'));
    if (elements.valorAntClpInput) elements.valorAntClpInput.addEventListener('input', () => updateCalculations('ant-clp'));

    if (elements.pieUf) elements.pieUf.addEventListener('input', () => updateCalculations('pie-uf'));
    if (elements.pieClpInput) elements.pieClpInput.addEventListener('input', () => updateCalculations('pie-clp'));

    if (elements.piePercent) elements.piePercent.addEventListener('input', () => updateCalculations('percent'));
    if (elements.rightsInput) elements.rightsInput.addEventListener('input', () => updateCalculations('rights'));
    if (elements.reduccionesInput) elements.reduccionesInput.addEventListener('input', () => updateCalculations('reducciones'));
    if (elements.refUfInput) elements.refUfInput.addEventListener('input', () => updateCalculations('ref-uf'));
    if (elements.refClpInput) elements.refClpInput.addEventListener('input', () => updateCalculations('ref-clp'));

    if (elements.saldoFinanciarUfInput) elements.saldoFinanciarUfInput.addEventListener('input', () => updateCalculations('saldo-uf'));
    if (elements.saldoFinanciarClpInput) elements.saldoFinanciarClpInput.addEventListener('input', () => updateCalculations('saldo-clp'));
    
    ['refClpInput', 'valorNiClpInput', 'valorAntClpInput', 'pieClpInput', 'saldoFinanciarClpInput'].forEach(key => {
        if (elements[key]) {
            elements[key].addEventListener('blur', () => {
                const val = parseCLP(elements[key].value);
                if (val > 0) setCLPValue(elements[key], val);
            });
        }
    });
    
    if (elements.valorPlanUf) elements.valorPlanUf.addEventListener('input', () => updateCalculations('mantencion'));
    if (elements.descuentoPorcentaje) elements.descuentoPorcentaje.addEventListener('input', () => updateCalculations('mantencion'));
    
    if (elements.tipoDescuentoMain) elements.tipoDescuentoMain.addEventListener('change', () => updateCalculations('discount-manual'));
    if (elements.porcentajeDescuentoMain) elements.porcentajeDescuentoMain.addEventListener('input', () => updateCalculations('discount-manual'));
    
    if (elements.parkSelector) elements.parkSelector.addEventListener('change', () => {
        updateCapacidadReduccionesOptions();
        updateCalculations('park');
    });

    const productPageMap = {
        'sepultacion': 'index.html',
        'sepultura-liberador': 'sepultura-liberador.html',
        'cremacion': 'cremacion.html',
        'aumento-capacidad': 'aumento-capacidad.html',
        'mantencion': 'mantencion.html'
    };

    if (elements.productType) {
        elements.productType.addEventListener('change', () => { 
            const selectedVal = elements.productType.value;
            localStorage.setItem('lastProductType', selectedVal);
            const targetPage = productPageMap[selectedVal];
            const currentPath = window.location.pathname;
            const isAlreadyOnPage = currentPath.endsWith('/' + targetPage) || (targetPage === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('/index.html')));
            if (targetPage && !isAlreadyOnPage) {
                window.location.href = targetPage;
            } else {
                setProductVisibility(selectedVal);
                updateCalculations('product'); 
            }
        });
    }

    if (elements.toggleGraphic) elements.toggleGraphic.addEventListener('change', toggleGraphic);

    // Listener para selector predefinido de capacidad/reducciones (sepultura-liberador)
    if (elements.capacidadReduccionesSelect) {
        elements.capacidadReduccionesSelect.addEventListener('change', () => {
            const val = elements.capacidadReduccionesSelect.value;
            const [cap, red] = val.split('-').map(Number);
            if (elements.rightsInput) elements.rightsInput.value = cap;
            if (elements.reduccionesInput) elements.reduccionesInput.value = red;
            updateCalculations('rights');
        });
        // Inicializar opciones según parque actual
        updateCapacidadReduccionesOptions();
    } else if (elements.rightsInput) {
        elements.rightsInput.value = 1;
    }

    setProductVisibility(elements.productType ? elements.productType.value : 'sepultacion');
    fetchUFValue();
    updateCalculations('init');
});
