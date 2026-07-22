// js/products/cremacion.js - Lógica Financiera de Cremación Anticipada

function calculateCremacionPreset(rights, uf) {
    const valoresCremacionCLP = {
        1: 1102806,
        2: 1699143,
        3: 2287308,
        4: 2679418
    };
    const promoClp = valoresCremacionCLP[rights] || (1102806 * rights);
    const promoUf = uf > 0 ? (promoClp / uf) : 0;
    
    const precioListaSinIva = Math.round(promoClp / 1.19);
    const pieCapitalSinIva = Math.round(precioListaSinIva * 0.10);
    const montoFinanciarClp = precioListaSinIva - pieCapitalSinIva;
    const montoFinanciarUf = uf > 0 ? (montoFinanciarClp / uf) : 0;

    const pieTotalClp = Math.round(promoClp * 0.10);
    const pieTotalUf = uf > 0 ? (pieTotalClp / uf) : 0;

    return { 
        promoClp, 
        promoUf, 
        montoFinanciarClp, 
        montoFinanciarUf,
        pieTotalClp,
        pieTotalUf
    };
}

function calculateCremacionCuotas(montoFinanciarClp, promoClp, pieTotalClp, uf, hasPromoVal) {
    let factor12 = 0, factor24 = 0, factor36 = 0, factor48 = 0;
    let cuota12 = 0, cuota24 = 0, cuota36 = 0, cuota48 = 0;

    const adicionClp = 3500 + 1750; // GA ($3.500) + Seguro ($1.750) = $5.250

    if (hasPromoVal) {
        const saldoFinanciarConIva = (promoClp > 0 && pieTotalClp > 0) ? (promoClp - pieTotalClp) : (montoFinanciarClp * 1.19);

        cuota12 = Math.round((saldoFinanciarConIva / 12) + adicionClp);
        cuota24 = Math.round((saldoFinanciarConIva / 24) + adicionClp);
        cuota36 = Math.round((saldoFinanciarConIva / 36) + adicionClp);
        cuota48 = Math.round((saldoFinanciarConIva / 48) + adicionClp);

        factor12 = uf > 0 ? (cuota12 / uf) : 0;
        factor24 = uf > 0 ? (cuota24 / uf) : 0;
        factor36 = uf > 0 ? (cuota36 / uf) : 0;
        factor48 = uf > 0 ? (cuota48 / uf) : 0;
    }

    return {
        factor12, factor24, factor36, factor48,
        cuota12, cuota24, cuota36, cuota48,
        notes: {
            12: '',
            24: '',
            36: '',
            48: ''
        }
    };
}
