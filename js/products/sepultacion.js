// js/products/sepultacion.js - Lógica Financiera de Sepultación Anticipada

function calculateSepultacionPromo(rights, uf) {
    const valoresPromocionalesCLP = {
        1: 583264,
        2: 972106,
        3: 1263738,
        4: 1458159
    };
    const promoClp = valoresPromocionalesCLP[rights] || (583264 * rights);
    const promoUf = uf > 0 ? (promoClp / uf) : 0;
    return { promoClp, promoUf };
}

function calculateSepultacionCuotas(balanceUf, uf, hasPromoVal) {
    let factor12 = 0, factor24 = 0, factor36 = 0, factor48 = 0;

    if (hasPromoVal) {
        factor12 = (balanceUf * (1 / 12)) + 0.04;
        factor24 = (balanceUf * 0.04466) + 0.04;
        factor36 = (balanceUf * 0.03076) + 0.04;
        factor48 = (balanceUf * 0.02383) + 0.04;
    }

    const cuota12 = factor12 * uf;
    const cuota24 = factor24 * uf;
    const cuota36 = factor36 * uf;
    const cuota48 = factor48 * uf;

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
