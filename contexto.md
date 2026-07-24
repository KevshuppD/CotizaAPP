# Contexto del Proyecto: CotizaAPP

## 1. Descripción General
**CotizaAPP** es una aplicación web estática diseñada para la cotización dinámica de derechos de sepultación, cremaciones, aumentos de capacidad, planes de mantención y sepultaciones en parques funerarios. 

La herramienta permite a los asesores comerciales y clientes calcular de manera interactiva valores en UF y CLP, esquemas de descuento, montos de pie (cuota inicial), saldos a financiar y tablas de cuotas para diversos plazos de pago, generando además gráficos interactivos de la capacidad contratada y exportación en imagen.

---

## 2. Arquitectura del Proyecto y Estructura de Archivos

```
CotizaAPP/
├── index.html                  # Estructura principal DOM y carga de scripts modulares (Sepultación)
├── style.css                   # Sistema de diseño con variables CSS, layout amplio y responsivo
├── contexto.md                 # Memoria técnica del proyecto y documentación de fórmulas
├── js/
│   ├── core.js                 # Estado global (currentUFValue), mapa de elementos DOM y helpers de formato
│   └── products/
│       ├── sepultacion.js      # Lógica y renderizado gráfico de Sepultación Anticipada
│       ├── cremacion.js        # Lógica y renderizado gráfico de Cremación
│       ├── aumento-capacidad.js# Lógica y renderizado gráfico de Aumento de Capacidad
│       ├── sepultura-liberador.js# Lógica y renderizado gráfico de Sepultura con Beneficios
│       ├── mantencion.js       # Lógica de Planes de Mantención
│       └── servicios-funerarios.js# Lógica de Servicios Funerarios
├── anfora.png                  # Asset gráfico para representación de ánforas (cremación)
├── cremacion.png               # Imagen informativa para el servicio de cremación
└── logo-parque.png             # Logotipo institucional para la cabecera
```

