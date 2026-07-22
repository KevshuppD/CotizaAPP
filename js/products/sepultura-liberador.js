// js/products/sepultura-liberador.js - Lógica Financiera de Sepultura con Beneficios (Liberador)

function calculateSepulturaLiberador() {
    const parque = elements.parkSelector ? elements.parkSelector.value : '';
    const isPrado = parque.toUpperCase().includes('PRADO');
    
    // 1. Leer Valor Real (editable en ref-uf-input)
    const valorRealUF = parseFloat(elements.refUfInput ? elements.refUfInput.value : '') || 0;
    const valorRealCLP = valorRealUF * currentUFValue;
    
    if (elements.refClpInput && document.activeElement !== elements.refClpInput) {
        setCLPValue(elements.refClpInput, Math.round(valorRealCLP));
    }

    // 2. Descuento (%) - editable, default 20%
    const descPercentEl = document.getElementById('porcentaje-descuento-main');
    const descPercent = descPercentEl ? (parseFloat(descPercentEl.value) || 0) : 20;
    const descuentoUF = valorRealUF * (descPercent / 100);
    const descuentoCLP = valorRealCLP * (descPercent / 100);

    const descOutput = document.getElementById('label-descuento-output');
    if (descOutput) {
        descOutput.textContent = `${descuentoUF.toFixed(2).replace('.', ',')} UF (${formatCurrency(Math.round(descuentoCLP))})`;
    }

    // 3. Valor Promocional
    const valorPromoUF = valorRealUF - descuentoUF;
    const valorPromoCLP = valorRealCLP - descuentoCLP;

    const valorNiUfDisplay = document.getElementById('valor-ni-uf');
    if (valorNiUfDisplay) {
        valorNiUfDisplay.textContent = `${valorPromoUF.toFixed(2).replace('.', ',')} UF`;
    }
    if (elements.valorNiClpInput && document.activeElement !== elements.valorNiClpInput) {
        setCLPValue(elements.valorNiClpInput, Math.round(valorPromoCLP));
    }

    // 4. Pie (%) - default 5% for Prado, 10% for others (editable)
    const piePercentEl = document.getElementById('pie-percent');
    const piePercent = piePercentEl ? (parseFloat(piePercentEl.value) || 0) : (isPrado ? 5 : 10);
    
    const pieUF = valorRealUF * (piePercent / 100);
    const pieCLP = valorRealCLP * (piePercent / 100);

    if (elements.pieUf) {
        elements.pieUf.value = pieUF.toFixed(2);
    }
    if (elements.pieClpInput && document.activeElement !== elements.pieClpInput) {
        setCLPValue(elements.pieClpInput, Math.round(pieCLP));
    }

    // 5. Saldo a Financiar (Valor Real - Descuento - Pie)
    const saldoUF = valorRealUF - descuentoUF - pieUF;
    const saldoCLP = valorRealCLP - descuentoCLP - pieCLP;

    if (elements.saldoFinanciarUfInput && document.activeElement !== elements.saldoFinanciarUfInput) {
        elements.saldoFinanciarUfInput.value = saldoUF.toFixed(2);
    }
    if (elements.saldoFinanciarClpInput && document.activeElement !== elements.saldoFinanciarClpInput) {
        setCLPValue(elements.saldoFinanciarClpInput, Math.round(saldoCLP));
    }

    // 6. Generar Cuotas (12 a 108 cuotas para todos los parques)
    const plazos = [12, 24, 36, 48, 60, 72, 84, 96, 108];

    let tablaCuotasHTML = '';
    plazos.forEach(plazo => {
        let valorCuotaUF = 0;
        let seguroUF = 0;
        let gastoAdminUF = 0;
        let totalCuotaUF = 0;
        let totalCuotaCLP = 0;

        const tasasStandard = {
            60: 0.0197,
            72: 0.01693,
            84: 0.01495,
            96: 0.01348,
            108: isPrado ? 0.01238 : 0.01235
        };

        // Base cuota
        if (plazo <= 48) {
            valorCuotaUF = saldoUF / plazo;
        } else {
            const tasa = tasasStandard[plazo] || 0;
            valorCuotaUF = saldoUF * tasa;
            if (plazo === 108 && !isPrado) {
                valorCuotaUF += 0.003;
            }
        }

        if (isPrado) {
            if (plazo < 36) {
                // Sumar $5.250 en pesos ( GA $3500 + Seguro $1750 )
                const baseCLP = saldoCLP / plazo;
                const seguroCLP = 1750;
                const gaCLP = 3500;
                totalCuotaCLP = Math.round(baseCLP + seguroCLP + gaCLP);
                totalCuotaUF = totalCuotaCLP / currentUFValue;
                
                valorCuotaUF = baseCLP / currentUFValue;
                seguroUF = seguroCLP / currentUFValue;
                gastoAdminUF = gaCLP / currentUFValue;
            } else {
                // Sumar 0.15 UF en UF ( GA 0.10 + Seguro 0.05 )
                seguroUF = 0.05;
                gastoAdminUF = 0.10;
                totalCuotaUF = valorCuotaUF + seguroUF + gastoAdminUF;
                totalCuotaCLP = Math.round(totalCuotaUF * currentUFValue);
            }
        } else {
            // Estándar para otros parques
            seguroUF = (saldoUF > 0 && plazo > 0) ? (0.0016 * saldoUF) : 0;
            gastoAdminUF = 0.02;
            totalCuotaUF = valorCuotaUF + seguroUF + gastoAdminUF;
            totalCuotaCLP = Math.round(totalCuotaUF * currentUFValue);
        }

        tablaCuotasHTML += `
            <tr>
                <td style="font-weight: bold;">${plazo} cuotas</td>
                <td>${valorCuotaUF.toFixed(4).replace('.', ',')}</td>
                <td>${seguroUF.toFixed(4).replace('.', ',')}</td>
                <td>${gastoAdminUF.toFixed(4).replace('.', ',')}</td>
                <td style="font-weight: bold;">${totalCuotaUF.toFixed(4).replace('.', ',')}</td>
                <td style="font-weight: bold; font-size: 15px; color: var(--primary-green);">${formatCurrency(totalCuotaCLP)}</td>
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
