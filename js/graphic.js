// js/graphic.js - Renderizado Gráfico Ilustrativo (Derechos, Ánforas, Criptas)

function renderVisualGraphic(type, count) {
    if (elements.toggleGraphic && !elements.toggleGraphic.checked) {
        if (elements.sepultacionGraphicContainer) {
            elements.sepultacionGraphicContainer.style.display = 'none';
            elements.sepultacionGraphicContainer.innerHTML = '';
        }
        if (elements.visualGraphic) {
            elements.visualGraphic.style.display = 'none';
            elements.visualGraphic.innerHTML = '';
        }
        if (elements.liberadorGraphicContainer) {
            elements.liberadorGraphicContainer.style.display = 'none';
            elements.liberadorGraphicContainer.innerHTML = '';
        }
        return;
    }

    const container = elements.sepultacionGraphicContainer || elements.liberadorGraphicContainer || elements.visualGraphic;
    if (!container) return;

    container.style.display = 'block';
    container.style.width = '100%';
    container.style.maxWidth = '250px';
    container.style.margin = '15px auto 0 auto';
    container.classList.add('active');
    container.innerHTML = '';

    if (elements.liberadorGraphicContainer && elements.liberadorGraphicContainer !== container) {
        elements.liberadorGraphicContainer.style.display = 'none';
        elements.liberadorGraphicContainer.innerHTML = '';
    }
    if (elements.visualGraphic && elements.visualGraphic !== container) {
        elements.visualGraphic.style.display = 'none';
        elements.visualGraphic.innerHTML = '';
    }

    if (type === 'sepultura-liberador') {
        const reducciones = elements.reduccionesInput ? (parseInt(elements.reduccionesInput.value) || 0) : 0;
        const capacidad = count;

        // Título del gráfico
        const titulo = document.createElement('div');
        titulo.style.textAlign = 'center';
        titulo.style.fontWeight = 'bold';
        titulo.style.fontSize = '13px';
        titulo.style.marginBottom = '10px';
        titulo.style.color = '#333';
        titulo.textContent = `Capacidad ${capacidad} - ${reducciones} Reducciones`;
        container.appendChild(titulo);

        // Contenedor de cuadrados apilados verticalmente
        const stackContainer = document.createElement('div');
        stackContainer.style.display = 'flex';
        stackContainer.style.flexDirection = 'column';
        stackContainer.style.alignItems = 'center';
        stackContainer.style.gap = '4px';

        // Cuadrado 1: capacidad base (siempre limpio, sin subdivisiones)
        const baseBox = document.createElement('div');
        baseBox.style.width = '120px';
        baseBox.style.height = '120px';
        baseBox.style.border = '3px solid var(--primary-green)';
        baseBox.style.borderRadius = '8px';
        baseBox.style.display = 'flex';
        baseBox.style.alignItems = 'center';
        baseBox.style.justifyContent = 'center';
        baseBox.style.backgroundColor = '#e8f5e9';
        baseBox.style.fontWeight = 'bold';
        baseBox.style.fontSize = '11px';
        baseBox.style.color = '#333';
        baseBox.style.textAlign = 'center';
        baseBox.textContent = 'CAPACIDAD 1';
        stackContainer.appendChild(baseBox);

        // Cuadrados adicionales: cada uno dividido en 4 reducciones
        const reduccionesPorCapacidad = 4;
        for (let i = 2; i <= capacidad; i++) {
            const capBox = document.createElement('div');
            capBox.style.width = '120px';
            capBox.style.height = '120px';
            capBox.style.border = '3px solid var(--primary-green)';
            capBox.style.borderRadius = '8px';
            capBox.style.display = 'grid';
            capBox.style.gridTemplateColumns = '1fr 1fr';
            capBox.style.gridTemplateRows = '1fr 1fr';
            capBox.style.overflow = 'hidden';
            capBox.style.backgroundColor = '#fff';

            const startReduc = (i - 2) * reduccionesPorCapacidad + 1;
            for (let r = 0; r < reduccionesPorCapacidad; r++) {
                const reducNum = startReduc + r;
                const cell = document.createElement('div');
                cell.style.display = 'flex';
                cell.style.alignItems = 'center';
                cell.style.justifyContent = 'center';
                cell.style.fontSize = '10px';
                cell.style.fontWeight = 'bold';
                cell.style.color = '#fff';
                cell.style.backgroundColor = 'var(--primary-green)';
                cell.style.border = '1px solid #3d8b40';

                if (reducNum <= reducciones) {
                    cell.textContent = 'R' + reducNum;
                } else {
                    cell.style.backgroundColor = '#d0d0d0';
                    cell.style.color = '#999';
                    cell.textContent = 'R' + reducNum;
                }
                capBox.appendChild(cell);
            }

            stackContainer.appendChild(capBox);
        }

        container.appendChild(stackContainer);
    } else if (type === 'aumento-capacidad') {
        const capacidad = count;

        // Título del gráfico
        const titulo = document.createElement('div');
        titulo.style.textAlign = 'center';
        titulo.style.fontWeight = 'bold';
        titulo.style.fontSize = '13px';
        titulo.style.marginBottom = '10px';
        titulo.style.color = '#333';
        titulo.textContent = `Aumento de Capacidad: +${capacidad}`;
        container.appendChild(titulo);

        const stackContainer = document.createElement('div');
        stackContainer.style.display = 'flex';
        stackContainer.style.flexDirection = 'column';
        stackContainer.style.alignItems = 'center';
        stackContainer.style.gap = '4px';

        // Renderizar bloques apilados limpios
        for (let i = capacidad; i >= 1; i--) {
            const box = document.createElement('div');
            box.style.width = '120px';
            box.style.height = '60px';
            box.style.border = '3px solid var(--primary-green)';
            box.style.borderRadius = '8px';
            box.style.display = 'flex';
            box.style.alignItems = 'center';
            box.style.justifyContent = 'center';
            box.style.backgroundColor = '#e8f5e9';
            box.style.fontWeight = 'bold';
            box.style.fontSize = '11px';
            box.style.color = '#333';
            box.textContent = `CAPACIDAD +${i}`;
            stackContainer.appendChild(box);
        }

        container.appendChild(stackContainer);
    } else if (type === 'sepultacion') {
        const top = document.createElement('div');
        top.className = 'sepultura-header';
        container.appendChild(top);

        for (let i = count - 1; i >= 0; i--) {
            const level = document.createElement('div');
            level.className = 'sepultura-level';
            level.textContent = 'DERECHO ' + (i + 1);
            container.appendChild(level);
        }

        const base = document.createElement('div');
        base.className = 'sepultura-base';
        container.appendChild(base);
    } else if (type === 'cremacion') {
        container.style.maxWidth = '100%';
        const bannerImg = document.createElement('img');
        bannerImg.src = 'cremacion.png';
        bannerImg.alt = 'Servicio de Cremación';
        bannerImg.style.width = '100%';
        bannerImg.style.maxWidth = '100%';
        bannerImg.style.height = 'auto';
        bannerImg.style.borderRadius = '8px';
        bannerImg.style.marginBottom = '12px';
        bannerImg.style.border = '1px solid #00763a';
        bannerImg.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
        container.appendChild(bannerImg);

        const gridContainer = document.createElement('div');
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = 'repeat(2, minmax(100px, 1fr))';
        gridContainer.style.gap = '10px';
        gridContainer.style.padding = '5px';
        gridContainer.style.width = '100%';
        
        for (let i = 0; i < count; i++) {
            const anforaWrapper = document.createElement('div');
            anforaWrapper.style.display = 'flex';
            anforaWrapper.style.flexDirection = 'column';
            anforaWrapper.style.alignItems = 'center';
            anforaWrapper.style.padding = '8px';
            anforaWrapper.style.border = '2px dashed var(--primary-green)';
            anforaWrapper.style.borderRadius = '10px';
            anforaWrapper.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            anforaWrapper.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';

            const img = document.createElement('img');
            img.src = 'anfora.png';
            img.alt = 'Ánfora ' + (i + 1);
            img.style.width = '55px';
            img.style.height = '55px';
            img.style.objectFit = 'contain';
            img.style.marginBottom = '4px';

            const label = document.createElement('span');
            label.textContent = 'Ánfora ' + (i + 1);
            label.style.fontSize = '12px';
            label.style.fontWeight = 'bold';
            label.style.color = 'var(--text-dark)';

            anforaWrapper.appendChild(img);
            anforaWrapper.appendChild(label);
            gridContainer.appendChild(anforaWrapper);
        }
        
        container.appendChild(gridContainer);
    }
}

function toggleGraphic() {
    if (typeof updateCalculations === 'function') {
        updateCalculations();
    }
}
