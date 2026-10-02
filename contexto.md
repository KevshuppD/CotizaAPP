# Contexto del Proyecto: CotizaAPP

## 1. Descripción General
**CotizaAPP** es una aplicación web integral diseñada para la cotización dinámica, comercial y flexible de derechos de sepultación, sepulturas familiares, jardines, cremaciones, aumentos de capacidad y planes de mantención para parques funerarios (enfocado en **Parque Auco**).

La herramienta permite a los asesores comerciales calcular valores en **UF** y **$ CLP**, aplicar descuentos por porcentaje o monto, fijar porcentajes de pie (cuota inicial), descontar capitales anteriores, personalizar cuotas rellenables o calcularlas mediante factores financieros, y exportar/compartir cotizaciones en **Imagen PNG** o **PDF de 1 sola hoja** en formato **Horizontal o Vertical**.

---

## 2. Arquitectura del Proyecto y Estructura de Archivos

```
CotizaAPP/
├── index.html                  # Cotizador de Derecho de Sepultación Anticipada
├── sepultura-auco.html         # Cotizador General Sepultura Parque Auco (UF, Pesos, Contado)
├── jardin-auco.html            # Cotizador General Jardín Familiar Parque Auco (UF, Pesos, Contado)
├── fuente-auco.html            # Cotizador General Fuente de Auco (UF, Pesos, Contado)
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
│       ├── sepultura-auco.js   # Lógica unificada Sepultura Auco (UF, Pesos, Contado/Sin Interés)
│       ├── jardin-auco.js      # Lógica unificada Jardín Familiar Auco (UF, Pesos, Contado/Sin Interés)
│       ├── fuente-auco.js      # Lógica unificada Fuente de Auco (UF, Pesos, Contado/Sin Interés)
│       ├── cremacion.js        # Lógica financiera y selector de ánforas de Cremación
│       ├── aumento-capacidad.js# Lógica manual de Aumento de Capacidad
│       ├── mantencion.js       # Lógica de Planes de Mantención
│       └── servicios-funerarios.js# Lógica de Servicios Funerarios
├── anfora.png                  # Asset gráfico para representación de ánforas (cremación)
├── sarcofago.png               # Asset gráfico para representación de sarcófagos (sepultura)
├── jardin.jpg                  # Fotografía institucional para Jardín Familiar Parque Auco
├── fuenteauco.jpeg             # Fotografía institucional para Fuente de Auco
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

2. **Sepultura Parque Auco** (`sepultura-auco.html`):
   * Módulo unificado con selector interactivo de **Modalidad de Financiamiento**:
     * 🔹 **Financiamiento UF (0,55% mens.)**: Factores 24 (0,04459), 36 (0,03069), 48 (0,02376), 60 (0,01961), 72 (0,01686) + Gasto Adm. **0,10 UF**.
     * 💵 **Financiamiento Pesos ($)**: Factores 24 (0,04992), 36 (0,03615), 48 (0,02938), 60 (0,02808), 72 (0,025603) + Gasto Adm. **$3.964 CLP**.
     * ⚡ **Cuota Contado / Sin Interés**: $\text{Cuota Base} = \frac{\text{Saldo}}{\text{Plazo}}$ + Gasto Adm. (0,10 UF / $3.964 CLP) sin interés adicional (1 a 72 cuotas).
   * **Estructura Financiera**:
     $$\text{Valor Promocional} = \text{Valor Real} - \text{Descuento} - \text{Capital Anterior}$$
     $$\text{Pie} = \text{Valor Promocional} \times \left(\frac{\%\text{ Pie}}{100}\right) \quad (\text{10\% por defecto})$$
     $$\text{Saldo a Financiar} = \text{Valor Promocional} - \text{Pie}$$
   * Campos: Valor Real, Descuento (% / UF / CLP), Capital Anterior (UF / CLP), Valor Promocional, Pie (% / UF / CLP) y Saldo a Financiar.
   * Selector de capacidad (1, 2, 4, 6 y 8) con gráfico dinámico de sarcófagos, indicador de reducciones y cuadro editable de Beneficios.

3. **Jardín Familiar Parque Auco** (`jardin-auco.html`):
   * Módulo unificado con selector interactivo de **Modalidad de Financiamiento**:
     * 🔹 **Financiamiento UF (0,55% mens.)**: Factores 24 a 72 + Gasto Adm. **0,10 UF**.
     * 💵 **Financiamiento Pesos ($)**: Factores 24 a 72 + Gasto Adm. **$3.964 CLP**.
     * ⚡ **Cuota Contado / Sin Interés**: $\text{Cuota Base} = \frac{\text{Saldo}}{\text{Plazo}}$ + Gasto Adm. sin interés adicional (1 a 72 cuotas).
   * **Estructura Financiera**:
     $$\text{Valor Promocional} = \text{Valor Real} - \text{Descuento} - \text{Capital Anterior}$$
     $$\text{Pie} = \text{Valor Promocional} \times \left(\frac{\%\text{ Pie}}{100}\right) \quad (\text{10\% por defecto})$$
     $$\text{Saldo a Financiar} = \text{Valor Promocional} - \text{Pie}$$
   * Descuento y Pie multidireccionales en `%`, UF o $ CLP, con fila editable de **Capital Anterior**.
   * Selector interactivo de cuotas a mostrar con checkboxes ("Todas", filtros individuales) y columnas estandarizadas.
   * Panel superior con Fecha, UF Hoy, Capacidad (4 y 6) y Reducciones (4 y 8).
   * Cuadro de **Beneficios editable** y columna derecha con fotografía del jardín (`jardin.jpg`).

4. **Fuente de Auco** (`fuente-auco.html`):
   * Módulo unificado con selector interactivo de **Modalidad de Financiamiento**:
     * 🔹 **Financiamiento UF (0,55% mens.)**: Factores 24 a 72 + Gasto Adm. **0,10 UF**.
     * 💵 **Financiamiento Pesos ($)**: Factores 24 a 72 + Gasto Adm. **$3.964 CLP**.
     * ⚡ **Cuota Contado / Sin Interés**: $\text{Cuota Base} = \frac{\text{Saldo}}{\text{Plazo}}$ + Gasto Adm. sin interés adicional (1 a 72 cuotas).
   * Título institucional: `COTIZACIÓN FUENTE DE AUCO`.
   * Estructura financiera: Valor Real, Descuento %, Capital Anterior, Pie %, Saldo a Financiar.
   * Panel superior con selector de **Capacidad (2 y 4)** y sincronización de **Reducciones (Capacidad 2 → 4 Reducciones, Capacidad 4 → 8 Reducciones)**.
   * Selector interactivo de cuotas con checkboxes ("Todas", filtros de plazos 24, 36, 48, 60, 72 o plazos contado).
   * Cuadro de Beneficios editable y fotografía institucional de la fuente (`fuenteauco.jpeg`) en la columna derecha.

5. **Cremación** (`cremacion.html`):
   * Módulo unificado con selector interactivo de **Modalidad de Financiamiento**:
     * 🔹 **Financiamiento UF**: $\text{Total Cuota UF} = \frac{\text{Saldo a Financiar UF}}{\text{Plazo}} + 0,10\text{ UF (Gasto Adm.)}$.
     * 💵 **Financiamiento Pesos ($)**: $\text{Total Cuota CLP} = \frac{\text{Saldo a Financiar CLP}}{\text{Plazo}} + \$3.964\text{ CLP (Gasto Adm.)}$.
   * **Estructura Financiera**:
     $$\text{Valor Promocional} = \text{Valor Real} - \text{Descuento} - \text{Capital Anterior}$$
     $$\text{Pie} = \text{Valor Promocional} \times \left(\frac{\%\text{ Pie}}{100}\right) \quad (\text{10\% por defecto, editable})$$
     $$\text{Saldo a Financiar} = \text{Valor Promocional} - \text{Pie}$$
   * Descuento y Pie multidireccionales en `%`, UF o $ CLP, con fila editable de **Capital Anterior**.
   * Selector interactivo de cuotas con checkboxes ("Todas", filtros de plazos 12, 24, 36, 48, 60, 72) y tabla con columnas de **Cuota Base**, **Gasto Adm.** y **Total Cuota**.
   * Selector de 1 a 4 ánforas con renderizado gráfico de `anfora.png` con proporción protegida.
   * Cuadro editable de Beneficios, Fecha y UF Hoy.

6. **Aumento de Capacidad** (`aumento-capacidad.html`):
   * Módulo unificado con selector interactivo de **Modalidad de Financiamiento**:
     * 🔹 **Financiamiento UF (0,55% mens.)**: Factores 12 (0,08630), 24 (0,04459), 36 (0,03069), 48 (0,02376) + Gasto Adm. **0,10 UF**.
     * 💵 **Financiamiento Pesos ($)**: Factores 12 (0,09204), 24 (0,04992), 36 (0,03615), 48 (0,02938) + Gasto Adm. **$3.964 CLP**.
     * ⚡ **Cuota Contado / Sin Interés**: $\text{Cuota Base} = \frac{\text{Saldo}}{\text{Plazo}}$ + Gasto Adm. sin interés adicional (1 a 48 cuotas).
   * **Estructura Financiera**:
     $$\text{Valor Promocional} = \text{Valor Real} - \text{Descuento} - \text{Capital Anterior}$$
     $$\text{Pie} = \text{Valor Promocional} \times \left(\frac{\%\text{ Pie}}{100}\right) \quad (\text{10\% por defecto, editable})$$
     $$\text{Saldo a Financiar} = \text{Valor Promocional} - \text{Pie}$$
   * Descuento y Pie multidireccionales en `%`, UF o $ CLP, con fila editable de **Capital Anterior**.
   * Selector interactivo de cuotas con checkboxes ("Todas", filtros de plazos 12, 24, 36, 48 o plazos contado).
   * Panel lateral con Fecha, UF Hoy y cuadro de Beneficios editable.

8. **Mantención Perpetua** (`mantencion.html`):
   * Cuadro especial superior separado: **Valor Mantención Anual (IVA incluido)** en UF y $ CLP.
   * **Estructura Financiera**:
     $$\text{Saldo a Financiar} = \text{Valor Real (IVA incluido)} - \text{Descuento Comercial}$$
   * Descuento multidireccional con soporte en Porcentaje (`%`), `UF` y `$ CLP`.
   * **Tabla de Cuotas**: Selector interactivo de cuotas (1 a 6 cuotas) con cálculo directo:
     $$\text{Valor Cuota} = \frac{\text{Saldo a Financiar}}{\text{N° de Cuotas}}$$
     calculado tanto en UF como en $ CLP.
   * Panel lateral con Fecha, UF Hoy y Beneficios/Coberturas editables.

9. **Servicios Funerarios** (`servicios-funerarios.html`):
   * Cotizador para planes de sepelio y servicios funerarios.

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

### D. Adaptabilidad Responsiva y Uso a Media Pantalla (Split-Screen)
* La aplicación se adapta automáticamente a ventanas divididas / media pantalla (típicas al programar o trabajar con múltiples ventanas a 800px - 1199px):
  * Reorganiza fluidamente los paneles a flujo vertical cómodo sin desbordes horizontales ni compresión de tablas.
  * Escala tipografías, márgenes de tabla y paddings de encabezado para una lectura y edición inmediata sin necesidad de scroll horizontal.
* En modo pantalla completa (>= 1200px) mantiene la disposición de 2 columnas panorámicas.

### E. Protección de Aspect Ratio en Imágenes
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
