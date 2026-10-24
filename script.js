const STORAGE_KEY = 'bingo-session';
const DEFAULT_THEME_ID = 'negro';

const CARD_THEMES = {
    negro: {
        name: 'Negro',
        highlight: '#3a3f4d',
        base: '#1a1c23',
        border: '#4a505d',
        swatch: '#4a505d'
    },
    fucsia: {
        name: 'Fucsia',
        highlight: '#63284f',
        base: '#2b0f21',
        border: '#8c3f72',
        swatch: '#c44b96'
    },
    purpura: {
        name: 'Púrpura',
        highlight: '#382b5e',
        base: '#160f2a',
        border: '#58468c',
        swatch: '#7c68c4'
    },
    rojo: {
        name: 'Rojo',
        highlight: '#5a2424',
        base: '#2a1010',
        border: '#c0392b',
        swatch: '#e74c3c'
    },
    azul: {
        name: 'Azul',
        highlight: '#1e3a5f',
        base: '#0d1b2a',
        border: '#3498db',
        swatch: '#3498db'
    },
    verde: {
        name: 'Verde',
        highlight: '#1e4d36',
        base: '#0d2418',
        border: '#2ecc71',
        swatch: '#2ecc71'
    }
};

const BASE_CARTONES = {
    '21': {
        num: '21',
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

function cellsFromShape(shape) {
    return shape.flatMap((row, rowIndex) => (
        [...row].flatMap((cell, columnIndex) => (
            cell === 'X' ? [rowIndex * GRID_SIZE + columnIndex] : []
        ))
    ));
}

function rowShape(rowIndex) {
    return Array.from({ length: GRID_SIZE }, (_, index) => (
        index === rowIndex ? 'XXXXX' : '.....'
    ));
}

function columnShape(columnIndex) {
    return Array.from({ length: GRID_SIZE }, () => (
        `${'.'.repeat(columnIndex)}X${'.'.repeat(GRID_SIZE - columnIndex - 1)}`
    ));
}

const PATTERN_GROUPS = [
    {
        options: [
            { id: 'none', name: 'Sin Guía' }
        ]
    },
    {
        label: 'Clásicos',
        options: [
            { id: 'line-h', name: 'Línea Horizontal (centro)', shape: rowShape(2) },
            { id: 'line-v', name: 'Línea Vertical (centro)', shape: columnShape(2) },
            { id: 'diag-l', name: 'Diagonal ↙', shape: [
                '....X',
                '...X.',
                '..X..',
                '.X...',
                'X....'
            ] },
            { id: 'diag-r', name: 'Diagonal ↘', shape: [
                'X....',
                '.X...',
                '..X..',
                '...X.',
                '....X'
            ] },
            { id: 'x', name: 'X (2 Diagonales)', shape: [
                'X...X',
                '.X.X.',
                '..X..',
                '.X.X.',
                'X...X'
            ] },
            { id: 'cross', name: 'Cruz', shape: [
                '..X..',
                '..X..',
                'XXXXX',
                '..X..',
                '..X..'
            ] },
            { id: 'corners', name: '4 Esquinas', shape: [
                'X...X',
                '.....',
                '.....',
                '.....',
                'X...X'
            ] },
            { id: 'full', name: 'Cartón Completo', shape: Array(GRID_SIZE).fill('XXXXX') }
        ]
    },
    {
        label: 'Filas',
        options: [
            { id: 'row-1', name: 'Fila 1', shape: rowShape(0) },
            { id: 'row-2', name: 'Fila 2', shape: rowShape(1) },
            { id: 'row-3', name: 'Fila 3', shape: rowShape(2) },
            { id: 'row-4', name: 'Fila 4', shape: rowShape(3) },
            { id: 'row-5', name: 'Fila 5', shape: rowShape(4) }
        ]
    },
    {
        label: 'Columnas BINGO',
        options: [
            { id: 'col-b', name: 'Columna B', shape: columnShape(0) },
            { id: 'col-i', name: 'Columna I', shape: columnShape(1) },
            { id: 'col-n', name: 'Columna N', shape: columnShape(2) },
            { id: 'col-g', name: 'Columna G', shape: columnShape(3) },
            { id: 'col-o', name: 'Columna O', shape: columnShape(4) }
        ]
    },
    {
        label: 'Letras',
        options: [
            { id: 'letter-a', name: 'Letra A', shape: [
                '.XXX.',
                'X...X',
                'XXXXX',
                'X...X',
                'X...X'
            ] },
            { id: 'letter-b', name: 'Letra B', shape: [
                'XXXX.',
                'X...X',
                'XXXX.',
                'X...X',
                'XXXX.'
            ] },
            { id: 'letter-c', name: 'Letra C', shape: [
                '.XXXX',
                'X....',
                'X....',
                'X....',
                '.XXXX'
            ] },
            { id: 'letter-d', name: 'Letra D', shape: [
                'XXXX.',
                'X...X',
                'X...X',
                'X...X',
                'XXXX.'
            ] },
            { id: 'letter-e', name: 'Letra E', shape: [
                'XXXXX',
                'X....',
                'XXXX.',
                'X....',
                'XXXXX'
            ] },
            { id: 'letter-f', name: 'Letra F', shape: [
                'XXXXX',
                'X....',
                'XXXX.',
                'X....',
                'X....'
            ] },
            { id: 'letter-g', name: 'Letra G', shape: [
                '.XXXX',
                'X....',
                'X.XXX',
                'X...X',
                '.XXXX'
            ] },
            { id: 'letter-h', name: 'Letra H', shape: [
                'X...X',
                'X...X',
                'XXXXX',
                'X...X',
                'X...X'
            ] },
            { id: 'letter-i', name: 'Letra I', shape: [
                'XXXXX',
                '..X..',
                '..X..',
                '..X..',
                'XXXXX'
            ] },
            { id: 'letter-j', name: 'Letra J', shape: [
                'XXXXX',
                '...X.',
                '...X.',
                'X..X.',
                '.XX..'
            ] },
            { id: 'letter-k', name: 'Letra K', shape: [
                'X...X',
                'X..X.',
                'XXX..',
                'X..X.',
                'X...X'
            ] },
            { id: 'letter-l', name: 'Letra L', shape: [
                'X....',
                'X....',
                'X....',
                'X....',
                'XXXXX'
            ] },
            { id: 'letter-m', name: 'Letra M', shape: [
                'X...X',
                'XX.XX',
                'X.X.X',
                'X...X',
                'X...X'
            ] },
            { id: 'letter-n', name: 'Letra N', shape: [
                'X...X',
                'XX..X',
                'X.X.X',
                'X..XX',
                'X...X'
            ] },
            { id: 'letter-ñ', name: 'Letra Ñ', shape: [
                '.X.X.',
                'X...X',
                'XX..X',
                'X.X.X',
                'X..XX'
            ] },
            { id: 'letter-o', name: 'Letra O', shape: [
                '.XXX.',
                'X...X',
                'X...X',
                'X...X',
                '.XXX.'
            ] },
            { id: 'letter-p', name: 'Letra P', shape: [
                'XXXX.',
                'X...X',
                'XXXX.',
                'X....',
                'X....'
            ] },
            { id: 'letter-q', name: 'Letra Q', shape: [
                '.XXX.',
                'X...X',
                'X...X',
                'X..X.',
                '.XX.X'
            ] },
            { id: 'letter-r', name: 'Letra R', shape: [
                'XXXX.',
                'X...X',
                'XXXX.',
                'X..X.',
                'X...X'
            ] },
            { id: 'letter-s', name: 'Letra S', shape: [
                '.XXXX',
                'X....',
                '.XXX.',
                '....X',
                'XXXX.'
            ] },
            { id: 'letter-t', name: 'Letra T', shape: [
                'XXXXX',
                '..X..',
                '..X..',
                '..X..',
                '..X..'
            ] },
            { id: 'letter-u', name: 'Letra U', shape: [
                'X...X',
                'X...X',
                'X...X',
                'X...X',
                '.XXX.'
            ] },
            { id: 'letter-v', name: 'Letra V', shape: [
                'X...X',
                'X...X',
                'X...X',
                '.X.X.',
                '..X..'
            ] },
            { id: 'letter-w', name: 'Letra W', shape: [
                'X...X',
                'X...X',
                'X.X.X',
                'XX.XX',
                'X...X'
            ] },
            { id: 'letter-x', name: 'Letra X', shape: [
                'X...X',
                '.X.X.',
                '..X..',
                '.X.X.',
                'X...X'
            ] },
            { id: 'letter-y', name: 'Letra Y', shape: [
                'X...X',
                '.X.X.',
                '..X..',
                '..X..',
                '..X..'
            ] },
            { id: 'letter-z', name: 'Letra Z', shape: [
                'XXXXX',
                '...X.',
                '..X..',
                '.X...',
                'XXXXX'
            ] }
        ]
    }
];

const PATTERN_DEFINITIONS = Object.fromEntries(
    PATTERN_GROUPS.flatMap((group) => group.options)
        .filter((option) => option.shape)
        .map((option) => [option.id, cellsFromShape(option.shape)])
);

const state = {
    currentPattern: 'none',
    selectedThemeId: DEFAULT_THEME_ID,
    cardCounter: 0
};

function getDefaultSession() {
    return {
        cards: [
            { cartonId: '21', themeId: 'negro' },
            { cartonId: '9', themeId: 'fucsia' }
        ],
        selectedCartonId: '21',
        selectedThemeId: DEFAULT_THEME_ID
    };
}

function loadSession() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.cards)) {
            return null;
        }

        return parsed;
    } catch (error) {
        return null;
    }
}

