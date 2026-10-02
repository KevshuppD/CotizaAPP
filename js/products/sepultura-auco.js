// js/products/sepultura-auco.js - Lógica Financiera Unificada Sepultura Parque Auco

let currentMode = 'uf'; // 'uf' | 'pesos' | 'contado'
let selectedPlazos = new Set([24, 36, 48, 60, 72]);

function getAvailablePlazosForMode(mode) {
    if (mode === 'uf') return [24, 36, 48, 60, 72];
    if (mode === 'pesos') return [24, 36, 48, 60, 72];
    if (mode === 'contado') return [1, 12, 24, 36, 48, 60, 72];
    return [24, 36, 48, 60, 72];
}

function updatePlazosCheckboxes() {
    const container = document.getElementById('plazos-checkboxes-container');
    if (!container) return;

    const availablePlazos = getAvailablePlazosForMode(currentMode);
    
    let html = '';
    availablePlazos.forEach(plazo => {
        const isChecked = selectedPlazos.has(plazo);
        const labelText = plazo === 1 ? '1 cuota' : `${plazo} ctas`;
        html += `
            <label style="display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: bold; cursor: pointer; background: #fff; padding: 3px 8px; border-radius: 4px; border: 1px solid #23C27E; color: #168053; user-select: none;">
                <input type="checkbox" class="plazo-filter-checkbox" value="${plazo}" ${isChecked ? 'checked' : ''} style="cursor: pointer; accent-color: #23C27E;">
                <span>${labelText}</span>
            </label>
        `;
    });

    // Botón para seleccionar todas
    html += `
        <button type="button" id="btn-toggle-all-plazos" style="font-size: 11px; font-weight: bold; padding: 3px 8px; border: 1px solid #168053; background: #168053; color: #fff; border-radius: 4px; cursor: pointer; margin-left: 4px;">
            Todas
        </button>
    `;

    container.innerHTML = html;

    // Listeners para checkboxes
    container.querySelectorAll('.plazo-filter-checkbox').forEach(chk => {
        chk.addEventListener('change', (e) => {
            const val = parseInt(e.target.value, 10);
            if (e.target.checked) {
                selectedPlazos.add(val);
            } else {
                selectedPlazos.delete(val);
            }
            calculateSepulturaAuco('filter-change');
        });
    });

    const toggleAllBtn = document.getElementById('btn-toggle-all-plazos');
    if (toggleAllBtn) {
        toggleAllBtn.addEventListener('click', () => {
            const allAvailable = getAvailablePlazosForMode(currentMode);
            if (selectedPlazos.size === allAvailable.length) {
                selectedPlazos.clear();
            } else {
                selectedPlazos = new Set(allAvailable);
            }
            updatePlazosCheckboxes();
            calculateSepulturaAuco('filter-change');
        });
    }
}

