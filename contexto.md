# Contexto del Proyecto: CotizaAPP

## 1. Descripción General
**CotizaAPP** es una aplicación web integral diseñada para la cotización dinámica, comercial y flexible de derechos de sepultación, sepulturas familiares, jardines, cremaciones, aumentos de capacidad y planes de mantención para parques funerarios (enfocado en **Parque Auco**).

La herramienta permite a los asesores comerciales calcular valores en **UF** y **$ CLP**, aplicar descuentos por porcentaje o monto, fijar porcentajes de pie (cuota inicial), descontar capitales anteriores, personalizar cuotas rellenables o calcularlas mediante factores financieros, y exportar/compartir cotizaciones en **Imagen PNG** o **PDF de 1 sola hoja** en formato **Horizontal o Vertical**.

---

## 2. Arquitectura del Proyecto y Estructura de Archivos

```
CotizaAPP/
├── index.html                  # Cotizador de Derecho de Sepultación Anticipada
├── sepultura-auco-uf.html      # Cotizador Sepultura Parque Auco (UF)
├── sepultura-auco-pesos.html   # Cotizador Sepultura Parque Auco (Pesos)
├── jardin-auco-uf.html         # Cotizador Jardín Familiar Parque Auco (UF)
├── jardin-auco-pesos.html      # Cotizador Jardín Familiar Parque Auco (Pesos)
├── cremacion.html              # Cotizador Cremación
├── aumento-capacidad.html      # Cotizador Aumento de Capacidad
├── mantencion.html             # Cotizador Mantención Perpetua
├── servicios-funerarios.html   # Cotizador Servicios Funerarios
├── vercel.json                 # Configuración de despliegue en Vercel (cleanUrls)
├── package.json                # Configuración de dependencias y scripts de desarrollo (serve)
├── style.css                   # Sistema de diseño, variables CSS (#23C27E), modal y responsive
├── favicon.ico                 # Favicon institucional
├── contexto.md                 # Memoria técnica completa y registro de fórmulas
├── js/
│   ├── core.js                 # Estado global (currentUFValue), helpers de formato, toast, modal y exportación
│   └── products/
│       ├── sepultacion.js      # Lógica y renderizado de Sepultación Anticipada
│       ├── sepultura-auco-uf.js# Lógica y factores de Sepultura Auco UF (24 a 72 cuotas)
│       ├── sepultura-auco-pesos.js# Lógica y factores de Sepultura Auco Pesos (24 a 72 cuotas)
│       ├── jardin-auco-uf.js   # Lógica financiera y cuotas rellenables de Jardín Auco (UF)
│       ├── jardin-auco-pesos.js# Lógica financiera y cuotas rellenables de Jardín Auco (Pesos)
│       ├── cremacion.js        # Lógica financiera y selector de ánforas de Cremación
│       ├── aumento-capacidad.js# Lógica manual de Aumento de Capacidad
│       ├── mantencion.js       # Lógica de Planes de Mantención
│       └── servicios-funerarios.js# Lógica de Servicios Funerarios
├── anfora.png                  # Asset gráfico para representación de ánforas (cremación)
├── sarcofago.png               # Asset gráfico para representación de sarcófagos (sepultura)
├── jardin.jpg                  # Fotografía institucional para Jardín Familiar Parque Auco
└── logo-parque.png             # Logotipo institucional en alta resolución
```

