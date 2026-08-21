// js/core.js - Estado Global, Elementos DOM y Helpers de Formato

let currentUFValue = 40844.79; // Valor UF actual por defecto
let pendingExportAction = null;

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
    elements.capacidadReduccionesSelect = document.getElementById('capacidad-reducciones-select');
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
    return fetch("https://findic.cl/api/")
    .then((response) => {
        if (!response.ok) throw new Error("Respuesta no OK de findic.cl");
        return response.json();
    })
    .then((data) => {
        if (data && data.uf && data.uf.valor) {
            currentUFValue = parseFloat(data.uf.valor);
            if (elements.ufInput) elements.ufInput.value = currentUFValue.toFixed(2);
        }
    })
    .catch((err) => {
        console.warn('Error al consultar findic.cl:', err);
        if (elements.ufInput) elements.ufInput.value = currentUFValue.toFixed(2);
    });
}

function getCaptureOptions() {
    return {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        ignoreElements: function(element) {
            return element.classList && element.classList.contains('no-export');
        },
        onclone: function(clonedDoc) {
            // Reemplazar todos los inputs y selects por spans estáticos en el DOM clonado
            const inputsAndSelects = clonedDoc.querySelectorAll('#capture-area input, #capture-area select');
            inputsAndSelects.forEach(el => {
                if (el.closest('.no-export')) return;
                if (el.tagName === 'INPUT' && (el.type === 'hidden' || el.type === 'submit' || el.type === 'button')) return;
                if (el.tagName === 'INPUT' && (el.type === 'checkbox' || el.type === 'radio')) return;
                
                // Si está oculto, ignorar
                if (window.getComputedStyle(el).display === 'none') {
                    return;
                }

                let valText = '';
                if (el.tagName === 'SELECT') {
                    if (el.selectedIndex >= 0) {
                        valText = el.options[el.selectedIndex].text;
                    }
                } else {
                    valText = el.value || '';
                }

                const span = clonedDoc.createElement('span');
                span.textContent = valText;

                // Copiar estilos clave para mantener la apariencia y alineación
                const computedStyle = window.getComputedStyle(el);
                span.style.fontWeight = 'bold';
                span.style.color = '#111';
                span.style.fontFamily = computedStyle.fontFamily || 'inherit';
                span.style.fontSize = computedStyle.fontSize || '11px';
                
                if (el.tagName === 'INPUT') {
                    span.style.whiteSpace = 'nowrap';
                } else {
                    span.style.whiteSpace = 'normal';
                }

                if (el.classList.contains('editable-field') || el.classList.contains('input-inline')) {
                    span.style.padding = '2px 4px';
                }

                el.style.display = 'none';
                el.parentNode.insertBefore(span, el);
            });

            // 3. Reemplazar beneficios-text con div estático en el clon
            const beneficiosEl = clonedDoc.getElementById('beneficios-text');
            if (beneficiosEl) {
                let text = '';
                if (beneficiosEl.tagName === 'TEXTAREA' || beneficiosEl.tagName === 'INPUT') {
                    text = beneficiosEl.value;
                } else {
                    text = beneficiosEl.innerText || beneficiosEl.textContent || '';
                }

                const tempDiv = clonedDoc.createElement('div');
                tempDiv.className = 'editable-textarea-mimic';
                tempDiv.style.whiteSpace = 'pre-wrap';
                tempDiv.style.wordBreak = 'break-word';
                tempDiv.style.textAlign = 'left';
                tempDiv.style.background = '#ffffff';
                tempDiv.style.border = '1px solid #ccc';
                tempDiv.style.padding = '8px';
                tempDiv.style.minHeight = '80px';
                tempDiv.style.fontSize = '12px';
                tempDiv.style.fontFamily = 'inherit';
                tempDiv.style.borderRadius = '4px';
                tempDiv.style.boxSizing = 'border-box';
                tempDiv.style.width = '100%';
                tempDiv.style.color = '#333';
                tempDiv.textContent = text.trim();

                beneficiosEl.parentNode.insertBefore(tempDiv, beneficiosEl);
                beneficiosEl.style.display = 'none';
            }
        }
    };
}

