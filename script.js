const BASE_CARTONES = {
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

const GRID_SIZE = 5;
const PATTERN_DEFINITIONS = {
    'line-h': [10, 11, 12, 13, 14],
    'line-v': [2, 7, 12, 17, 22],
    'diag-l': [4, 8, 12, 16, 20],
    'diag-r': [0, 6, 12, 18, 24],
    x: [0, 6, 12, 18, 24, 4, 8, 16, 20],
    cross: [10, 11, 12, 13, 14, 2, 7, 17, 22],
    b: [0, 5, 10, 15, 20],
    i: [1, 6, 11, 16, 21],
    n: [0, 4, 5, 6, 9, 10, 12, 14, 15, 18, 19, 20, 24],
    g: [3, 8, 13, 18, 23],
    o: [4, 9, 14, 19, 24],
    t: [0, 1, 2, 3, 4, 7, 12, 17, 22],
    corners: [0, 4, 20, 24],
    full: Array.from({ length: 25 }, (_, index) => index)
};

const state = {
    currentPattern: 'none',
    cardCounter: 0
};

function getSelectedCartonId() {
    const select = document.getElementById('cartonSelect');
    return select ? select.value : null;
}

function createCardElement(cartonId) {
    const cartonData = BASE_CARTONES[cartonId];
    if (!cartonData) {
        return null;
    }

    const cardElement = document.createElement('div');
    cardElement.className = `bingo-card ${cartonData.themeClass}`;
    state.cardCounter += 1;
    cardElement.id = `card-instance-${state.cardCounter}`;

    const gridHTML = cartonData.numeros
        .flatMap((row, rowIndex) => row.map((value, columnIndex) => {
            const cellIndex = rowIndex * GRID_SIZE + columnIndex;
            const isFreeSpace = value === 'FREE';
            const cellContent = isFreeSpace ? '🦁' : value;
            const className = isFreeSpace ? 'cell free-space' : 'cell';
            return `<div class="${className}" data-cell-index="${cellIndex}">${cellContent}<span class="pattern-guide"></span></div>`;
        }))
        .join('');

    cardElement.innerHTML = `
        <div class="carton-top-bar">
            <div class="carton-header">CARTON <span>${cartonData.num}</span></div>
            <button class="btn-remove" type="button" aria-label="Eliminar cartón">✕</button>
        </div>
        <div class="bingo-title-grid">
            <span>B</span><span>I</span><span>N</span><span>G</span><span>O</span>
        </div>
        <div class="ranges-row">
            <span>1 AL 15</span><span>16 AL 30</span><span>31 AL 45</span><span>46 AL 60</span><span>61 AL 75</span>
        </div>
        <div class="bingo-grid">${gridHTML}</div>
    `;

    return cardElement;
}

function agregarCarton(id = null) {
    const cartonId = id || getSelectedCartonId();
    const cardElement = createCardElement(cartonId);
    if (!cardElement) {
        return;
    }

    const container = document.getElementById('cardsContainer');
    if (container) {
        container.appendChild(cardElement);
    }
}

function toggleCell(cell) {
    if (!cell || !cell.classList) {
        return;
    }

    const isMarked = cell.classList.toggle('marked');
    if (isMarked) {
        createConfetti(cell);
    }
}

function createConfetti(cell) {
    const colors = ['#fdd835', '#ff6b6b', '#4dd0e1', '#81c784', '#ba68c8', '#ffb74d'];
    const confettiLayer = document.createElement('span');
    confettiLayer.className = 'confetti-layer';

    for (let index = 0; index < 10; index += 1) {
        const piece = document.createElement('span');
        piece.className = 'confetti-piece';
        piece.style.setProperty('--x', `${(Math.random() * 120 - 60).toFixed(2)}px`);
        piece.style.setProperty('--y', `${(Math.random() * 120 - 60).toFixed(2)}px`);
        piece.style.setProperty('--rotation', `${(Math.random() * 360).toFixed(2)}deg`);
        piece.style.setProperty('--color', colors[index % colors.length]);
        confettiLayer.appendChild(piece);
    }

    cell.appendChild(confettiLayer);
    setTimeout(() => confettiLayer.remove(), 700);
}

function removerCarton(instanceId) {
    const card = document.getElementById(instanceId);
    if (card) {
        card.remove();
    }
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

function getPatternCells(cells, pattern) {
    const indices = PATTERN_DEFINITIONS[pattern];
    if (!indices) {
        return [];
    }

    return [...new Set(indices.map((index) => cells[index]).filter(Boolean))];
}

function updatePattern(pattern) {
    state.currentPattern = pattern;
    document.querySelectorAll('.cell').forEach((cell) => cell.classList.remove('guide-active'));

    if (pattern === 'none') {
        return;
    }

    document.querySelectorAll('.bingo-grid').forEach((grid) => {
        const cells = Array.from(grid.querySelectorAll('.cell'));
        const guideCells = getPatternCells(cells, pattern);
        guideCells.forEach((cell) => cell.classList.add('guide-active'));
    });
}

function bindEvents() {
    const cartonSelect = document.getElementById('cartonSelect');
    const patternSelect = document.getElementById('patternSelect');
    const chipOptions = document.getElementById('chipOptions');
    const addButton = document.getElementById('addCartonButton');
    const resetButton = document.getElementById('resetCardsButton');
    const cardsContainer = document.getElementById('cardsContainer');

    addButton?.addEventListener('click', () => agregarCarton());
    resetButton?.addEventListener('click', resetAll);
    patternSelect?.addEventListener('change', (event) => updatePattern(event.target.value));

    chipOptions?.addEventListener('click', (event) => {
        const button = event.target.closest('.color-btn');
        if (!button) {
            return;
        }

        const { fill, border, glow } = button.dataset;
        setChipColor(fill, border, glow, button);
    });

    cardsContainer?.addEventListener('click', (event) => {
        const removeButton = event.target.closest('.btn-remove');
        if (removeButton) {
            const card = removeButton.closest('.bingo-card');
            if (card) {
                card.remove();
            }
            return;
        }

        const cell = event.target.closest('.cell');
        if (cell) {
            toggleCell(cell);
        }
    });

    cartonSelect?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            agregarCarton();
        }
    });
}

function initializeApp() {
    bindEvents();
    agregarCarton('21');
    agregarCarton('9');
    updatePattern('none');
}

document.addEventListener('DOMContentLoaded', initializeApp);