function saveSession() {
    const cards = Array.from(document.querySelectorAll('.bingo-card')).map((card) => ({
        cartonId: card.dataset.cartonId,
        themeId: card.dataset.themeId || DEFAULT_THEME_ID,
        marked: Array.from(card.querySelectorAll('.cell.marked')).map((cell) => Number(cell.dataset.cellIndex))
    }));

    const payload = {
        cards,
        selectedCartonId: getSelectedCartonId(),
        selectedThemeId: state.selectedThemeId
    };

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
        return;
    }
}

function getSelectedCartonId() {
    const select = document.getElementById('cartonSelect');
    return select ? select.value : null;
}

function getThemeButtonsHTML(selectedThemeId, extraClass = '') {
    return Object.entries(CARD_THEMES).map(([themeId, theme]) => {
        const classes = ['color-btn', extraClass, themeId === selectedThemeId ? 'active' : '']
            .filter(Boolean)
            .join(' ');
        return `<button class="${classes}" type="button" data-theme-id="${themeId}" aria-label="Color ${theme.name}" title="${theme.name}" style="background:${theme.swatch};"></button>`;
    }).join('');
}

function applyCardTheme(cardElement, themeId) {
    const theme = CARD_THEMES[themeId] || CARD_THEMES[DEFAULT_THEME_ID];
    const resolvedThemeId = CARD_THEMES[themeId] ? themeId : DEFAULT_THEME_ID;

    cardElement.dataset.themeId = resolvedThemeId;
    cardElement.style.setProperty('--card-highlight', theme.highlight);
    cardElement.style.setProperty('--card-base', theme.base);
    cardElement.style.setProperty('--card-border', theme.border);

    cardElement.querySelectorAll('.card-theme-picker .color-btn').forEach((button) => {
        button.classList.toggle('active', button.dataset.themeId === resolvedThemeId);
    });
}