function showToast(message, duration = 4000) {
    let toast = document.getElementById('cotizaapp-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cotizaapp-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Modal de Selección de Orientación (Horizontal vs Vertical)
function ensureOrientationModal() {
    let modal = document.getElementById('orientation-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'orientation-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card">
                <div class="modal-header">
                    <h3>Seleccionar Orientación</h3>
                    <button class="modal-close-btn" onclick="closeOrientationModal()">&times;</button>
                </div>
                <p class="modal-subtitle">Elige el formato en que deseas generar la cotización:</p>
                <div class="orientation-options">
                    <button class="orientation-opt-btn" onclick="executeOrientation('vertical')">
                        <div class="orientation-opt-icon">📱</div>
                        <div class="orientation-opt-text">
                            <span class="orientation-opt-title">Vertical (Retrato)</span>
                            <span class="orientation-opt-desc">Ideal para celulares, WhatsApp y lectura vertical</span>
                        </div>
                    </button>
                    <button class="orientation-opt-btn" onclick="executeOrientation('horizontal')">
                        <div class="orientation-opt-icon">🖥️</div>
                        <div class="orientation-opt-text">
                            <span class="orientation-opt-title">Horizontal (Apaisado)</span>
                            <span class="orientation-opt-desc">Formato panorámico estándar de escritorio</span>
                        </div>
                    </button>
                </div>
            </div>
        `;
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeOrientationModal();
        });
        document.body.appendChild(modal);
    }
    return modal;
}

function openOrientationModal(action) {
    pendingExportAction = action;
    const modal = ensureOrientationModal();
    modal.classList.add('active');
}

function closeOrientationModal() {
    const modal = document.getElementById('orientation-modal');
    if (modal) modal.classList.remove('active');
    pendingExportAction = null;
}

function executeOrientation(orientation) {
    const action = pendingExportAction;
    closeOrientationModal();

    if (!action) return;

    if (action === 'exportImage') {
        doExportAsImage(orientation);
    } else if (action === 'shareImage') {
        doShareAsImage(orientation);
    } else if (action === 'sharePDF') {
        doShareAsPDF(orientation);
    }
}

// Botones disparadores que abren el modal
function exportAsImage() {
    openOrientationModal('exportImage');
}

function shareAsImage() {
    openOrientationModal('shareImage');
}

function shareAsPDF() {
    openOrientationModal('sharePDF');
}

// Ejecución con la orientación seleccionada
function doExportAsImage(orientation) {
    const captureArea = document.getElementById('capture-area');
    if (!captureArea) return;

    if (typeof html2canvas === 'undefined') {
        alert('Error: html2canvas no está disponible.');
        return;
    }

    captureArea.classList.remove('export-horizontal', 'export-vertical');
    captureArea.classList.add(orientation === 'vertical' ? 'export-vertical' : 'export-horizontal');

    // Esperar un frame para que el reflow aplique el estilo antes de capturar
    requestAnimationFrame(() => {
        html2canvas(captureArea, getCaptureOptions()).then(canvas => {
            captureArea.classList.remove('export-horizontal', 'export-vertical');

            const link = document.createElement('a');
            const parkSelector = document.getElementById('parque-name') || document.getElementById('parque-select') || document.getElementById('parque-selector');
            const parkName = (parkSelector ? parkSelector.value : (elements.parkSelector ? elements.parkSelector.value : 'parque')).toLowerCase().replace(/\s+/g, '-');
            const now = new Date().toISOString().slice(0, 10);
            link.download = `cotizacion-${parkName}-${orientation}-${now}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            showToast(`¡Imagen ${orientation === 'vertical' ? 'vertical' : 'horizontal'} descargada exitosamente!`);
        }).catch(err => {
            captureArea.classList.remove('export-horizontal', 'export-vertical');
            console.error('Error al exportar imagen:', err);
            alert('Ocurrió un error al generar la imagen.');
        });
    });
}

