// js/graphic.js - Renderizado Gráfico Ilustrativo (Derechos, Ánforas, Criptas)

function renderVisualGraphic(type, count) {
    if (!elements.toggleGraphic || !elements.toggleGraphic.checked) {
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

    if (type === 'sepultura-liberador' || type === 'aumento-capacidad') {
        const top = document.createElement('div');
        top.className = 'sepultura-header';
        top.style.backgroundColor = '#333333';
        top.style.height = '30px';
        top.style.borderRadius = '5px 5px 0 0';
        container.appendChild(top);

        for (let i = count; i >= 1; i--) {
            const addedLevel = document.createElement('div');
            addedLevel.className = 'sepultura-level';
            addedLevel.style.backgroundColor = 'var(--primary-green)';
            addedLevel.style.border = '1px solid #3d8b40';
            addedLevel.style.color = '#ffffff';
            addedLevel.style.fontWeight = 'bold';
            addedLevel.style.fontSize = '12px';
            addedLevel.style.height = '40px';
            addedLevel.style.display = 'flex';
            addedLevel.style.alignItems = 'center';
            addedLevel.style.justifyContent = 'center';
            addedLevel.textContent = '+' + i + ' SEPULTACIÓN';
            container.appendChild(addedLevel);
        }

        const baseSpace = document.createElement('div');
        baseSpace.className = 'sepultura-level';
        baseSpace.style.backgroundColor = '#d0d0d0';
        baseSpace.style.border = '1px solid #999999';
        baseSpace.style.color = '#333333';
        baseSpace.style.fontWeight = 'bold';
        baseSpace.style.fontSize = '12px';
        baseSpace.style.height = '40px';
        baseSpace.style.display = 'flex';
        baseSpace.style.alignItems = 'center';
        baseSpace.style.justifyContent = 'center';
        baseSpace.textContent = 'ESPACIO 1';
        container.appendChild(baseSpace);

        const base = document.createElement('div');
        base.className = 'sepultura-base';
        base.style.backgroundColor = 'var(--primary-green)';
        base.style.height = '20px';
        base.style.borderRadius = '0 0 8px 8px';
        container.appendChild(base);
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