function calculateSepulturaAuco(triggeredBy = '') {
    const refUfInput = document.getElementById('ref-uf-input');
    const refClpInput = document.getElementById('ref-clp-input');
    const descPercentEl = document.getElementById('porcentaje-descuento-main');
    const descuentoUfInput = document.getElementById('descuento-uf-input');
    const descuentoClpInput = document.getElementById('descuento-clp-input');
    const capitalAnteriorUfInput = document.getElementById('capital-anterior-uf-input');
    const capitalAnteriorClpInput = document.getElementById('capital-anterior-clp-input');
    const valorNiUfDisplay = document.getElementById('valor-ni-uf');
    const valorNiClpInput = document.getElementById('valor-ni-clp-input');
    const piePercentEl = document.getElementById('pie-percent');
    const pieUfInput = document.getElementById('pie-uf');
    const pieClpInput = document.getElementById('pie-clp-input');
    const saldoFinanciarUfInput = document.getElementById('saldo-financiar-uf-input');
    const saldoFinanciarClpInput = document.getElementById('saldo-financiar-clp-input');

    let valorRealUF = parseFloat(refUfInput && refUfInput.value ? refUfInput.value : '0') || 0;
    let descuentoUF = parseFloat(descuentoUfInput && descuentoUfInput.value ? descuentoUfInput.value : '0') || 0;
    let capitalAnteriorUF = parseFloat(capitalAnteriorUfInput && capitalAnteriorUfInput.value ? capitalAnteriorUfInput.value : '0') || 0;
    let valorPromoUF = parseFloat(valorNiUfDisplay && valorNiUfDisplay.value ? valorNiUfDisplay.value : '0') || 0;
    let pieUF = parseFloat(pieUfInput && pieUfInput.value ? pieUfInput.value : '0') || 0;

    // 1. Manejo de inputs del usuario
    // Valor Real
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

    // Descuento % o Monto
    if (triggeredBy === 'desc-percent' && descPercentEl) {
        const percent = parseFloat(descPercentEl.value) || 0;
        descuentoUF = valorRealUF > 0 ? (valorRealUF * (percent / 100)) : 0;
        if (descuentoUfInput) descuentoUfInput.value = descuentoUF > 0 ? descuentoUF.toFixed(2) : '';
        if (descuentoClpInput) setCLPValue(descuentoClpInput, descuentoUF > 0 ? Math.round(descuentoUF * currentUFValue) : '');
    } else if (triggeredBy === 'desc-clp' && descuentoClpInput) {
        const clpVal = parseCLP(descuentoClpInput.value);
        descuentoUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (descuentoUfInput) descuentoUfInput.value = descuentoUF > 0 ? descuentoUF.toFixed(2) : '';
        if (descPercentEl && valorRealUF > 0) {
            const p = (descuentoUF / valorRealUF) * 100;
            descPercentEl.value = Math.round(p * 10) / 10;
        }
    } else if (triggeredBy === 'desc-uf' && descuentoUfInput) {
        descuentoUF = parseFloat(descuentoUfInput.value) || 0;
        if (descuentoClpInput && document.activeElement !== descuentoClpInput) {
            setCLPValue(descuentoClpInput, descuentoUF > 0 ? Math.round(descuentoUF * currentUFValue) : '');
        }
        if (descPercentEl && valorRealUF > 0) {
            const p = (descuentoUF / valorRealUF) * 100;
            descPercentEl.value = Math.round(p * 10) / 10;
        }
    } else if ((triggeredBy === 'ref-uf' || triggeredBy === 'ref-clp') && descPercentEl && parseFloat(descPercentEl.value) > 0) {
        const percent = parseFloat(descPercentEl.value) || 0;
        descuentoUF = valorRealUF * (percent / 100);
        if (descuentoUfInput) descuentoUfInput.value = descuentoUF > 0 ? descuentoUF.toFixed(2) : '';
        if (descuentoClpInput) setCLPValue(descuentoClpInput, descuentoUF > 0 ? Math.round(descuentoUF * currentUFValue) : '');
    }

    // Capital Anterior
    if (triggeredBy === 'cap-ant-clp' && capitalAnteriorClpInput) {
        const clpVal = parseCLP(capitalAnteriorClpInput.value);
        capitalAnteriorUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (capitalAnteriorUfInput) capitalAnteriorUfInput.value = capitalAnteriorUF > 0 ? capitalAnteriorUF.toFixed(2) : '';
    } else if (triggeredBy === 'cap-ant-uf' && capitalAnteriorUfInput) {
        capitalAnteriorUF = parseFloat(capitalAnteriorUfInput.value) || 0;
        if (capitalAnteriorClpInput && document.activeElement !== capitalAnteriorClpInput) {
            setCLPValue(capitalAnteriorClpInput, capitalAnteriorUF > 0 ? Math.round(capitalAnteriorUF * currentUFValue) : '');
        }
    }

    // 2. Valor Promocional = Valor Real - Descuento - Capital Anterior
    if (triggeredBy === 'ni-clp' && valorNiClpInput) {
        const clpVal = parseCLP(valorNiClpInput.value);
        valorPromoUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (valorNiUfDisplay) valorNiUfDisplay.value = valorPromoUF > 0 ? valorPromoUF.toFixed(2) : '';
    } else if (triggeredBy === 'ni-uf' && valorNiUfDisplay) {
        valorPromoUF = parseFloat(valorNiUfDisplay.value) || 0;
        if (valorNiClpInput && document.activeElement !== valorNiClpInput) {
            setCLPValue(valorNiClpInput, valorPromoUF > 0 ? Math.round(valorPromoUF * currentUFValue) : '');
        }
    } else {
        valorPromoUF = Math.max(0, valorRealUF - descuentoUF - capitalAnteriorUF);
        if (valorNiUfDisplay && document.activeElement !== valorNiUfDisplay) {
            valorNiUfDisplay.value = valorPromoUF > 0 ? valorPromoUF.toFixed(2) : '';
        }
        if (valorNiClpInput && document.activeElement !== valorNiClpInput) {
            setCLPValue(valorNiClpInput, valorPromoUF > 0 ? Math.round(valorPromoUF * currentUFValue) : '');
        }
    }

    // 3. Pie (por defecto 10% de Valor Promocional o editable)
    let piePercent = 10;
    if (piePercentEl && piePercentEl.value !== '') {
        const parsed = parseFloat(piePercentEl.value);
        if (!isNaN(parsed) && parsed >= 0) {
            piePercent = parsed;
        }
    }

    if (triggeredBy === 'pie-percent' && piePercentEl) {
        pieUF = valorPromoUF > 0 ? (valorPromoUF * (piePercent / 100)) : 0;
        if (pieUfInput) pieUfInput.value = pieUF > 0 ? pieUF.toFixed(2) : (piePercent === 0 ? '0.00' : '');
        if (pieClpInput) setCLPValue(pieClpInput, pieUF > 0 ? Math.round(pieUF * currentUFValue) : (piePercent === 0 ? 0 : ''));
    } else if (triggeredBy === 'pie-clp' && pieClpInput) {
        const clpVal = parseCLP(pieClpInput.value);
        pieUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (pieUfInput) pieUfInput.value = pieUF > 0 ? pieUF.toFixed(2) : (clpVal === 0 ? '0.00' : '');
        if (piePercentEl && valorPromoUF > 0) {
            const p = (pieUF / valorPromoUF) * 100;
            piePercentEl.value = Math.round(p * 10) / 10;
        }
    } else if (triggeredBy === 'pie-uf' && pieUfInput) {
        pieUF = parseFloat(pieUfInput.value) || 0;
        if (pieClpInput && document.activeElement !== pieClpInput) {
            setCLPValue(pieClpInput, pieUF > 0 ? Math.round(pieUF * currentUFValue) : (pieUF === 0 ? 0 : ''));
        }
        if (piePercentEl && valorPromoUF > 0) {
            const p = (pieUF / valorPromoUF) * 100;
            piePercentEl.value = Math.round(p * 10) / 10;
        }
    } else {
        pieUF = valorPromoUF > 0 ? (valorPromoUF * (piePercent / 100)) : 0;
        if (pieUfInput && document.activeElement !== pieUfInput) {
            pieUfInput.value = pieUF > 0 ? pieUF.toFixed(2) : (piePercent === 0 ? '0.00' : '');
        }
        if (pieClpInput && document.activeElement !== pieClpInput) {
            setCLPValue(pieClpInput, pieUF > 0 ? Math.round(pieUF * currentUFValue) : (piePercent === 0 ? 0 : ''));
        }
    }

    // 4. Saldo a Financiar = Valor Promocional - Pie
    let saldoUF = 0;
    if (triggeredBy === 'saldo-clp' && saldoFinanciarClpInput) {
        const clpVal = parseCLP(saldoFinanciarClpInput.value);
        saldoUF = currentUFValue > 0 ? (clpVal / currentUFValue) : 0;
        if (saldoFinanciarUfInput) saldoFinanciarUfInput.value = saldoUF > 0 ? saldoUF.toFixed(2) : '';
    } else if (triggeredBy === 'saldo-uf' && saldoFinanciarUfInput) {
        saldoUF = parseFloat(saldoFinanciarUfInput.value) || 0;
        if (saldoFinanciarClpInput && document.activeElement !== saldoFinanciarClpInput) {
            setCLPValue(saldoFinanciarClpInput, saldoUF > 0 ? Math.round(saldoUF * currentUFValue) : '');
        }
    } else {
        saldoUF = Math.max(0, valorPromoUF - pieUF);
        if (saldoFinanciarUfInput && document.activeElement !== saldoFinanciarUfInput) {
            saldoFinanciarUfInput.value = saldoUF > 0 ? saldoUF.toFixed(2) : '';
        }
        if (saldoFinanciarClpInput && document.activeElement !== saldoFinanciarClpInput) {
            setCLPValue(saldoFinanciarClpInput, saldoUF > 0 ? Math.round(saldoUF * currentUFValue) : '');
        }
    }

    // Sincronizar UF al inicializar
    if (triggeredBy === 'uf-manual' || triggeredBy === 'init') {
        if (refClpInput && valorRealUF > 0) setCLPValue(refClpInput, Math.round(valorRealUF * currentUFValue));
        if (descuentoClpInput && descuentoUF > 0) setCLPValue(descuentoClpInput, Math.round(descuentoUF * currentUFValue));
        if (capitalAnteriorClpInput && capitalAnteriorUF > 0) setCLPValue(capitalAnteriorClpInput, Math.round(capitalAnteriorUF * currentUFValue));
        if (valorNiClpInput && valorPromoUF > 0) setCLPValue(valorNiClpInput, Math.round(valorPromoUF * currentUFValue));
        if (pieClpInput && pieUF > 0) setCLPValue(pieClpInput, Math.round(pieUF * currentUFValue));
        if (saldoFinanciarClpInput && saldoUF > 0) setCLPValue(saldoFinanciarClpInput, Math.round(saldoUF * currentUFValue));
    }

    // 5. Renderizado de Tabla de Cuotas según Modalidad Activa
    renderCuotasTable(saldoUF);
}

