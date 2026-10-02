// js/products/cremacion.js - Lógica Financiera Cremación (Saldo / Cuotas + Gasto Adm.)

let currentMode = 'uf'; // 'uf' | 'pesos'
let selectedPlazos = new Set([12, 24, 36, 48]);

function getAvailablePlazosForMode() {
    return [12, 24, 36, 48, 60, 72];
}

function updatePlazosCheckboxes() {
    const container = document.getElementById('plazos-checkboxes-container');
    if (!container) return;

    const availablePlazos = getAvailablePlazosForMode();
    
    let html = '';
    availablePlazos.forEach(plazo => {
        const isChecked = selectedPlazos.has(plazo);
        const labelText = `${plazo} ctas`;
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
            calculateCremacion('filter-change');
        });
    });

    const toggleAllBtn = document.getElementById('btn-toggle-all-plazos');
    if (toggleAllBtn) {
        toggleAllBtn.addEventListener('click', () => {
            const allAvailable = getAvailablePlazosForMode();
            if (selectedPlazos.size === allAvailable.length) {
                selectedPlazos.clear();
            } else {
                selectedPlazos = new Set(allAvailable);
            }
            updatePlazosCheckboxes();
            calculateCremacion('filter-change');
        });
    }
}

function calculateCremacion(triggeredBy = '') {
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
    const cuotasBody = document.getElementById('cremacion-cuotas-body');
    if (!headerRow || !cuotasBody) return;

    let headerHTML = '';
    let bodyHTML = '';

    const saldoCLP = Math.round(saldoUF * currentUFValue);
    const availablePlazos = getAvailablePlazosForMode();

    if (currentMode === 'uf') {
        // Modalidad UF: Saldo UF / Plazo + Gasto Adm. 0,10 UF
        headerHTML = `
            <th style="width: 22%; text-align: left;">Plazo</th>
            <th style="width: 20%; text-align: center;">Cuota Base UF</th>
            <th style="width: 18%; text-align: center;">Gasto Adm.</th>
            <th class="uf-col" style="width: 20%; text-align: center;">Total Cuota UF</th>
            <th class="clp-col" style="width: 20%; text-align: right;">Total Cuota CLP</th>
        `;

        const gastoAdminUF = 0.10;
        let rowsCount = 0;

        availablePlazos.forEach(plazo => {
            if (!selectedPlazos.has(plazo)) return;
            rowsCount++;

            const baseCuotaUF = saldoUF > 0 ? (saldoUF / plazo) : 0;
            const totalCuotaUF = baseCuotaUF > 0 ? (baseCuotaUF + gastoAdminUF) : 0;
            const totalCuotaCLP = Math.round(totalCuotaUF * currentUFValue);

            bodyHTML += `
                <tr>
                    <td style="font-weight: bold; color: #333; text-align: left;">${plazo} cuotas</td>
                    <td style="text-align: center; color: #444;">${baseCuotaUF > 0 ? baseCuotaUF.toFixed(2).replace('.', ',') + ' UF' : '-'}</td>
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
        // Modalidad Pesos ($): Saldo CLP / Plazo + Gasto Adm. $3.964 CLP
        headerHTML = `
            <th style="width: 22%; text-align: left;">Plazo</th>
            <th style="width: 20%; text-align: center;">Cuota Base CLP</th>
            <th style="width: 18%; text-align: center;">Gasto Adm.</th>
            <th class="uf-col" style="width: 20%; text-align: center;">Total Cuota UF</th>
            <th class="clp-col" style="width: 20%; text-align: right;">Total Cuota CLP</th>
        `;

        const gastoAdminCLP = 3964;
        let rowsCount = 0;

        availablePlazos.forEach(plazo => {
            if (!selectedPlazos.has(plazo)) return;
            rowsCount++;

            const baseCuotaCLP = saldoCLP > 0 ? Math.round(saldoCLP / plazo) : 0;
            const totalCuotaCLP = baseCuotaCLP > 0 ? (baseCuotaCLP + gastoAdminCLP) : 0;
            const totalCuotaUF = currentUFValue > 0 && totalCuotaCLP > 0 ? (totalCuotaCLP / currentUFValue) : 0;

            bodyHTML += `
                <tr>
                    <td style="font-weight: bold; color: #333; text-align: left;">${plazo} cuotas</td>
                    <td style="text-align: center; color: #444;">${baseCuotaCLP > 0 ? formatCurrency(baseCuotaCLP) : '-'}</td>
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
    }

    headerRow.innerHTML = headerHTML;
    cuotasBody.innerHTML = bodyHTML;
}

function createAnforaCard(num, compact = false) {
    const itemWrapper = document.createElement('div');
    itemWrapper.style.display = 'flex';
    itemWrapper.style.flexDirection = 'column';
    itemWrapper.style.alignItems = 'center';
    itemWrapper.style.padding = compact ? '6px 4px' : '8px 8px';
    itemWrapper.style.border = '2px solid var(--primary-green)';
    itemWrapper.style.borderRadius = '8px';
    itemWrapper.style.backgroundColor = '#ffffff';
    itemWrapper.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.06)';
    itemWrapper.style.width = '100%';
    itemWrapper.style.boxSizing = 'border-box';

    const imgWrapper = document.createElement('div');
    imgWrapper.style.width = '100%';
    imgWrapper.style.height = compact ? '85px' : '120px';
    imgWrapper.style.display = 'flex';
    imgWrapper.style.alignItems = 'center';
    imgWrapper.style.justifyContent = 'center';

    const img = document.createElement('img');
    img.src = 'anfora.png';
    img.alt = 'Ánfora ' + num;
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    img.style.width = 'auto';
    img.style.height = 'auto';
    img.style.objectFit = 'contain';
    img.style.display = 'block';
    img.style.filter = 'drop-shadow(0 3px 5px rgba(0, 0, 0, 0.12))';

    imgWrapper.appendChild(img);
    itemWrapper.appendChild(imgWrapper);

    const label = document.createElement('span');
    label.textContent = 'Ánfora ' + num;
    label.style.fontSize = compact ? '11px' : '12px';
    label.style.fontWeight = 'bold';
    label.style.color = '#1b5e20';
    label.style.whiteSpace = 'nowrap';
    label.style.marginTop = '4px';

    itemWrapper.appendChild(label);
    return itemWrapper;
}

function renderAnforasGraphic(count) {
    const container = document.getElementById('cremacion-graphic-container');
    if (!container) return;
    container.innerHTML = '';

    const cols = count === 1 ? 1 : (count === 3 ? 3 : 2);
    const compact = count >= 3;

    const gridContainer = document.createElement('div');
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridContainer.style.gap = '10px';
    gridContainer.style.width = '100%';
    gridContainer.style.maxWidth = count === 1 ? '240px' : '100%';
    gridContainer.style.margin = '0 auto';

    for (let i = 1; i <= count; i++) {
        gridContainer.appendChild(createAnforaCard(i, compact));
    }

    container.appendChild(gridContainer);
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

    // Botones de Modalidad (UF y Pesos)
    const btnUF = document.getElementById('btn-mode-uf');
    const btnPesos = document.getElementById('btn-mode-pesos');

    function setMode(mode) {
        currentMode = mode;
        if (btnUF) btnUF.classList.toggle('active', mode === 'uf');
        if (btnPesos) btnPesos.classList.toggle('active', mode === 'pesos');

        calculateCremacion('mode-change');
    }

    if (btnUF) btnUF.addEventListener('click', () => setMode('uf'));
    if (btnPesos) btnPesos.addEventListener('click', () => setMode('pesos'));

    // Inicializar checkboxes de plazos
    updatePlazosCheckboxes();

    // Selector de Ánforas
    const anforasSelect = document.getElementById('anforas-select');
    if (anforasSelect) {
        anforasSelect.addEventListener('change', () => {
            const count = parseInt(anforasSelect.value, 10) || 1;
            renderAnforasGraphic(count);
        });
        renderAnforasGraphic(parseInt(anforasSelect.value, 10) || 1);
    }

    // Selector de tipo de producto superior para navegación
    const productSelector = document.getElementById('product-type') || document.getElementById('product-type-select');
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
            window.location.href = productPageMap[productSelector.value] || 'cremacion.html';
        });
    }

    // Event listeners de inputs
    const ufInput = document.getElementById('uf-value-input');
    if (ufInput) {
        ufInput.addEventListener('input', () => {
            const val = parseFloat(ufInput.value);
            if (!isNaN(val) && val > 0) {
                currentUFValue = val;
                calculateCremacion('uf-manual');
            }
        });
    }

    const refUfInput = document.getElementById('ref-uf-input');
    if (refUfInput) {
        refUfInput.addEventListener('input', () => calculateCremacion('ref-uf'));
        refUfInput.addEventListener('change', () => calculateCremacion('ref-uf'));
    }

    const refClpInput = document.getElementById('ref-clp-input');
    if (refClpInput) {
        refClpInput.addEventListener('input', () => calculateCremacion('ref-clp'));
        refClpInput.addEventListener('change', () => calculateCremacion('ref-clp'));
        refClpInput.addEventListener('blur', () => {
            const val = parseCLP(refClpInput.value);
            if (val > 0) setCLPValue(refClpInput, val);
        });
    }

    const descPercentEl = document.getElementById('porcentaje-descuento-main');
    if (descPercentEl) {
        descPercentEl.addEventListener('input', () => calculateCremacion('desc-percent'));
        descPercentEl.addEventListener('change', () => calculateCremacion('desc-percent'));
    }

    const descuentoUfInput = document.getElementById('descuento-uf-input');
    if (descuentoUfInput) {
        descuentoUfInput.addEventListener('input', () => calculateCremacion('desc-uf'));
        descuentoUfInput.addEventListener('change', () => calculateCremacion('desc-uf'));
    }

    const descuentoClpInput = document.getElementById('descuento-clp-input');
    if (descuentoClpInput) {
        descuentoClpInput.addEventListener('input', () => calculateCremacion('desc-clp'));
        descuentoClpInput.addEventListener('change', () => calculateCremacion('desc-clp'));
        descuentoClpInput.addEventListener('blur', () => {
            const val = parseCLP(descuentoClpInput.value);
            if (val > 0) setCLPValue(descuentoClpInput, val);
        });
    }

    const capitalAnteriorUfInput = document.getElementById('capital-anterior-uf-input');
    if (capitalAnteriorUfInput) {
        capitalAnteriorUfInput.addEventListener('input', () => calculateCremacion('cap-ant-uf'));
        capitalAnteriorUfInput.addEventListener('change', () => calculateCremacion('cap-ant-uf'));
    }

    const capitalAnteriorClpInput = document.getElementById('capital-anterior-clp-input');
    if (capitalAnteriorClpInput) {
        capitalAnteriorClpInput.addEventListener('input', () => calculateCremacion('cap-ant-clp'));
        capitalAnteriorClpInput.addEventListener('change', () => calculateCremacion('cap-ant-clp'));
        capitalAnteriorClpInput.addEventListener('blur', () => {
            const val = parseCLP(capitalAnteriorClpInput.value);
            if (val > 0) setCLPValue(capitalAnteriorClpInput, val);
        });
    }

    const valorNiUf = document.getElementById('valor-ni-uf');
    if (valorNiUf) {
        valorNiUf.addEventListener('input', () => calculateCremacion('ni-uf'));
        valorNiUf.addEventListener('change', () => calculateCremacion('ni-uf'));
    }

    const valorNiClpInput = document.getElementById('valor-ni-clp-input');
    if (valorNiClpInput) {
        valorNiClpInput.addEventListener('input', () => calculateCremacion('ni-clp'));
        valorNiClpInput.addEventListener('change', () => calculateCremacion('ni-clp'));
        valorNiClpInput.addEventListener('blur', () => {
            const val = parseCLP(valorNiClpInput.value);
            if (val > 0) setCLPValue(valorNiClpInput, val);
        });
    }

    const piePercentEl = document.getElementById('pie-percent');
    if (piePercentEl) {
        piePercentEl.addEventListener('input', () => calculateCremacion('pie-percent'));
        piePercentEl.addEventListener('change', () => calculateCremacion('pie-percent'));
    }

    const pieUfInput = document.getElementById('pie-uf');
    if (pieUfInput) {
        pieUfInput.addEventListener('input', () => calculateCremacion('pie-uf'));
        pieUfInput.addEventListener('change', () => calculateCremacion('pie-uf'));
    }

    const pieClpInput = document.getElementById('pie-clp-input');
    if (pieClpInput) {
        pieClpInput.addEventListener('input', () => calculateCremacion('pie-clp'));
        pieClpInput.addEventListener('change', () => calculateCremacion('pie-clp'));
        pieClpInput.addEventListener('blur', () => {
            const val = parseCLP(pieClpInput.value);
            if (val > 0) setCLPValue(pieClpInput, val);
        });
    }

    const saldoFinanciarUfInput = document.getElementById('saldo-financiar-uf-input');
    if (saldoFinanciarUfInput) {
        saldoFinanciarUfInput.addEventListener('input', () => calculateCremacion('saldo-uf'));
        saldoFinanciarUfInput.addEventListener('change', () => calculateCremacion('saldo-uf'));
    }

    const saldoFinanciarClpInput = document.getElementById('saldo-financiar-clp-input');
    if (saldoFinanciarClpInput) {
        saldoFinanciarClpInput.addEventListener('input', () => calculateCremacion('saldo-clp'));
        saldoFinanciarClpInput.addEventListener('change', () => calculateCremacion('saldo-clp'));
        saldoFinanciarClpInput.addEventListener('blur', () => {
            const val = parseCLP(saldoFinanciarClpInput.value);
            if (val > 0) setCLPValue(saldoFinanciarClpInput, val);
        });
    }

    fetchUFValue().then(() => {
        calculateCremacion('init');
    }).catch(() => {
        calculateCremacion('init');
    });
});
