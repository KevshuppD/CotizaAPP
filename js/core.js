// js/core.js - Estado Global, Elementos DOM y Helpers de Formato

let currentUFValue = 40844.79; // Valor UF actual por defecto

const elements = {};

function initDOMElements() {
    elements.productType = document.getElementById('product-type') || document.getElementById('product-type-select');
    elements.parkSelector = document.getElementById('parque-name') || document.getElementById('parque-selector');
    elements.parkStaticValue = document.getElementById('parque-static-value');
    elements.parkLabel = document.getElementById('parque-label');
    elements.parkDisplay = document.getElementById('park-name-display') || document.getElementById('park-display');
    elements.rightsInput = document.getElementById('cantidad-rights');
    elements.reduccionesInput = document.getElementById('cantidad-reducciones');
    elements.reduccionesContainer = document.getElementById('reducciones-container');
    elements.capacityUnit = document.getElementById('capacity-unit');
    elements.mainTitle = document.getElementById('main-title');
    elements.date = document.getElementById('current-date');
    elements.ufInput = document.getElementById('uf-value-input');
    elements.refClpDisplay = document.getElementById('ref-clp-display');
    elements.refUfDisplay = document.getElementById('ref-uf-display');
    elements.refUfInput = document.getElementById('ref-uf-input');
    elements.refClpInput = document.getElementById('ref-clp-input');
    elements.refLabel = document.getElementById('ref-label');
    elements.refValueContainer = document.getElementById('ref-value-container');
    elements.sepultacionFields = document.getElementById('sepultacion-fields');
    elements.descuentoRowMain = document.getElementById('discount-row-main');
    elements.mantencionFields = document.getElementById('mantencion-fields');
    elements.sepulturaLiberadorFields = document.getElementById('sepultura-liberador-fields');
    elements.valorNiUf = document.getElementById('valor-ni-uf');
    elements.valorNiClpInput = document.getElementById('valor-ni-clp-input');
    elements.valorAntUf = document.getElementById('valor-ant-uf');
    elements.valorAntClpInput = document.getElementById('valor-ant-clp-input');
    elements.pieUf = document.getElementById('pie-uf');
    elements.pieClpInput = document.getElementById('pie-clp-input');
    elements.piePercent = document.getElementById('pie-percent');
    elements.piePercentRow = document.getElementById('pie-percent-row');
    elements.sepultacionOutput = document.getElementById('sepultacion-output');
    elements.mantencionOutput = document.getElementById('mantencion-output');
    elements.sepulturaLiberadorOutput = document.getElementById('sepultura-liberador-output');
    elements.mantencionResumen = document.getElementById('mantencion-resumen');
    elements.mantencionCuotasBody = document.getElementById('mantencion-cuotas-body');
    elements.sepulturaLiberadorResumen = document.getElementById('sepultura-liberador-resumen');
    elements.sepulturaLiberadorCuotasBody = document.getElementById('sepultura-liberador-cuotas-body');
    elements.serviceImageContainer = document.getElementById('service-image-container');
    elements.mainCuotasTable = document.getElementById('main-cuotas-table');
    elements.sepultacionGraphicContainer = document.getElementById('sepultacion-graphic-container');
    elements.liberadorGraphicContainer = document.getElementById('liberador-graphic-container');
    elements.valorPlanUf = document.getElementById('valor-plan-uf');
    elements.descuentoPorcentaje = document.getElementById('descuento-porcentaje');
    elements.visualGraphic = document.getElementById('visual-graphic');
    elements.toggleGraphic = document.getElementById('toggle-graphic');
    elements.tipoDescuentoMain = document.getElementById('tipo-descuento-main');
    elements.porcentajeDescuentoMain = document.getElementById('porcentaje-descuento-main');
    elements.labelValorNi = document.getElementById('label-valor-ni');
    elements.labelDescuento = document.getElementById('label-descuento');
    elements.labelDescuentoUf = document.getElementById('label-descuento-uf');
    elements.labelDescuentoOutput = document.getElementById('label-descuento-output');
    elements.labelValorAnt = document.getElementById('label-valor-ant');
    elements.labelPie = document.getElementById('label-pie');
    elements.labelPiePercent = document.getElementById('label-pie-percent');
    elements.saldoFinanciarRow = document.getElementById('saldo-financiar-row');
    elements.saldoFinanciarUfInput = document.getElementById('saldo-financiar-uf-input');
    elements.saldoFinanciarClpInput = document.getElementById('saldo-financiar-clp-input');
    elements.saldoFinanciarUf = document.getElementById('saldo-financiar-uf');
    elements.saldoFinanciarClp = document.getElementById('saldo-financiar-clp');
    elements.factors = {
        12: document.getElementById('factor-12'),
        24: document.getElementById('factor-24'),
        36: document.getElementById('factor-36'),
        48: document.getElementById('factor-48')
    };
    elements.cuotas = {
        12: document.getElementById('cuota-12'),
        24: document.getElementById('cuota-24'),
        36: document.getElementById('cuota-36'),
        48: document.getElementById('cuota-48')
    };
    elements.adjustments = {
        12: document.getElementById('adj-12'),
        24: document.getElementById('adj-24'),
        36: document.getElementById('adj-36'),
        48: document.getElementById('adj-48')
    };
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDOMElements);
} else {
    initDOMElements();
}

function formatCurrency(value) {
    if (value === '' || value === null || value === undefined || isNaN(value)) return '$0';
    return '$' + Math.round(parseFloat(value)).toLocaleString('de-DE');
}

function parseCLP(val) {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (!val) return 0;
    const digits = val.toString().replace(/[^0-9]/g, '');
    return digits ? parseInt(digits, 10) : 0;
}

function setCLPValue(element, val) {
    if (!element) return;
    if (val === '' || val === null || val === undefined || isNaN(val)) {
        element.value = '';
    } else {
        element.value = formatCurrency(val);
    }
}

function formatUF(value) {
    return value.toLocaleString('de-DE', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).replace('.', ',');
}

function fetchUFValue() {
    initDOMElements();
    fetch("https://findic.cl/api/")
    .then((response) => {
        if (!response.ok) throw new Error("Respuesta no OK de findic.cl");
        return response.json();
    })
    .then((data) => {
        if (data && data.uf && data.uf.valor) {
            currentUFValue = parseFloat(data.uf.valor);
            if (elements.ufInput) elements.ufInput.value = currentUFValue.toFixed(2);
            if (typeof updateCalculations === 'function') updateCalculations('uf-manual');
        }
    })
    .catch((err) => {
        console.warn('Error al consultar findic.cl:', err);
        if (elements.ufInput) elements.ufInput.value = currentUFValue.toFixed(2);
        if (typeof updateCalculations === 'function') updateCalculations('uf-manual');
    });
}
