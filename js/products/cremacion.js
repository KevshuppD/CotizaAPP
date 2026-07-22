// js/products/cremacion.js - Lógica Financiera de Cremación Anticipada

function calculateCremacionPreset(rights, uf) {
    const valoresCremacion = {
        1: 27,
        2: 41.59,
        3: 55.98,
        4: 65.59
    };
    const promoUf = valoresCremacion[rights] || 27;
    const promoClp = Math.round(promoUf * uf);
    return { promoUf, promoClp };
}

function calculateCremacionCuotas(balanceUf, uf, hasPromoVal) {
    let factor12 = 0, factor24 = 0, factor36 = 0, factor48 = 0;
    let cuota12 = 0, cuota24 = 0, cuota36 = 0, cuota48 = 0;

    const gaClp = 3500;
    const seguroClp = 1750;
    const adicionClp = gaClp + seguroClp; // 5.250 $

    if (hasPromoVal) {
        const balanceClp = balanceUf * uf;
        
        // 12 y 24 cuotas en pesos con GA ($3.500) y Seguro ($1.750)
        cuota12 = (balanceClp / 12) + adicionClp;
        cuota24 = (balanceClp / 24) + adicionClp;
        
        factor12 = uf > 0 ? (cuota12 / uf) : 0;
        factor24 = uf > 0 ? (cuota24 / uf) : 0;

        // 36 y 48 cuotas en UF con GA (0.10 UF) y Seguro (0.05 UF)
        factor36 = (balanceUf / 36) + 0.10 + 0.05;
        factor48 = (balanceUf / 48) + 0.10 + 0.05;

        cuota36 = factor36 * uf;
        cuota48 = factor48 * uf;
    }

    return {
        factor12, factor24, factor36, factor48,
        cuota12, cuota24, cuota36, cuota48,
        notes: {
            12: `Incluye GA (3.500 $) + Seguro (1.750 $)`,
            24: `Incluye GA (3.500 $) + Seguro (1.750 $)`,
            36: `Incluye GA (0,10 UF) + Seguro (0,05 UF)`,
            48: `Incluye GA (0,10 UF) + Seguro (0,05 UF)`
        }
    };
}