async function doShareAsImage(orientation) {
    const captureArea = document.getElementById('capture-area');
    if (!captureArea) return;

    if (typeof html2canvas === 'undefined') {
        alert('Error: html2canvas no está disponible.');
        return;
    }

    captureArea.classList.remove('export-horizontal', 'export-vertical');
    captureArea.classList.add(orientation === 'vertical' ? 'export-vertical' : 'export-horizontal');

    requestAnimationFrame(async () => {
        try {
            const canvas = await html2canvas(captureArea, getCaptureOptions());
            captureArea.classList.remove('export-horizontal', 'export-vertical');

            canvas.toBlob(async blob => {
                if (!blob) {
                    alert('No se pudo generar la imagen para compartir.');
                    return;
                }

                const parkSelector = document.getElementById('parque-name') || document.getElementById('parque-select') || document.getElementById('parque-selector');
                const parkName = (parkSelector ? parkSelector.value : (elements.parkSelector ? elements.parkSelector.value : 'parque')).toLowerCase().replace(/\s+/g, '-');
                const now = new Date().toISOString().slice(0, 10);
                const fileName = `cotizacion-${parkName}-${orientation}-${now}.png`;
                const file = new File([blob], fileName, { type: 'image/png' });

                // 1. Si el navegador soporta compartir archivos (móviles / macOS)
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            title: 'Cotización Parque',
                            files: [file]
                        });
                        return;
                    } catch (shareErr) {
                        if (shareErr.name === 'AbortError') return;
                    }
                }

                // 2. En escritorio: Copiar directo al portapapeles
                let copied = false;
                if (navigator.clipboard && window.ClipboardItem) {
                    try {
                        await navigator.clipboard.write([
                            new ClipboardItem({ 'image/png': blob })
                        ]);
                        copied = true;
                    } catch (clipErr) {
                        console.warn('No se pudo escribir imagen al portapapeles:', clipErr);
                    }
                }

                // Descargar como respaldo
                const link = document.createElement('a');
                link.download = fileName;
                link.href = URL.createObjectURL(blob);
                link.click();

                if (copied) {
                    showToast('¡Imagen copiada al portapapeles y descargada! Puedes pegarla con Ctrl+V en WhatsApp o correo.');
                } else {
                    showToast('¡Imagen descargada exitosamente!');
                }
            }, 'image/png');
        } catch (err) {
            captureArea.classList.remove('export-horizontal', 'export-vertical');
            console.error('Error al capturar para compartir:', err);
            alert('Ocurrió un error al preparar la imagen para compartir.');
        }
    });
}

function doShareAsPDF(orientation) {
    const captureArea = document.getElementById('capture-area');
    if (!captureArea) return;

    if (typeof html2pdf === 'undefined') {
        alert('Error: html2pdf no está disponible.');
        return;
    }

    captureArea.classList.remove('export-horizontal', 'export-vertical');
    captureArea.classList.add(orientation === 'vertical' ? 'export-vertical' : 'export-horizontal');

    requestAnimationFrame(() => {
        const parkSelector = document.getElementById('parque-name') || document.getElementById('parque-select') || document.getElementById('parque-selector');
        const parkName = (parkSelector ? parkSelector.value : (elements.parkSelector ? elements.parkSelector.value : 'parque')).toLowerCase().replace(/\s+/g, '-');
        const now = new Date().toISOString().slice(0, 10);
        const fileName = `cotizacion-${parkName}-${orientation}-${now}.pdf`;

        const widthMM = (captureArea.clientWidth * 25.4) / 96;
        const heightMM = (captureArea.clientHeight * 25.4) / 96;

        const opt = {
            margin:       10,
            filename:     fileName,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2, 
                useCORS: true,
                ignoreElements: function(element) {
                    return element.classList && element.classList.contains('no-export');
                }
            },
            jsPDF:        { 
                unit: 'mm', 
                format: [widthMM + 20, heightMM + 20], 
                orientation: orientation === 'vertical' ? 'portrait' : 'landscape' 
            }
        };

        html2pdf().set(opt).from(captureArea).toPdf().output('blob').then(async blob => {
            captureArea.classList.remove('export-horizontal', 'export-vertical');

            if (!blob) {
                alert('No se pudo generar el PDF para compartir.');
                return;
            }

            const file = new File([blob], fileName, { type: 'application/pdf' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: 'Cotización en PDF',
                        files: [file]
                    });
                    return;
                } catch (err) {
                    if (err.name === 'AbortError') return;
                }
            }

            const link = document.createElement('a');
            link.download = fileName;
            link.href = URL.createObjectURL(blob);
            link.click();
            showToast('¡PDF generado y descargado exitosamente!');
        }).catch(err => {
            captureArea.classList.remove('export-horizontal', 'export-vertical');
            console.error('Error al generar PDF:', err);
            alert('Ocurrió un error al preparar el PDF para compartir.');
        });
    });
}