function setSelectedTheme(themeId, button = null) {
    if (!CARD_THEMES[themeId]) {
        return;
    }

    state.selectedThemeId = themeId;
    document.querySelectorAll('#cardThemeOptions .color-btn').forEach((themeButton) => {
        themeButton.classList.toggle('active', themeButton.dataset.themeId === themeId);
    });

    if (button) {
        button.classList.add('active');
    }
}

function createCardElement(cartonId, options = {}) {
    const cartonData = BASE_CARTONES[cartonId];
    if (!cartonData) {
        return null;
    }

    const themeId = CARD_THEMES[options.themeId] ? options.themeId : state.selectedThemeId;
    const cardElement = document.createElement('div');
    cardElement.className = 'bingo-card';
    cardElement.dataset.cartonId = cartonId;
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
            <div class="card-theme-picker color-options" role="group" aria-label="Color del cartón">${getThemeButtonsHTML(themeId, 'color-btn-sm')}</div>
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

    applyCardTheme(cardElement, themeId);
    return cardElement;
}

function markSavedCells(cardElement, markedIndexes = []) {
    if (!Array.isArray(markedIndexes) || markedIndexes.length === 0) {
        return;
    }

    const marked = new Set(markedIndexes.map(Number));
    cardElement.querySelectorAll('.cell').forEach((cell) => {
        if (marked.has(Number(cell.dataset.cellIndex))) {
            cell.classList.add('marked');
        }
    });
}

