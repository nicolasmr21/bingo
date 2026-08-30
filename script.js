const baseCartones = {
    '21': {
        num: '21',
        themeClass: 'theme-21',
        numeros: [
            [14, 23, 41, 56, 63],
            [9, 17, 33, 53, 66],
            [10, 29, 'FREE', 47, 69],
            [11, 30, 40, 51, 75],
            [3, 18, 31, 54, 72]
        ]
    },
    '4': {
        num: '4',
        themeClass: 'theme-4',
        numeros: [
            [11, 21, 38, 60, 64],
            [5, 30, 43, 51, 70],
            [4, 16, 'FREE', 54, 65],
            [9, 24, 44, 56, 63],
            [12, 29, 35, 50, 62]
        ]
    },
    '30': {
        num: '30',
        themeClass: 'theme-30',
        numeros: [
            [10, 20, 31, 46, 69],
            [8, 19, 39, 54, 75],
            [12, 28, 'FREE', 50, 73],
            [14, 26, 42, 56, 63],
            [2, 30, 40, 58, 71]
        ]
    },
    '9': {
        num: '9',
        themeClass: 'theme-9',
        numeros: [
            [4, 19, 39, 50, 70],
            [13, 26, 36, 49, 72],
            [1, 16, 'FREE', 57, 69],
            [10, 28, 32, 55, 61],
            [8, 24, 45, 47, 64]
        ]
    }
};

let cardCounter = 0;

function agregarCarton(id = null) {
    const select = document.getElementById('cartonSelect');
    const cartonId = id || select.value;
    const data = baseCartones[cartonId];
    cardCounter++;

    const container = document.getElementById('cardsContainer');
    const cardElement = document.createElement('div');
    cardElement.className = `bingo-card ${data.themeClass}`;
    cardElement.id = `card-instance-${cardCounter}`;

    let gridHTML = '';
    data.numeros.forEach((row, rowIdx) => {
        row.forEach((val, colIdx) => {
            const cellIndex = rowIdx * 5 + colIdx;
            if (val === 'FREE') {
                gridHTML += `<div class="cell free-space" data-cell-index="${cellIndex}" onclick="toggleCell(this)">🦁<span class="pattern-guide"></span></div>`;
            } else {
                gridHTML += `<div class="cell" data-cell-index="${cellIndex}" onclick="toggleCell(this)">${val}<span class="pattern-guide"></span></div>`;
            }
        });
    });

    cardElement.innerHTML = `
        <div class="carton-top-bar">
            <div class="carton-header">CARTON <span>${data.num}</span></div>
            <button class="btn-remove" onclick="removerCarton('${cardElement.id}')">✕</button>
        </div>
        <div class="bingo-title-grid">
            <span>B</span><span>I</span><span>N</span><span>G</span><span>O</span>
        </div>
        <div class="ranges-row">
            <span>1 AL 15</span><span>16 AL 30</span><span>31 AL 45</span><span>46 AL 60</span><span>61 AL 75</span>
        </div>
        <div class="bingo-grid">${gridHTML}</div>
    `;

    container.appendChild(cardElement);
}

function toggleCell(cell) {
    const isMarked = cell.classList.toggle('marked');

    if (isMarked) {
        createConfetti(cell);
    }
}

function createConfetti(cell) {
    const colors = ['#fdd835', '#ff6b6b', '#4dd0e1', '#81c784', '#ba68c8', '#ffb74d'];
    const confettiLayer = document.createElement('span');
    confettiLayer.className = 'confetti-layer';

    for (let i = 0; i < 10; i++) {
        const piece = document.createElement('span');
        piece.className = 'confetti-piece';
        piece.style.setProperty('--x', `${(Math.random() * 120 - 60).toFixed(2)}px`);
        piece.style.setProperty('--y', `${(Math.random() * 120 - 60).toFixed(2)}px`);
        piece.style.setProperty('--rotation', `${(Math.random() * 360).toFixed(2)}deg`);
        piece.style.setProperty('--color', colors[i % colors.length]);
        piece.style.setProperty('--delay', `${(Math.random() * 0.12).toFixed(2)}s`);
        confettiLayer.appendChild(piece);
    }

    cell.appendChild(confettiLayer);

    setTimeout(() => {
        confettiLayer.remove();
    }, 700);
}

function removerCarton(instanceId) {
    const card = document.getElementById(instanceId);
    if (card) card.remove();
}

function resetAll() {
    document.querySelectorAll('.cell').forEach((cell) => cell.classList.remove('marked'));
}

function setChipColor(fill, border, glow, btn) {
    document.documentElement.style.setProperty('--chip-color', fill);
    document.documentElement.style.setProperty('--chip-border', border);
    document.documentElement.style.setProperty('--chip-glow', glow);

    document.querySelectorAll('#chipOptions .color-btn').forEach((button) => button.classList.remove('active'));
    btn.classList.add('active');
}

let currentPattern = 'none';

function updatePattern(pattern) {
    currentPattern = pattern;
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('guide-active'));
    
    if (pattern !== 'none') {
        document.querySelectorAll('.bingo-grid').forEach(grid => {
            const cells = Array.from(grid.querySelectorAll('.cell'));
            const guideCells = getPatternCells(cells, pattern);
            guideCells.forEach(cell => cell.classList.add('guide-active'));
        });
    }
}

function getPatternCells(cells, pattern) {
    const guideCells = [];
    
    if (pattern === 'line-h') {
        return [cells[10], cells[11], cells[12], cells[13], cells[14]]; // Fila central
    } else if (pattern === 'line-v') {
        return [cells[2], cells[7], cells[12], cells[17], cells[22]]; // Columna central
    } else if (pattern === 'diag-l') {
        return [cells[4], cells[8], cells[12], cells[16], cells[20]]; // Diagonal ↙
    } else if (pattern === 'diag-r') {
        return [cells[0], cells[6], cells[12], cells[18], cells[24]]; // Diagonal ↘
    } else if (pattern === 'x') {
        return [cells[0], cells[6], cells[12], cells[18], cells[24], cells[4], cells[8], cells[16], cells[20]];
    } else if (pattern === 'cross') {
        return [...new Set([
            cells[10], cells[11], cells[12], cells[13], cells[14],
            cells[2], cells[7], cells[17], cells[22]
        ])];
    } else if (pattern === 'b') {
        return [cells[0], cells[5], cells[10], cells[15], cells[20]];
    } else if (pattern === 'i') {
        return [cells[1], cells[6], cells[11], cells[16], cells[21]];
    } else if (pattern === 'n') {
        // Letra N: columna B + columna O + diagonal ↘
        const b = [cells[0], cells[5], cells[10], cells[15], cells[20]];
        const o = [cells[4], cells[9], cells[14], cells[19], cells[24]];
        const diag = [cells[0], cells[6], cells[12], cells[18], cells[24]];
        return [...new Set([...b, ...o, ...diag])];
    } else if (pattern === 'g') {
        return [cells[3], cells[8], cells[13], cells[18], cells[23]];
    } else if (pattern === 'o') {
        return [cells[4], cells[9], cells[14], cells[19], cells[24]];
    } else if (pattern === 't') {
        // Letra T: fila superior + columna central
        return [cells[0], cells[1], cells[2], cells[3], cells[4], cells[7], cells[12], cells[17], cells[22]];
    } else if (pattern === 'corners') {
        return [cells[0], cells[4], cells[20], cells[24]];
    } else if (pattern === 'full') {
        return cells;
    }
    
    return [];
}

agregarCarton('21');
agregarCarton('9');
updatePattern('none');
