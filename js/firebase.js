// Inicialización de Firebase (SDK modular vía CDN, sin bundler)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyBxu0TtQ9tpBq-JNrZw-Q1uOkRflYZ9Mc4",
  authDomain: "cotizaapp-1e7a7.firebaseapp.com",
  projectId: "cotizaapp-1e7a7",
  storageBucket: "cotizaapp-1e7a7.firebasestorage.app",
  messagingSenderId: "529962814174",
  appId: "1:529962814174:web:ded36dda6b54c97561904f"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const configRef = doc(db, "config", "financiero");

window.cotizaFirebase = { app, db };

// Cargar factores y gasto adm. vigentes y recalcular el cotizador
if (typeof applyAppConfig === "function") {
  getDoc(configRef)
    .then(snap => {
      if (!snap.exists()) return;
      const apply = () => applyAppConfig(snap.data());
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
      else apply();
    })
    .catch(err => console.warn("[CotizaAPP] No se pudo cargar la configuración desde Firebase:", err));
}