function agregarCarton(id = null, options = {}) {
    const cartonId = id || getSelectedCartonId();
    const persist = options.persist !== false;
    const cardElement = createCardElement(cartonId, options);
    if (!cardElement) {
        return;
    }

    const container = document.getElementById('cardsContainer');
    if (container) {
        container.appendChild(cardElement);
    }

    markSavedCells(cardElement, options.marked);
    updatePattern(state.currentPattern);

    if (persist) {
        saveSession();
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

    saveSession();
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

function resetAll() {
    document.querySelectorAll('.cell').forEach((cell) => cell.classList.remove('marked'));
    saveSession();
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

function populatePatternSelect() {
    const patternSelect = document.getElementById('patternSelect');
    if (!patternSelect) {
        return;
    }

    patternSelect.replaceChildren();

    PATTERN_GROUPS.forEach((group) => {
        const container = group.label
            ? patternSelect.appendChild(Object.assign(document.createElement('optgroup'), { label: group.label }))
            : patternSelect;

        group.options.forEach((option) => {
            const optionElement = document.createElement('option');
            optionElement.value = option.id;
            optionElement.textContent = option.name;
            container.appendChild(optionElement);
        });
    });

    patternSelect.value = state.currentPattern;
}

function populateCartonSelect(selectedCartonId = '21') {
    const cartonSelect = document.getElementById('cartonSelect');
    if (!cartonSelect) {
        return;
    }

    cartonSelect.replaceChildren();
    Object.values(BASE_CARTONES).forEach((carton) => {
        const optionElement = document.createElement('option');
        optionElement.value = carton.num;
        optionElement.textContent = `Cartón ${carton.num}`;
        cartonSelect.appendChild(optionElement);
    });

    if (BASE_CARTONES[selectedCartonId]) {
        cartonSelect.value = selectedCartonId;
    }
}

function populateCardThemeOptions() {
    const themeOptions = document.getElementById('cardThemeOptions');
    if (!themeOptions) {
        return;
    }

    themeOptions.innerHTML = getThemeButtonsHTML(state.selectedThemeId);
}

function restoreSession() {
    const session = loadSession() || getDefaultSession();
    const selectedThemeId = CARD_THEMES[session.selectedThemeId] ? session.selectedThemeId : DEFAULT_THEME_ID;

    setSelectedTheme(selectedThemeId);
    populateCartonSelect(session.selectedCartonId);

    session.cards.forEach((card) => {
        if (!BASE_CARTONES[card.cartonId]) {
            return;
        }

        agregarCarton(card.cartonId, {
            themeId: card.themeId,
            marked: card.marked,
            persist: false
        });
    });
}

function bindEvents() {
    const cartonSelect = document.getElementById('cartonSelect');
    const patternSelect = document.getElementById('patternSelect');
    const chipOptions = document.getElementById('chipOptions');
    const cardThemeOptions = document.getElementById('cardThemeOptions');
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

    cardThemeOptions?.addEventListener('click', (event) => {
        const button = event.target.closest('.color-btn');
        if (!button) {
            return;
        }

        setSelectedTheme(button.dataset.themeId, button);
        saveSession();
    });

    cartonSelect?.addEventListener('change', saveSession);

    cardsContainer?.addEventListener('click', (event) => {
        const removeButton = event.target.closest('.btn-remove');
        if (removeButton) {
            const card = removeButton.closest('.bingo-card');
            if (card) {
                card.remove();
                saveSession();
            }
            return;
        }

        const themeButton = event.target.closest('.card-theme-picker .color-btn');
        if (themeButton) {
            const card = themeButton.closest('.bingo-card');
            if (card) {
                applyCardTheme(card, themeButton.dataset.themeId);
                saveSession();
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
    populatePatternSelect();
    populateCardThemeOptions();
    bindEvents();
    restoreSession();
    updatePattern(state.currentPattern);
}

document.addEventListener('DOMContentLoaded', initializeApp);
