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
    valorAntUf: document.getElementById('valor-ant-uf'),
    valorAntClp: document.getElementById('valor-ant-clp'),
    pieUf: document.getElementById('pie-uf'),
    pieClp: document.getElementById('pie-clp'),
    piePercent: document.getElementById('pie-percent'),
    refUfInput: document.getElementById('ref-uf-input'),
    refClpDisplay: document.getElementById('ref-clp-display'),
    refValueContainer: document.getElementById('ref-value-container'),
    refLabel: document.getElementById('ref-label'),
    serviceImageContainer: document.getElementById('service-image-container'),
    rightsInput: document.getElementById('cantidad-rights'),
    visualGraphic: document.getElementById('visual-graphic'),
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
    },
    adjustments: {
        12: document.getElementById('adj-12'),
        24: document.getElementById('adj-24'),
        36: document.getElementById('adj-36'),
        48: document.getElementById('adj-48')
    }
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

function updateVisualGraphic(count, type) {
    if (!elements.toggleGraphic.checked) {
        elements.visualGraphic.style.display = 'none';
        elements.visualGraphic.classList.remove('active');
        return;
    }
    
    elements.visualGraphic.style.display = 'flex';
    elements.visualGraphic.classList.add('active');
    elements.visualGraphic.innerHTML = '';
    
    if (type === 'sepultacion') {
        const base = document.createElement('div');
        base.className = 'sepultura-base';
        elements.visualGraphic.appendChild(base);

        for (let i = 0; i < count; i++) {
            const level = document.createElement('div');
            level.className = 'sepultura-level';
            level.textContent = 'DERECHO ' + (i + 1);
            elements.visualGraphic.appendChild(level);
        }

        const top = document.createElement('div');
        top.className = 'sepultura-header';
        elements.visualGraphic.appendChild(top);
    } else {
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
    }
}

// Logic for Pie calculation
let isManualPie = false;

function updateCalculations(triggeredBy = '') {
    const uf = currentUFValue;
    const type = elements.productType.value;
    const niUf = parseFloat(elements.valorNiUf.value) || 0;
    const antUf = parseFloat(elements.valorAntUf.value) || 0;
    const rights = parseInt(elements.rightsInput.value) || 1;
    const refUf = parseFloat(elements.refUfInput.value) || 0;

    // Update Titles and Visibility
    if (type === 'cremacion') {
        elements.mainTitle.textContent = 'Cremación Anticipada';
        elements.refValueContainer.style.display = 'none';
        elements.serviceImageContainer.style.display = 'block';
        elements.refLabel.textContent = 'Capacidad de la solución';
        
        // Cremation: No specific park, always "Nuestros Parques"
        elements.parkSelector.disabled = true;
        elements.parkSelector.style.display = 'none';
        elements.parkStaticValue.style.display = 'inline';
        elements.parkStaticValue.textContent = 'Nuestros Parques';
        elements.parkLabel.textContent = 'Nuestros Parques';
        elements.parkDisplay.textContent = 'NUESTROS PARQUES';
        elements.capacityUnit.textContent = 'Anforas';
    } else {
        elements.mainTitle.textContent = 'Cotización Derecho de Sepultación Anticipada';
        elements.refValueContainer.style.display = 'block';
        elements.serviceImageContainer.style.display = 'none';
        elements.refLabel.textContent = 'Valor referencia por 1 derecho';
        
        // Sepultación: Enable park selector
        elements.parkSelector.disabled = false;
        elements.parkSelector.style.display = '';
        elements.parkStaticValue.style.display = 'none';
        elements.parkLabel.textContent = 'Parque';
        elements.parkDisplay.textContent = 'PARQUE ' + elements.parkSelector.value;
        elements.capacityUnit.textContent = 'derechos';
    }

    // Handle Pie logic
    if (triggeredBy === 'percent' || (triggeredBy !== 'pie' && !isManualPie)) {
        const percent = parseFloat(elements.piePercent.value) || 0;
        const newPieUf = (antUf * percent) / 100;
        elements.pieUf.value = newPieUf.toFixed(2);
        isManualPie = false;
    } else if (triggeredBy === 'pie') {
        isManualPie = true;
        const pieUfVal = parseFloat(elements.pieUf.value) || 0;
        if (antUf > 0) {
            elements.piePercent.value = ((pieUfVal / antUf) * 100).toFixed(0);
        }
    }

    const pieUfVal = parseFloat(elements.pieUf.value) || 0;

    // Visuals
    updateVisualGraphic(rights, type);
    elements.refClpDisplay.textContent = formatCurrency(refUf * uf);

    // Basic CLP conversions
    elements.valorNiClp.textContent = formatCurrency(niUf * uf);
    elements.valorAntClp.textContent = formatCurrency(antUf * uf);
    elements.pieClp.textContent = formatCurrency(pieUfVal * uf);

    const balanceUf = antUf - pieUfVal;
    const balanceClp = (antUf * uf) - (pieUfVal * uf);

    // Product specific factors
    let adminFee = 1400; // default for sepultacion
    let factor36_extra = 0.04;
    let factor48_extra = 0.04;

    if (type === 'cremacion') {
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
    elements.valorAntUf.addEventListener('input', () => updateCalculations('ant'));
    elements.pieUf.addEventListener('input', () => updateCalculations('pie'));
    elements.piePercent.addEventListener('input', () => updateCalculations('percent'));
    elements.rightsInput.addEventListener('input', () => updateCalculations('rights'));
    elements.refUfInput.addEventListener('input', () => updateCalculations('ref'));
    elements.parkSelector.addEventListener('change', () => updateCalculations('park'));
    elements.productType.addEventListener('change', () => updateCalculations('product'));
    elements.toggleGraphic.addEventListener('change', toggleGraphic);

    fetchUF();
});

async function captureWithoutPiePercent() {
    const captureArea = document.getElementById('capture-area');
    const piePercentRow = document.getElementById('pie-percent-row');
    const adjNotes = Array.from(captureArea.querySelectorAll('.small-note'));
    const originalPieDisplay = piePercentRow.style.display;
    const originalAdjDisplays = adjNotes.map(el => el.style.display);

    piePercentRow.style.display = 'none';
    adjNotes.forEach(el => el.style.display = 'none');

    const canvas = await html2canvas(captureArea, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
    });

    piePercentRow.style.display = originalPieDisplay;
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