### Integraciones y Librerías Externas
* **[html2canvas.js](https://html2canvas.hertzen.com/)**: Renderizado del área de cotización (`#capture-area`) en lienzo HD (escala 2x).
* **[jsPDF](https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js)**: Generación directa y nativa de documentos PDF en 1 sola hoja ajustada a las dimensiones del contenido.
* **[html2pdf.js](https://ekoopmans.github.io/html2pdf.js/)**: Herramienta complementaria de procesamiento PDF.
* **API UF (findic.cl / mindicador.cl)**: Consumo de endpoints REST para obtener el valor actualizado de la UF en tiempo real.

---

## 3. Tipos de Productos Cotizables

La aplicación gestiona los siguientes módulos seleccionables en el encabezado:

1. **Derecho de Sepultación Anticipada** (`index.html`):
   * Cotizador simplificado en UF y $ CLP.
   * Cálculo bidireccional: $\text{Descuento} = \text{Valor Real} - \text{Valor Promocional}$.
   * Panel lateral con Fecha, UF Hoy editable y cuadro editable de Beneficios.

2. **Sepultura Parque Auco (UF)** (`sepultura-auco-uf.html`):
   * Cotizador simplificado en UF con tasa del 0,55% mensual.
   * Campos: Valor Real, Descuento, Valor Promocional, Pie y Saldo a Financiar.
   * Selector de capacidad (1, 2, 4, 6 y 8) con gráfico dinámico de sarcófagos.
   * **Tabla de cuotas de 24 a 72 cuotas** (sin 12 cuotas):
     * Factores: 24 (0,04459), 36 (0,03069), 48 (0,02376), 60 (0,01961), 72 (0,01686).
     * Gasto Administrativo fijo de **0,10 UF** sumado a cada cuota.

3. **Sepultura Parque Auco (Pesos)** (`sepultura-auco-pesos.html`):
   * Cotizador con cálculo nativo en moneda nacional ($ CLP).
   * **Tabla de cuotas de 24 a 72 cuotas** (sin 12 cuotas):
     * Factores: 24 (0,04992), 36 (0,03615), 48 (0,02938), 60 (0,02808), 72 (0,025603).
     * Gasto Administrativo fijo de **$3.964 CLP** sumado a cada cuota.
   * Selector de capacidad (1 a 8) en 2 columnas y cuadro editable de Beneficios.

4. **Jardín Familiar Parque Auco (UF)** (`jardin-auco-uf.html`):
   * Título institucional: `COTIZACIÓN JARDIN FAMILIAR PARQUE DE AUCO`.
   * **Estructura Financiera**:
     $$\text{Valor Promocional} = \text{Valor Real} - \text{Descuento} - \text{Capital Anterior}$$
     $$\text{Pie} = \text{Valor Promocional} \times \left(\frac{\%\text{ Pie}}{100}\right) \quad (\text{10\% por defecto})$$
     $$\text{Saldo a Financiar} = \text{Valor Promocional} - \text{Pie}$$
   * Descuento y Pie multidireccionales en `%`, UF o $ CLP.
   * Fila editable de **Capital Anterior**.
   * **Tabla de cuotas rellenables manuales**: Selector de cantidad de cuotas a mostrar (1 a 6 alternativas) y selector de plazo por fila (12 a 72 cuotas) con conversión automática UF / $ CLP.
   * Panel superior con Fecha, UF Hoy, Capacidad (4 y 6) y Reducciones (4 y 8).
   * Cuadro de **Beneficios ubicado debajo de la tabla de cuotas**. Columna derecha con fotografía del jardín (`jardin.jpg`).

5. **Jardín Familiar Parque Auco (Pesos)** (`jardin-auco-pesos.html`):
   * Misma estructura financiera y tabla flexible de cuotas calculada en moneda nacional ($ CLP).
   * Descuento en `%`, Pie en `%` (10% default), Capital Anterior y conversión informativa a UF.
   * Cuadro de Beneficios debajo de las cuotas e imagen `jardin.jpg` a la derecha.

6. **Cremación** (`cremacion.html`):
   * Nombre comercial unificado como **Cremación**.
   * Campos financieros editables con cálculo bidireccional (Real, Promo, Descuento, Pie, Saldo).
   * Selector de cuotas rellenables en UF y $ para 12, 24, 36 y 48 cuotas.
   * Selector de 1 a 4 ánforas con renderizado gráfico de `anfora.png` con proporción protegida.

7. **Aumento de Capacidad** (`aumento-capacidad.html`):
   * Cotizador con campos en blanco para cálculo comercial manual.
   * Cuadro de cuotas rellenables de 12 a 48 cuotas y panel de Beneficios.

8. **Mantención Perpetua** (`mantencion.html`):
   * Cotizador especializado para planes de mantención en parques.

---

## 4. Funcionalidades de Exportación e Interacción

### A. Selector de Orientación (Horizontal vs Vertical)
Al pulsar cualquiera de los botones de salida (**Descargar Imagen**, **Compartir Imagen**, **Compartir PDF**), se despliega un modal emergente interactivo:
* 📱 **Vertical (Retrato / 780px)**: Reorganiza el cotizador en una sola columna vertical. Ideal para teléfonos móviles, chats de WhatsApp, estados y documentos PDF verticales.
* 🖥️ **Horizontal (Apaisado / 1260px)**: Mantiene la distribución panorámica de 2 columnas de escritorio.

### B. Copiado al Portapapeles en Navegadores de Escritorio (Firefox / Chrome / Edge)
* Si el navegador no cuenta con soporte nativo de la Web Share API (típico en computadores de escritorio), el sistema copia la imagen de la cotización automáticamente al portapapeles mediante `navigator.clipboard.write([ClipboardItem])`.
* Permite pegar la cotización inmediatamente con **`Ctrl + V`** en WhatsApp Web, Telegram o correo electrónico.
* Notificación flotante tipo **Toast** (`#cotizaapp-toast`) que confirma la acción sin emitir alertas intrusivas.

### C. Generación de PDF en 1 Sola Hoja Exacta
* Integración con `jsPDF` dimensionando el lienzo a la medida milimétrica exacta del contenido capturado más 8mm de margen perimetral.
* Se eliminan por completo los saltos de página y hojas sobrantes en blanco, garantizando un PDF nítido de **exactamente 1 página**.

### D. Protección de Aspect Ratio en Imágenes
* El logotipo institucional (`.park-logo`), los sarcófagos, las ánforas y la fotografía del jardín cuentan con dimensionamiento encapsulado que impide deformaciones o aplastamientos al exportar.

---

## 5. Guía de Ejecución y Despliegue

### Servidor Local
```bash
# Iniciar servidor de desarrollo en puerto 3000
npm run dev
```

### Despliegue en Vercel
* **URL en Producción:** [https://cotiza-app.vercel.app/](https://cotiza-app.vercel.app/)
* **Configuración (`vercel.json`):**
  ```json
  {
    "version": 2,
    "cleanUrls": true,
    "trailingSlash": false
  }
  ```
* **Repositorio GitHub:** [https://github.com/KevshuppD/CotizaAPP.git](https://github.com/KevshuppD/CotizaAPP.git) en rama `main`.
