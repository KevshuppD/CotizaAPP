const elements = {
    date: document.getElementById('current-date'),
    ufDisplay: document.getElementById('uf-value-display'),
    parkSelector: document.getElementById('parque-name'),
    parkDisplay: document.getElementById('park-name-display'),
    valorNiUf: document.getElementById('valor-ni-uf'),
    valorNiClp: document.getElementById('valor-ni-clp'),
    valorAntUf: document.getElementById('valor-ant-uf'),
    valorAntClp: document.getElementById('valor-ant-clp'),
    pieUf: document.getElementById('pie-uf'),
    pieClp: document.getElementById('pie-clp'),
    piePercent: document.getElementById('pie-percent'),
    refUfInput: document.getElementById('ref-uf-input'),
    refClpDisplay: document.getElementById('ref-clp-display'),
    rightsInput: document.getElementById('cantidad-rights'),
    sepulturaVisual: document.getElementById('sepultura-visual'),
    toggleGraphic: document.getElementById('toggle-graphic'),
    factors: {
        36: document.getElementById('factor-36'),
        48: document.getElementById('factor-48')
    },
    cuotas: {
        12: document.getElementById('cuota-12'),
        24: document.getElementById('cuota-24'),
        36: document.getElementById('cuota-36'),
        48: document.getElementById('cuota-48')
    }
};

let currentUFValue = 40013.88; // Default value

async function fetchUF() {
    try {
        const response = await fetch('https://mindicador.cl/api/uf');
        const data = await response.json();
        if (data && data.serie && data.serie[0]) {
            currentUFValue = data.serie[0].valor;
            elements.ufDisplay.textContent = '$ ' + currentUFValue.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            updateCalculations();
        }
    } catch (error) {
        console.error('Error fetching UF:', error);
        elements.ufDisplay.textContent = '$ ' + currentUFValue.toLocaleString('de-DE');
        updateCalculations();
    }
}

function formatCurrency(value) {
    return '$ ' + Math.round(value).toLocaleString('de-DE');
}

function formatUF(value) {
    return value.toLocaleString('de-DE', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).replace('.', ',');
}

function updateSepulturaVisual(count) {
    if (!elements.toggleGraphic.checked) {
        elements.sepulturaVisual.style.display = 'none';
        elements.sepulturaVisual.classList.remove('active');
        return;
    }
    
    elements.sepulturaVisual.style.display = 'flex';
    elements.sepulturaVisual.classList.add('active');
    elements.sepulturaVisual.innerHTML = '';
    
    const base = document.createElement('div');
    base.className = 'sepultura-base';
    elements.sepulturaVisual.appendChild(base);

    for (let i = 0; i < count; i++) {
        const level = document.createElement('div');
        level.className = 'sepultura-level';
        level.textContent = 'DERECHO ' + (i + 1);
        elements.sepulturaVisual.appendChild(level);
    }

    const top = document.createElement('div');
    top.className = 'sepultura-header';
    elements.sepulturaVisual.appendChild(top);
}

// Logic for Pie calculation
let isManualPie = false;

function updateCalculations(triggeredBy = '') {
    const uf = currentUFValue;
    const niUf = parseFloat(elements.valorNiUf.value) || 0;
    const antUf = parseFloat(elements.valorAntUf.value) || 0;
    const rights = parseInt(elements.rightsInput.value) || 1;
    const refUf = parseFloat(elements.refUfInput.value) || 0;

    // Update Park Display
    elements.parkDisplay.textContent = 'PARQUE ' + elements.parkSelector.value;

    // Handle Pie logic
    if (triggeredBy === 'percent' || (triggeredBy !== 'pie' && !isManualPie)) {
        const percent = parseFloat(elements.piePercent.value) || 0;
        const newPieUf = (antUf * percent) / 100;
        elements.pieUf.value = newPieUf.toFixed(2);
        isManualPie = false;
    } else if (triggeredBy === 'pie') {
        isManualPie = true;
        const pieUf = parseFloat(elements.pieUf.value) || 0;
        if (antUf > 0) {
            elements.piePercent.value = ((pieUf / antUf) * 100).toFixed(0);
        }
    }

    const pieUfVal = parseFloat(elements.pieUf.value) || 0;

    // Visuals
    updateSepulturaVisual(rights);
    elements.refClpDisplay.textContent = formatCurrency(refUf * uf);

    // Basic CLP conversions
    elements.valorNiClp.textContent = formatCurrency(niUf * uf);
    elements.valorAntClp.textContent = formatCurrency(antUf * uf);
    elements.pieClp.textContent = formatCurrency(pieUfVal * uf);

    const balanceUf = antUf - pieUfVal;
    const balanceClp = (antUf * uf) - (pieUfVal * uf);

    const cuota12 = (balanceClp / 12) + 1400;
    const cuota24 = (balanceClp / 24) + 1400;
    
    elements.cuotas[12].textContent = formatCurrency(cuota12);
    elements.cuotas[24].textContent = formatCurrency(cuota24);

    const factor36 = (balanceUf / 36) + 0.04;
    const factor48 = (balanceUf / 48) + 0.04;

    elements.factors[36].textContent = formatUF(factor36);
    elements.factors[48].textContent = formatUF(factor48);

    elements.cuotas[36].textContent = formatCurrency(factor36 * uf);
    elements.cuotas[48].textContent = formatCurrency(factor48 * uf);
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
    elements.valorAntUf.addEventListener('input', () => updateCalculations('ant'));
    elements.pieUf.addEventListener('input', () => updateCalculations('pie'));
    elements.piePercent.addEventListener('input', () => updateCalculations('percent'));
    elements.rightsInput.addEventListener('input', () => updateCalculations('rights'));
    elements.refUfInput.addEventListener('input', () => updateCalculations('ref'));
    elements.parkSelector.addEventListener('change', () => updateCalculations('park'));
    elements.toggleGraphic.addEventListener('change', toggleGraphic);

    fetchUF();
});

async function exportAsImage() {
    const captureArea = document.getElementById('capture-area');
    // Ensure all styles are loaded
    const canvas = await html2canvas(captureArea, {
        scale: 2, // Better quality
        useCORS: true,
        backgroundColor: "#ffffff"
    });
    const link = document.createElement('a');
    link.download = `Cotizacion-${new Date().getTime()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

async function shareAsImage() {
    const captureArea = document.getElementById('capture-area');
    const canvas = await html2canvas(captureArea, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
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
                console.error("Error sharing:", err);
            }
        } else {
            alert('Navegador no compatible con compartir.');
        }
    }, 'image/png');
}