function renderCuotasTable(saldoUF) {
    const headerRow = document.getElementById('cuotas-header-row');
    const cuotasBody = document.getElementById('sepultura-cuotas-body');
    if (!headerRow || !cuotasBody) return;

    let headerHTML = '';
    let bodyHTML = '';

    const saldoCLP = Math.round(saldoUF * currentUFValue);

    if (currentMode === 'uf') {
        // Modalidad UF (0,55% tasa mensual)
        headerHTML = `
            <th style="width: 22%; text-align: left;">Plazo</th>
            <th style="width: 20%; text-align: center;">Factor (0,55%)</th>
            <th style="width: 18%; text-align: center;">Gasto Adm.</th>
            <th class="uf-col" style="width: 20%; text-align: center;">Total Cuota UF</th>
            <th class="clp-col" style="width: 20%; text-align: right;">Total Cuota CLP</th>
        `;

        const plazosUF = [
            { plazo: 24, factor: 0.04459 },
            { plazo: 36, factor: 0.03069 },
            { plazo: 48, factor: 0.02376 },
            { plazo: 60, factor: 0.01961 },
            { plazo: 72, factor: 0.01686 }
        ];

        let rowsCount = 0;

        plazosUF.forEach(item => {
            if (!selectedPlazos.has(item.plazo)) return;
            rowsCount++;

            const baseCuotaUF = saldoUF > 0 ? (saldoUF * item.factor) : 0;
            const gastoAdminUF = 0.10;
            const totalCuotaUF = baseCuotaUF > 0 ? (baseCuotaUF + gastoAdminUF) : 0;
            const totalCuotaCLP = Math.round(totalCuotaUF * currentUFValue);

            bodyHTML += `
                <tr>
                    <td style="font-weight: bold; color: #333; text-align: left;">${item.plazo} cuotas</td>
                    <td style="text-align: center; color: #444;">${item.factor.toFixed(5).replace('.', ',')}</td>
                    <td style="text-align: center; color: #666;">0,10 UF</td>
                    <td class="uf-col" style="font-weight: bold; text-align: center; color: #168053;">
                        ${totalCuotaUF > 0 ? totalCuotaUF.toFixed(2).replace('.', ',') + ' UF' : '-'}
                    </td>
                    <td class="clp-col yellow-bg" style="font-weight: bold; font-size: 15px; color: var(--primary-green); text-align: right;">
                        ${totalCuotaCLP > 0 ? formatCurrency(totalCuotaCLP) : '-'}
                    </td>
                </tr>
            `;
        });

        if (rowsCount === 0) {
            bodyHTML = `<tr><td colspan="5" style="text-align: center; color: #888; padding: 14px; font-style: italic;">No hay cuotas marcadas para mostrar</td></tr>`;
        }

    } else if (currentMode === 'pesos') {
        // Modalidad Pesos ($)
        headerHTML = `
            <th style="width: 22%; text-align: left;">Plazo</th>
            <th style="width: 20%; text-align: center;">Factor Pesos</th>
            <th style="width: 18%; text-align: center;">Gasto Adm.</th>
            <th class="uf-col" style="width: 20%; text-align: center;">Total Cuota UF</th>
            <th class="clp-col" style="width: 20%; text-align: right;">Total Cuota CLP</th>
        `;

        const plazosPesos = [
            { plazo: 24, factor: 0.04992 },
            { plazo: 36, factor: 0.03615 },
            { plazo: 48, factor: 0.02938 },
            { plazo: 60, factor: 0.02808 },
            { plazo: 72, factor: 0.025603 }
        ];

        const gastoAdminCLP = 3964;
        let rowsCount = 0;

        plazosPesos.forEach(item => {
            if (!selectedPlazos.has(item.plazo)) return;
            rowsCount++;

            const baseCuotaCLP = saldoCLP > 0 ? Math.round(saldoCLP * item.factor) : 0;
            const totalCuotaCLP = baseCuotaCLP > 0 ? (baseCuotaCLP + gastoAdminCLP) : 0;
            const totalCuotaUF = currentUFValue > 0 && totalCuotaCLP > 0 ? (totalCuotaCLP / currentUFValue) : 0;

            bodyHTML += `
                <tr>
                    <td style="font-weight: bold; color: #333; text-align: left;">${item.plazo} cuotas</td>
                    <td style="text-align: center; color: #444;">${item.factor.toString().replace('.', ',')}</td>
                    <td style="text-align: center; color: #666;">$3.964</td>
                    <td class="uf-col" style="font-weight: bold; text-align: center; color: #168053;">
                        ${totalCuotaUF > 0 ? totalCuotaUF.toFixed(2).replace('.', ',') + ' UF' : '-'}
                    </td>
                    <td class="clp-col yellow-bg" style="font-weight: bold; font-size: 15px; color: var(--primary-green); text-align: right;">
                        ${totalCuotaCLP > 0 ? formatCurrency(totalCuotaCLP) : '-'}
                    </td>
                </tr>
            `;
        });

        if (rowsCount === 0) {
            bodyHTML = `<tr><td colspan="5" style="text-align: center; color: #888; padding: 14px; font-style: italic;">No hay cuotas marcadas para mostrar</td></tr>`;
        }

    } else if (currentMode === 'contado') {
        // Modalidad Cuota Contado / Sin Interés (Solo Gasto Administrativo)
        headerHTML = `
            <th style="width: 22%; text-align: left;">Plazo</th>
            <th style="width: 20%; text-align: center;">Tasa Interés</th>
            <th style="width: 18%; text-align: center;">Gasto Adm.</th>
            <th class="uf-col" style="width: 20%; text-align: center;">Total Cuota UF</th>
            <th class="clp-col" style="width: 20%; text-align: right;">Total Cuota CLP</th>
        `;

        const plazosContado = [1, 12, 24, 36, 48, 60, 72];
        let rowsCount = 0;

        plazosContado.forEach(plazo => {
            if (!selectedPlazos.has(plazo)) return;
            rowsCount++;

            const cuotaBaseUF = saldoUF > 0 ? (saldoUF / plazo) : 0;
            const gastoAdminUF = 0.10;
            const totalCuotaUF = cuotaBaseUF > 0 ? (cuotaBaseUF + gastoAdminUF) : 0;
            const totalCuotaCLP = Math.round(totalCuotaUF * currentUFValue);

            const labelPlazo = plazo === 1 ? '1 cuota (Contado)' : `${plazo} cuotas`;

            bodyHTML += `
                <tr>
                    <td style="font-weight: bold; color: #333; text-align: left;">${labelPlazo}</td>
                    <td style="text-align: center; color: #168053; font-weight: bold;">Sin Interés (0%)</td>
                    <td style="text-align: center; color: #666;">0,10 UF ($3.964)</td>
                    <td class="uf-col" style="font-weight: bold; text-align: center; color: #168053;">
                        ${totalCuotaUF > 0 ? totalCuotaUF.toFixed(2).replace('.', ',') + ' UF' : '-'}
                    </td>
                    <td class="clp-col yellow-bg" style="font-weight: bold; font-size: 15px; color: var(--primary-green); text-align: right;">
                        ${totalCuotaCLP > 0 ? formatCurrency(totalCuotaCLP) : '-'}
                    </td>
                </tr>
            `;
        });

        if (rowsCount === 0) {
            bodyHTML = `<tr><td colspan="5" style="text-align: center; color: #888; padding: 14px; font-style: italic;">No hay cuotas marcadas para mostrar</td></tr>`;
        }
    }

    headerRow.innerHTML = headerHTML;
    cuotasBody.innerHTML = bodyHTML;
}

