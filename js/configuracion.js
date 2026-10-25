// Panel de configuración: edita factores y gasto adm. en Firestore (config/financiero)
import { configRef } from "./firebase.js";
import { getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const PLAZOS = [12, 24, 36, 48, 60, 72];

const $ = id => document.getElementById(id);
const status = $('config-status');

function renderForm(config) {
    $('gastoAdmUF').value = config.gastoAdmUF;
    $('gastoAdmCLP').value = config.gastoAdmCLP;
    $('factores-body').innerHTML = PLAZOS.map(p => `
        <tr>
            <td><b>${p} cuotas</b></td>
            <td><input type="number" step="0.000001" min="0" data-tipo="factoresUF" data-plazo="${p}" value="${config.factoresUF[p]}" required></td>
            <td><input type="number" step="0.000001" min="0" data-tipo="factoresCLP" data-plazo="${p}" value="${config.factoresCLP[p]}" required></td>
        </tr>
    `).join('');
}

function readForm() {
    const data = {
        gastoAdmUF: parseFloat($('gastoAdmUF').value),
        gastoAdmCLP: Math.round(parseFloat($('gastoAdmCLP').value)),
        factoresUF: {},
        factoresCLP: {}
    };
    document.querySelectorAll('#factores-body input').forEach(input => {
        data[input.dataset.tipo][input.dataset.plazo] = parseFloat(input.value);
    });
    return data;
}

async function loadConfig() {
    try {
        const snap = await getDoc(configRef);
        renderForm(mergeAppConfig(snap.exists() ? snap.data() : null));
    } catch (err) {
        console.warn('[CotizaAPP] Error cargando configuración:', err);
        renderForm(mergeAppConfig(null));
    }
}

loadConfig().then(() => {
    status.textContent = '';
    $('config-form').hidden = false;
});

$('btn-defaults').addEventListener('click', () => {
    renderForm(mergeAppConfig(null));
    showToast('Valores originales cargados. Pulsa "Guardar cambios" para aplicarlos.');
});

$('config-form').addEventListener('submit', async e => {
    e.preventDefault();
    const data = readForm();
    try {
        await setDoc(configRef, { ...data, actualizadoEn: serverTimestamp() });
        applyAppConfig(data);
        showToast('✅ Configuración guardada. Todos los cotizadores usarán los nuevos valores.');
    } catch (err) {
        console.error(err);
        showToast(err.code === 'permission-denied'
            ? '⛔ Firebase rechazó el guardado (revisa las reglas de Firestore o los valores ingresados).'
            : 'Error al guardar: ' + err.message, 6000);
    }
});