### Integraciones y Librerías Externas
* **[html2canvas.js](https://html2canvas.hertzen.com/)**: Cargado vía CDN en `index.html` para renderizar el área de cotización (`#capture-area`) y generar imágenes PNG exportables.
* **API UF (findic.cl / mindicador.cl)**: Consumo de endpoints REST para obtener el valor actualizado de la Unidad de Fomento (UF) en tiempo real en Chile.

---

## 3. Tipos de Productos Cotizables

La aplicación gestiona 5 modalidades principales seleccionables en el encabezado:

1. **Derecho de Sepultación Anticipada**:
   * Permite seleccionar el parque (*El Prado, El Manantial, Santiago, Canaán*).
   * Ingreso de capacidad (número de derechos, 1 a 10).
   * Muestra valor real, valor anticipado, pie mínimo (10%) y opciones de pago en 12, 24, 36 y 48 cuotas.
   * Visualización gráfica en torre de los niveles de sepultura.

2. **Cremación Anticipada**:
   * Precios automáticos prediseñados según la cantidad de ánforas (1 a 4).
   * Muestra imagen de servicio y renderizado gráfico interactivo de ánforas.
   * Aplica gastos administrativos específicos ($5.250 CLP) y factores ajustados.

3. **Aumento de Capacidad**:
   * Diseñado para añadir 1 o 2 capacidades adicionales a parcelas existentes.
   * Valores base según el parque seleccionado.
   * Renderizado gráfico que resalta los nuevos niveles de capacidad agregados.

4. **Mantención**:
   * Cotización de planes anuales/periódicos de mantención de sepulturas.
   * Opciones de descuento en porcentaje.
   * Desglose del pie con IVA incluido y tabla de cuotas a 24, 36 y 48 meses con cálculo de IVA UF, seguro de desgravamen y gastos operacionales.

5. **Sepultura con Beneficios**:
   * Esquema avanzado para parques liberadores con capacidades de 1 a 4 criptas.
   * Admite modalidades de descuento flexible (% porcentaje, UF o $ CLP).
   * Selección de tipo de pie (% porcentaje, UF o $ CLP).
   * Proyección ampliada de cuotas a plazos de 12, 24, 36, 48, 60, 72, 84, 96 y 108 meses con desglose de seguro y gastos de administración.

---

## 4. Lógica Financiera y Fórmulas de Cotización

### A. Consumo y Edición del Valor UF
* **Obtención Automática:** Consulta `https://findic.cl/api/` (o respaldo `https://mindicador.cl/api/uf`). Si no hay conexión, establece el valor inicial por defecto (`$ 40.013,88 CLP`).
* **Edición Manual:** El usuario puede modificar directamente la casilla **UF HOY** (`#uf-value-input`), lo que desencadena el recálculo inmediato en tiempo real de todos los montos en $ CLP, descuentos y proyectado de cuotas.

---

### B. Valor de Referencia (Escalable por Cantidad de Derechos)
* **Base Unitaria:** `15,47 UF` por derecho.
* **Fórmula General:**
  $$\text{Valor Referencia UF} = 15,47 \times \text{Cantidad de Derechos}$$
  $$\text{Valor Referencia CLP} = \text{Valor Referencia UF} \times \text{UF Hoy}$$

---

### C. Valores Promocionales Oficiales por Cantidad de Derechos
Cuando el usuario selecciona la cantidad de derechos (1 a 4), la aplicación inicializa automáticamente los precios promocionales base oficial:
* **1 Derecho:** `$ 583.264 CLP` ($\sim 14,28\text{ UF}$)
* **2 Derechos:** `$ 972.106 CLP` ($\sim 24,29\text{ UF}$)
* **3 Derechos:** `$ 1.263.738 CLP` ($\sim 31,58\text{ UF}$)
* **4 Derechos:** `$ 1.458.159 CLP` ($\sim 36,44\text{ UF}$)
* **Edición Libre:** El asesor comercial puede sobreescribir o ingresar cualquier cifra personalizada en UF o $ CLP, recalculando la aplicación de manera bidireccional.

---

### D. Fórmulas de Descuento y Pie Mínimo
* **Fórmula del Descuento:**
  $$\text{Descuento UF} = \text{Valor Referencia UF} - \text{Valor Promocional UF}$$
  $$\text{Descuento CLP} = \text{Descuento UF} \times \text{UF Hoy}$$

* **Fórmula del Pie Mínimo (10% sobre Valor Promocional):**
  $$\text{Pie UF} = \text{Valor Promocional UF} \times \left(\frac{\%\text{ Pie}}{100}\right)$$
  $$\text{Pie CLP} = \text{Pie UF} \times \text{UF Hoy}$$

* **Saldo a Financiar (Monto a Financiar en UF):**
  $$\text{Saldo UF} = \text{Valor Promocional UF} - \text{Pie UF}$$

---

### E. Fórmulas de Cuotas (Estructura Financiera Unificada)
Todas las opciones de plazo (12, 24, 36 y 48 cuotas) utilizan la **Fórmula Financiera Unificada de Parques**:

$$\mathbf{\text{Factor UF}} = \left[\left(\text{Valor Promocional UF} - \text{Pie UF}\right) \times \mathbf{\text{Factor Financiero}}\right] + 0,04\text{ UF}$$

$$\mathbf{\text{Cuota CLP}} = \text{Factor UF} \times \text{UF Hoy}$$

*(Donde **+ 0,04 UF** corresponde a Gastos de Administración $0,02\text{ UF}$ + Seguro de Desgravamen $0,02\text{ UF}$)*.

#### Factores Financieros Oficiales por Plazo (Sepultación):
1. **12 Cuotas:** $\text{Factor Financiero} = \frac{1}{12} = \mathbf{0,08333}$
   * $\text{Factor 12 UF} = (\text{Saldo UF} \times 0,08333) + 0,04 = \mathbf{1,111\text{ UF}}$ *(para 1 derecho)*
2. **24 Cuotas:** $\text{Factor Financiero} = \mathbf{0,04466}$
   * $\text{Factor 24 UF} = (\text{Saldo UF} \times 0,04466) + 0,04 = \mathbf{0,614\text{ UF}}$ *(para 1 derecho)*
3. **36 Cuotas:** Gastos Adm = $0,10\text{ UF}$, Seguro = $0,05\text{ UF}$ (Suma adicionales $= 0,15\text{ UF}$)
   * $\text{Factor 36 UF} = \left(\frac{\text{Saldo UF}}{36}\right) + 0,10 + 0,05 = \left(\frac{\text{Saldo UF}}{36}\right) + 0,15\text{ UF}$
4. **48 Cuotas:** Gastos Adm = $0,10\text{ UF}$, Seguro = $0,05\text{ UF}$ (Suma adicionales $= 0,15\text{ UF}$)
   * $\text{Factor 48 UF} = \left(\frac{\text{Saldo UF}}{48}\right) + 0,10 + 0,05 = \left(\frac{\text{Saldo UF}}{48}\right) + 0,15\text{ UF}$

#### Diferenciación de Cuotas por Plazo:
* **12 y 24 Cuotas:**
  * **Sepultación:** Adicional GA ($0,02\text{ UF}$) + Seguro ($0,02\text{ UF}$) $= 0,04\text{ UF}$ (o factor financiero $0,04466$).
  * **Cremación:** Adicionales fijos en pesos: GA ($\$ 3.500\text{ CLP}$) + Seguro ($\$ 1.750\text{ CLP}$) $= \$ 5.250\text{ CLP}$.
* **36 y 48 Cuotas:**
  * Ambas modalidades (Sepultación y Cremación) operan en **UF** agregando **GA ($0,10\text{ UF}$) + Seguro ($0,05\text{ UF}$) $= 0,15\text{ UF}$**.
  * Glosa explicativa: **`Incluye GA (0,10 UF) + Seguro (0,05 UF)`**.

---

### F. Formato y Presentación de Moneda
* **Signo de Peso a la Derecha:** En todos los valores en dinero CLP, el símbolo **$** se ubica **después de los números** (ej: `583.264 $`, `25.077 $`).
* **Estilo Limpio:** Sin bordes negros pesados; campos editables con acento verde inferior al interactuar.

---

## 5. Funcionalidades de Interfaz y UX

* **Exportación y Compartido**:
  * **Descargar Imagen:** Genera una captura HD (scale 2) del área de cotización omitiendo controles administrativos y descargándola como `.png`.
  * **Compartir Imagen:** Utiliza la API Web Share (`navigator.share`) para enviar la cotización directamente por WhatsApp, correo o redes sociales desde dispositivos móviles.
* **Modo Mostrar/Ocultar Gráfico**:
  * Opciones de visibilidad para desactivar los elementos ilustrativos si se prefiere una vista puramente numérica.
* **Persistencia de Estado**:
  * Guarda el último producto seleccionado en `localStorage` (`lastProductType`) para agilizar el flujo de trabajo del usuario al recargar.
* **Diseño Responsivo**:
  * Vista adaptada a computadores de escritorio (contenedor amplio centrado de 1260px a 1380px) y dispositivos móviles (layout fluido responsivo con wrapper en tablas).

---

## 6. Guía de Ejecución y Despliegue

### Ejecución Local
Al ser un proyecto exclusivamente de cliente (*front-end* puro sin backend), no requiere proceso de compilación ni instalación de paquetes Node.js:
1. Abrir `index.html` en cualquier navegador web moderno.
2. O bien servir mediante cualquier servidor HTTP estático (ej. `Live Server` en VS Code, `http-server` o `npx serve`).

### Despliegue
* **Vercel / Netlify / GitHub Pages:** Conectar el repositorio directamente a cualquiera de estas plataformas para un despliegue instantáneo.

---

## 7. Historial de Actualizaciones e Información Adicional

### Actualización - 24 de Julio, 2026
Se realizaron las siguientes modificaciones y correcciones en la aplicación:

1. **Compartir y Exportar en PDF (Nueva Funcionalidad):**
   * Se incorporó la librería `html2pdf.js` en todas las páginas de cotización.
   * Se agregó el botón **Compartir PDF** (con estilos en color rojo `.btn-pdf` en `style.css`) al lado de compartir imagen.
   * **Cálculo de Hoja Única Dinámica:** La lógica en `js/core.js` calcula en tiempo real las dimensiones en milímetros del cotizador (`capture-area`) convirtiendo los píxeles a $96\text{ DPI}$ y sumando un margen de $10\text{mm}$ a cada lado. Esto fuerza a que todo el cotizador calce de manera exacta en **una sola hoja de PDF sin cortes**.
   * **Orientación Dinámica:** Si el dispositivo tiene una pantalla ancha (ancho > 800px), el PDF se genera en formato **horizontal (landscape)**. En pantallas angostas (móviles) se exporta en **vertical (portrait)**.

2. **Limpieza en Compartir Imagen:**
   * Se modificó la llamada a la API Web Share (`navigator.share`) para compartir únicamente el archivo de imagen generado sin textos o títulos descriptivos preestablecidos.

3. **Reajuste de Fórmulas y Desglose en Cremación Anticipada:**
   * **Valor Real Base:** Se redujo el precio real de referencia de 30 UF a **27 UF** por capacidad.
   * **Tablas de Precios Actualizadas:**
     * 1 Cremación: Real = `$1.102.806` / Promo = `$926.727`
     * 2 Cremaciones: Real = `$1.699.143` / Promo = `$1.427.851`
     * 3 Cremaciones: Real = `$2.287.308` / Promo = `$1.922.108`
     * 4 Cremaciones: Real = `$2.679.418` / Promo = `$2.251.612`
   * **Estructuración del Pie (Opción A):**
     * **Pie Capital:** $10\%$ calculado sobre el Valor Promocional Neto.
     * **IVA Pie:** $19\%$ de IVA aplicado sobre el Pie Capital.
     * **Pie Total:** La suma del Pie Capital y el IVA Pie.
     * Se agregaron filas dinámicas de desglose para Pie Capital e IVA Pie en `cremacion.html`.
   * **Monto a Financiar:** Se define como `Valor Promocional Neto - Pie Capital`.
   * **Lógica de Cuotas con IVA:**
     * **Hasta 24 cuotas:** Se calcula la cuota base neta, se le aplica el $19\%$ de IVA y se le suman los cargos exentos en pesos de GA ($\$3.500$) y Seguro ($\$1.750$).
     * **De 36 cuotas en adelante:** Se calcula en UF aplicando el $19\%$ de IVA a la cuota base neta en UF y se le suma un recargo exento de $0,15\text{ UF}$ (GA + Seguro), convirtiendo finalmente la cuota a CLP.
   * **Límite de Capacidad:** Se validó estrictamente el ingreso de cantidad a un **máximo de 4 ánforas**.

4. **Corrección de Valor de Referencia en Sepultación Anticipada:**
   * Se corrigió la función en `js/products/sepultacion.js` para que el valor referencial de capacidad se multiplique dinámicamente por la cantidad de derechos en pantalla (1 derecho = 15,47 UF, 2 derechos = 30,94 UF, etc.) actualizando la etiqueta y el desglose en CLP y UF al instante.