// Inicialización de DOM y Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initDOMElements();

    const today = new Date();
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        dateEl.textContent = today.toLocaleDateString('es-CL', { 
            day: '2-digit', month: '2-digit', year: 'numeric' 
        }).replace(/\//g, '-');
    }

    // Botones de Modalidad (UF, Pesos, Contado)
    const btnUF = document.getElementById('btn-mode-uf');
    const btnPesos = document.getElementById('btn-mode-pesos');
    const btnContado = document.getElementById('btn-mode-contado');

    function setMode(mode) {
        currentMode = mode;
        if (btnUF) btnUF.classList.toggle('active', mode === 'uf');
        if (btnPesos) btnPesos.classList.toggle('active', mode === 'pesos');
        if (btnContado) btnContado.classList.toggle('active', mode === 'contado');

        // Reiniciar plazos seleccionados para la modalidad elegida
        selectedPlazos = new Set(getAvailablePlazosForMode(mode));
        updatePlazosCheckboxes();
        calculateSepulturaAuco('mode-change');
    }

    if (btnUF) btnUF.addEventListener('click', () => setMode('uf'));
    if (btnPesos) btnPesos.addEventListener('click', () => setMode('pesos'));
    if (btnContado) btnContado.addEventListener('click', () => setMode('contado'));

    // Inicializar checkboxes de plazos
    updatePlazosCheckboxes();

    // Sarcófagos, Capacidad y Reducciones
    const reduccionesMap = {
        1: 2, // Cap 1: 2 red
        2: 2, // Cap 2: 2 red
        3: 3, // Cap 3: 3 red
        4: 4, // Cap 4: 4 red
        6: 6, // Cap 6: 6 red
        8: 8  // Cap 8: 8 red
    };

    function updateReducciones(capacidad) {
        const display = document.getElementById('reducciones-display');
        if (!display) return;
        const count = reduccionesMap[capacidad] !== undefined ? reduccionesMap[capacidad] : capacidad;
        display.textContent = `${count} ${count === 1 ? 'Reducción' : 'Reducciones'}`;
    }

    const capacidadSelect = document.getElementById('capacidad-select');
    if (capacidadSelect) {
        capacidadSelect.addEventListener('change', () => {
            const cap = parseInt(capacidadSelect.value, 10);
            renderSepulturaGraphic(cap);
            updateReducciones(cap);
        });
        const initialCap = parseInt(capacidadSelect.value, 10) || 4;
        renderSepulturaGraphic(initialCap);
        updateReducciones(initialCap);
    }

    // Inputs Financieros
    const refUfInput = document.getElementById('ref-uf-input');
    if (refUfInput) refUfInput.addEventListener('input', () => calculateSepulturaAuco('ref-uf'));

    const refClpInput = document.getElementById('ref-clp-input');
    if (refClpInput) {
        refClpInput.addEventListener('input', () => calculateSepulturaAuco('ref-clp'));
        refClpInput.addEventListener('blur', () => {
            const val = parseCLP(refClpInput.value);
            if (val > 0) setCLPValue(refClpInput, val);
        });
    }

    const descPercentEl = document.getElementById('porcentaje-descuento-main');
    if (descPercentEl) {
        descPercentEl.addEventListener('input', () => calculateSepulturaAuco('desc-percent'));
        descPercentEl.addEventListener('change', () => calculateSepulturaAuco('desc-percent'));
    }

    const descuentoUfInput = document.getElementById('descuento-uf-input');
    if (descuentoUfInput) {
        descuentoUfInput.addEventListener('input', () => calculateSepulturaAuco('desc-uf'));
        descuentoUfInput.addEventListener('change', () => calculateSepulturaAuco('desc-uf'));
    }

    const descuentoClpInput = document.getElementById('descuento-clp-input');
    if (descuentoClpInput) {
        descuentoClpInput.addEventListener('input', () => calculateSepulturaAuco('desc-clp'));
        descuentoClpInput.addEventListener('change', () => calculateSepulturaAuco('desc-clp'));
        descuentoClpInput.addEventListener('blur', () => {
            const val = parseCLP(descuentoClpInput.value);
            if (val > 0) setCLPValue(descuentoClpInput, val);
        });
    }

    const capitalAnteriorUfInput = document.getElementById('capital-anterior-uf-input');
    if (capitalAnteriorUfInput) {
        capitalAnteriorUfInput.addEventListener('input', () => calculateSepulturaAuco('cap-ant-uf'));
        capitalAnteriorUfInput.addEventListener('change', () => calculateSepulturaAuco('cap-ant-uf'));
    }

    const capitalAnteriorClpInput = document.getElementById('capital-anterior-clp-input');
    if (capitalAnteriorClpInput) {
        capitalAnteriorClpInput.addEventListener('input', () => calculateSepulturaAuco('cap-ant-clp'));
        capitalAnteriorClpInput.addEventListener('change', () => calculateSepulturaAuco('cap-ant-clp'));
        capitalAnteriorClpInput.addEventListener('blur', () => {
            const val = parseCLP(capitalAnteriorClpInput.value);
            if (val > 0) setCLPValue(capitalAnteriorClpInput, val);
        });
    }

    const valorNiUf = document.getElementById('valor-ni-uf');
    if (valorNiUf) {
        valorNiUf.addEventListener('input', () => calculateSepulturaAuco('ni-uf'));
        valorNiUf.addEventListener('change', () => calculateSepulturaAuco('ni-uf'));
    }

    const valorNiClpInput = document.getElementById('valor-ni-clp-input');
    if (valorNiClpInput) {
        valorNiClpInput.addEventListener('input', () => calculateSepulturaAuco('ni-clp'));
        valorNiClpInput.addEventListener('change', () => calculateSepulturaAuco('ni-clp'));
        valorNiClpInput.addEventListener('blur', () => {
            const val = parseCLP(valorNiClpInput.value);
            if (val > 0) setCLPValue(valorNiClpInput, val);
        });
    }

    const piePercentEl = document.getElementById('pie-percent');
    if (piePercentEl) {
        piePercentEl.addEventListener('input', () => calculateSepulturaAuco('pie-percent'));
        piePercentEl.addEventListener('change', () => calculateSepulturaAuco('pie-percent'));
    }

    const pieUf = document.getElementById('pie-uf');
    if (pieUf) {
        pieUf.addEventListener('input', () => calculateSepulturaAuco('pie-uf'));
        pieUf.addEventListener('change', () => calculateSepulturaAuco('pie-uf'));
    }

    const pieClpInput = document.getElementById('pie-clp-input');
    if (pieClpInput) {
        pieClpInput.addEventListener('input', () => calculateSepulturaAuco('pie-clp'));
        pieClpInput.addEventListener('change', () => calculateSepulturaAuco('pie-clp'));
        pieClpInput.addEventListener('blur', () => {
            const val = parseCLP(pieClpInput.value);
            if (val > 0) setCLPValue(pieClpInput, val);
        });
    }

    const saldoUfInput = document.getElementById('saldo-financiar-uf-input');
    if (saldoUfInput) saldoUfInput.addEventListener('input', () => calculateSepulturaAuco('saldo-uf'));

    const saldoClpInput = document.getElementById('saldo-financiar-clp-input');
    if (saldoClpInput) {
        saldoClpInput.addEventListener('input', () => calculateSepulturaAuco('saldo-clp'));
        saldoClpInput.addEventListener('blur', () => {
            const val = parseCLP(saldoClpInput.value);
            if (val > 0) setCLPValue(saldoClpInput, val);
        });
    }

    const ufInput = document.getElementById('uf-value-input');
    if (ufInput) {
        ufInput.addEventListener('input', () => {
            const val = parseFloat(ufInput.value);
            if (!isNaN(val) && val > 0) {
                currentUFValue = val;
                calculateSepulturaAuco('uf-manual');
            }
        });
    }

    // Selector de Producto Superior
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
            window.location.href = productPageMap[productSelector.value] || 'sepultura-auco.html';
        });
    }

    fetchUFValue().then(() => {
        calculateSepulturaAuco('init');
    }).catch(() => {
        calculateSepulturaAuco('init');
    });
});

function createSarcofagoCard(num, compact = false) {
    const itemWrapper = document.createElement('div');
    itemWrapper.style.display = 'flex';
    itemWrapper.style.flexDirection = 'column';
    itemWrapper.style.alignItems = 'center';
    itemWrapper.style.padding = compact ? '4px 6px' : '8px 8px';
    itemWrapper.style.border = '2px solid var(--primary-green)';
    itemWrapper.style.borderRadius = '8px';
    itemWrapper.style.backgroundColor = '#ffffff';
    itemWrapper.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
    itemWrapper.style.width = '100%';
    itemWrapper.style.boxSizing = 'border-box';

    const imgWrapper = document.createElement('div');
    imgWrapper.style.width = '100%';
    imgWrapper.style.height = compact ? '75px' : '115px';
    imgWrapper.style.display = 'flex';
    imgWrapper.style.alignItems = 'center';
    imgWrapper.style.justifyContent = 'center';

    const img = document.createElement('img');
    img.src = 'sarcofago.png';
    img.alt = 'Sarcófago ' + num;
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    img.style.width = 'auto';
    img.style.height = 'auto';
    img.style.objectFit = 'contain';
    img.style.display = 'block';
    img.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.12))';

    imgWrapper.appendChild(img);
    itemWrapper.appendChild(imgWrapper);

    const label = document.createElement('span');
    label.textContent = 'Capacidad ' + num;
    label.style.fontSize = compact ? '11px' : '12px';
    label.style.fontWeight = 'bold';
    label.style.color = '#1b5e20';
    label.style.whiteSpace = 'nowrap';
    label.style.marginTop = '3px';

    itemWrapper.appendChild(label);
    return itemWrapper;
}

function renderSepulturaGraphic(capacidad) {
    const container = document.getElementById('sepultacion-graphic-container');
    if (!container) return;
    container.innerHTML = '';

    const isDoubleCol = capacidad >= 6;
    const compact = capacidad >= 4;

    const gridContainer = document.createElement('div');
    gridContainer.style.display = 'flex';
    gridContainer.style.gap = '10px';
    gridContainer.style.width = '100%';
    gridContainer.style.maxWidth = isDoubleCol ? '100%' : '260px';
    gridContainer.style.margin = '0 auto';
    gridContainer.style.justifyContent = 'center';

    if (capacidad === 6) {
        // 2 columnas de 3 capacidades hacia abajo c/u
        const leftCol = document.createElement('div');
        leftCol.style.display = 'flex';
        leftCol.style.flexDirection = 'column';
        leftCol.style.gap = '6px';
        leftCol.style.flex = '1';
        leftCol.style.width = '100%';

        for (let i = 1; i <= 3; i++) {
            leftCol.appendChild(createSarcofagoCard(i, compact));
        }
        gridContainer.appendChild(leftCol);

        const rightCol = document.createElement('div');
        rightCol.style.display = 'flex';
        rightCol.style.flexDirection = 'column';
        rightCol.style.gap = '6px';
        rightCol.style.flex = '1';
        rightCol.style.width = '100%';

        for (let i = 4; i <= 6; i++) {
            rightCol.appendChild(createSarcofagoCard(i, compact));
        }
        gridContainer.appendChild(rightCol);

    } else if (capacidad === 8) {
        // 2 columnas de 4 capacidades hacia abajo c/u
        const leftCol = document.createElement('div');
        leftCol.style.display = 'flex';
        leftCol.style.flexDirection = 'column';
        leftCol.style.gap = '6px';
        leftCol.style.flex = '1';
        leftCol.style.width = '100%';

        for (let i = 1; i <= 4; i++) {
            leftCol.appendChild(createSarcofagoCard(i, compact));
        }
        gridContainer.appendChild(leftCol);

        const rightCol = document.createElement('div');
        rightCol.style.display = 'flex';
        rightCol.style.flexDirection = 'column';
        rightCol.style.gap = '6px';
        rightCol.style.flex = '1';
        rightCol.style.width = '100%';

        for (let i = 5; i <= 8; i++) {
            rightCol.appendChild(createSarcofagoCard(i, compact));
        }
        gridContainer.appendChild(rightCol);

    } else {
        // 1, 2, 4 capacidades en una columna vertical
        const col = document.createElement('div');
        col.style.display = 'flex';
        col.style.flexDirection = 'column';
        col.style.gap = '6px';
        col.style.flex = '1';
        col.style.width = '100%';

        for (let i = 1; i <= capacidad; i++) {
            col.appendChild(createSarcofagoCard(i, compact));
        }
        gridContainer.appendChild(col);
    }

    container.appendChild(gridContainer);
}
