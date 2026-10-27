const STORAGE_KEY = 'bingo-session';
const DEFAULT_THEME_ID = 'negro';
const DEFAULT_CHIP_ID = 'rojo';

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

const CHIP_THEMES = {
    rojo: {
        name: 'Rojo',
        fill: 'rgba(231, 76, 60, 0.86)',
        border: '#ff9b8f',
        glow: 'rgba(231, 76, 60, 0.42)',
        swatch: '#e74c3c'
    },
    azul: {
        name: 'Azul',
        fill: 'rgba(52, 152, 219, 0.86)',
        border: '#7fc8f2',
        glow: 'rgba(52, 152, 219, 0.42)',
        swatch: '#3498db'
    },
    verde: {
        name: 'Verde',
        fill: 'rgba(46, 204, 113, 0.86)',
        border: '#7de5a8',
        glow: 'rgba(46, 204, 113, 0.42)',
        swatch: '#2ecc71'
    },
    rosa: {
        name: 'Rosa',
        fill: 'rgba(232, 67, 147, 0.86)',
        border: '#ffa0ca',
        glow: 'rgba(232, 67, 147, 0.42)',
        swatch: '#e84393'
    },
    turquesa: {
        name: 'Turquesa',
        fill: 'rgba(0, 206, 201, 0.86)',
        border: '#81ecec',
        glow: 'rgba(0, 206, 201, 0.42)',
        swatch: '#00cec9'
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
    '18': {
        num: '18',
        numeros: [
            [9, 30, 44, 57, 75],
            [10, 16, 34, 50, 67],
            [2, 25, 'FREE', 47, 72],
            [15, 19, 39, 52, 61],
            [5, 27, 33, 49, 63]
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
    },
    '7': {
        num: '7',
        numeros: [
            [7, 28, 36, 57, 72],
            [14, 21, 40, 54, 64],
            [13, 20, 'FREE', 59, 68],
            [15, 27, 38, 60, 65],
            [11, 23, 42, 56, 71]
        ]
    },
    '32': {
        num: '32',
        numeros: [
            [6, 19, 41, 59, 66],
            [14, 25, 35, 47, 65],
            [11, 28, 'FREE', 60, 71],
            [1, 30, 44, 46, 72],
            [15, 27, 40, 53, 74]
        ]
    },
    '36': {
        num: '36',
        numeros: [
            [7, 24, 43, 50, 72],
            [10, 25, 41, 47, 61],
            [2, 27, 'FREE', 53, 63],
            [12, 16, 45, 52, 67],
            [6, 18, 36, 49, 71]
        ]
    }
};

const GRID_SIZE = 5;
const BINGO_COLUMNS = [
    { letter: 'B', minimum: 1, maximum: 15 },
    { letter: 'I', minimum: 16, maximum: 30 },
    { letter: 'N', minimum: 31, maximum: 45 },
    { letter: 'G', minimum: 46, maximum: 60 },
    { letter: 'O', minimum: 61, maximum: 75 }
];

function validateCartonDefinitions(cartons) {
    Object.entries(cartons).forEach(([id, carton]) => {
        const validGrid = Array.isArray(carton.numeros)
            && carton.numeros.length === GRID_SIZE
            && carton.numeros.every((row) => Array.isArray(row) && row.length === GRID_SIZE);

        if (!validGrid || carton.num !== id || carton.numeros[2][2] !== 'FREE') {
            throw new Error(`El cartón ${id} debe tener una cuadrícula válida de 5×5 y espacio libre al centro.`);
        }

        const numbersByColumn = Array.from({ length: GRID_SIZE }, () => new Set());
        carton.numeros.forEach((row, rowIndex) => row.forEach((value, columnIndex) => {
            if (rowIndex === 2 && columnIndex === 2) {
                return;
            }

            const column = BINGO_COLUMNS[columnIndex];
            if (!Number.isInteger(value)
                || value < column.minimum
                || value > column.maximum
                || numbersByColumn[columnIndex].has(value)) {
                throw new Error(`El número del cartón ${id} no corresponde a su columna BINGO.`);
            }
            numbersByColumn[columnIndex].add(value);
        }));
    });
}

validateCartonDefinitions(BASE_CARTONES);

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
                'XXXXX',
                'X...X',
                'XXXXX',
                'X...X',
                'X...X'
            ] },
            { id: 'letter-b', name: 'Letra B', shape: [
                'XXXXX',
                'X...X',
                'XXXXX',
                'X...X',
                'XXXXX'
            ] },
            { id: 'letter-c', name: 'Letra C', shape: [
                'XXXXX',
                'X....',
                'X....',
                'X....',
                'XXXXX'
            ] },
            { id: 'letter-d', name: 'Letra D', shape: [
                'XXXXX',
                'X...X',
                'X...X',
                'X...X',
                'XXXXX'
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
                'XXXXX',
                'X....',
                'X....'
            ] },
            { id: 'letter-g', name: 'Letra G', shape: [
                'XXXXX',
                'X....',
                'X.XXX',
                'X...X',
                'XXXXX'
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
            { id: 'letter-o', name: 'Letra O', shape: [
                'XXXXX',
                'X...X',
                'X...X',
                'X...X',
                'XXXXX'
            ] },
            { id: 'letter-p', name: 'Letra P', shape: [
                'XXXXX',
                'X...X',
                'XXXXX',
                'X....',
                'X....'
            ] },
            { id: 'letter-q', name: 'Letra Q', shape: [
                '.XXX.',
                'X...X',
                'X...X',
                'X.XXX',
                '.XXXX'
            ] },
            { id: 'letter-r', name: 'Letra R', shape: [
                'XXXXX',
                'X...X',
                'XXXXX',
                'X..X.',
                'X...X'
            ] },
            { id: 'letter-s', name: 'Letra S', shape: [
                'XXXXX',
                'X....',
                'XXXXX',
                '....X',
                'XXXXX'
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
                'XXXXX'
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

function validatePatternGroups(groups) {
    const options = groups.flatMap((group) => group.options);
    const letters = options.filter((option) => option.id.startsWith('letter-'));
    const expectedLetterIds = Array.from({ length: 26 }, (_, index) => (
        `letter-${String.fromCharCode(97 + index)}`
    ));

    if (letters.length !== expectedLetterIds.length || letters.some((letter, index) => (
        letter.id !== expectedLetterIds[index]
    ))) {
        throw new Error('Los patrones de letras deben incluir A-Z en orden, sin letras faltantes.');
    }

    options.forEach((option) => {
        if (option.id === 'none') {
            return;
        }

        const isCompleteGrid = Array.isArray(option.shape)
            && option.shape.length === GRID_SIZE
            && option.shape.every((row) => (
                typeof row === 'string'
                && row.length === GRID_SIZE
                && /^[X.]+$/.test(row)
            ))
            && option.shape.some((row) => row.includes('X'));

        if (!isCompleteGrid) {
            throw new Error(`El patrón "${option.name}" debe tener una figura válida de 5×5.`);
        }
    });
}

validatePatternGroups(PATTERN_GROUPS);

const PATTERN_DEFINITIONS = Object.fromEntries(
    PATTERN_GROUPS.flatMap((group) => group.options)
        .filter((option) => option.shape)
        .map((option) => [option.id, cellsFromShape(option.shape)])
);

const state = {
    currentPattern: 'none',
    selectedThemeId: DEFAULT_THEME_ID,
    selectedChipId: DEFAULT_CHIP_ID,
    cardCounter: 0
};

function getDefaultSession() {
    return {
        cards: [
            { cartonId: '21' }
        ],
        selectedCartonId: '21',
        selectedThemeId: DEFAULT_THEME_ID,
        selectedChipId: DEFAULT_CHIP_ID,
        currentPattern: 'none'
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

        const validPattern = parsed.currentPattern === 'none'
            || Object.prototype.hasOwnProperty.call(PATTERN_DEFINITIONS, parsed.currentPattern);

        return {
            cards: parsed.cards
                .filter((card) => card && BASE_CARTONES[String(card.cartonId)])
                .map((card) => ({
                    cartonId: String(card.cartonId),
                    marked: Array.isArray(card.marked)
                        ? [...new Set(card.marked.map(Number).filter((index) => Number.isInteger(index) && index >= 0 && index < GRID_SIZE ** 2))]
                        : []
                })),
            selectedCartonId: BASE_CARTONES[String(parsed.selectedCartonId)]
                ? String(parsed.selectedCartonId)
                : '21',
            selectedThemeId: CARD_THEMES[parsed.selectedThemeId] ? parsed.selectedThemeId : DEFAULT_THEME_ID,
            selectedChipId: CHIP_THEMES[parsed.selectedChipId] ? parsed.selectedChipId : DEFAULT_CHIP_ID,
            currentPattern: validPattern ? parsed.currentPattern : 'none'
        };
    } catch (error) {
        return null;
    }
}

function saveSession() {
    const cards = Array.from(document.querySelectorAll('.bingo-card')).map((card) => ({
        cartonId: card.dataset.cartonId,
        marked: Array.from(card.querySelectorAll('.bingo-cell.is-marked'))
            .map((cell) => Number(cell.dataset.cellIndex))
    }));

    const payload = {
        cards,
        selectedCartonId: getSelectedCartonId(),
        selectedThemeId: state.selectedThemeId,
        selectedChipId: state.selectedChipId,
        currentPattern: state.currentPattern
    };

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        setSessionStatus('Guardado en este dispositivo');
    } catch (error) {
        setSessionStatus('No se pudo guardar esta partida', true);
    }
}

function setSessionStatus(message, hasError = false) {
    const status = document.getElementById('sessionStatus');
    if (!status) {
        return;
    }

    status.dataset.state = hasError ? 'error' : 'saved';
    const messageElement = status.querySelector('.status-message');
    if (messageElement) {
        messageElement.textContent = message;
    }
}

function getSelectedCartonId() {
    const select = document.getElementById('cartonSelect');
    return select ? select.value : null;
}

function renderColorButtons(themes, selectedId, dataAttribute) {
    return Object.entries(themes).map(([themeId, theme]) => (
        `<button class="color-btn" type="button" data-${dataAttribute}="${themeId}" aria-label="${theme.name}" title="${theme.name}" aria-pressed="${themeId === selectedId}" style="--swatch:${theme.swatch};"></button>`
    )).join('');
}

function applyCardTheme(cardElement, themeId) {
    const theme = CARD_THEMES[themeId] || CARD_THEMES[DEFAULT_THEME_ID];
    const resolvedThemeId = CARD_THEMES[themeId] ? themeId : DEFAULT_THEME_ID;

    cardElement.dataset.themeId = resolvedThemeId;
    cardElement.style.setProperty('--card-highlight', theme.highlight);
    cardElement.style.setProperty('--card-base', theme.base);
    cardElement.style.setProperty('--card-border', theme.border);
}

function setSelectedTheme(themeId) {
    if (!CARD_THEMES[themeId]) {
        return;
    }

    state.selectedThemeId = themeId;
    document.querySelectorAll('#cardThemeOptions .color-btn').forEach((themeButton) => {
        themeButton.setAttribute('aria-pressed', String(themeButton.dataset.themeId === themeId));
    });

    document.querySelectorAll('.bingo-card').forEach((card) => applyCardTheme(card, themeId));
}

function createCardElement(cartonId, options = {}) {
    const cartonData = BASE_CARTONES[cartonId];
    if (!cartonData) {
        return null;
    }

    const cardElement = document.createElement('article');
    cardElement.className = 'bingo-card';
    cardElement.dataset.cartonId = cartonId;
    state.cardCounter += 1;
    cardElement.id = `card-instance-${state.cardCounter}`;
    const cardTitleId = `${cardElement.id}-title`;

    const gridHTML = cartonData.numeros
        .flatMap((row, rowIndex) => row.map((value, columnIndex) => {
            const cellIndex = rowIndex * GRID_SIZE + columnIndex;
            const isFreeSpace = value === 'FREE';
            const cellContent = isFreeSpace ? '🦁' : String(value);
            const className = isFreeSpace ? 'bingo-cell free-space' : 'bingo-cell';
            const accessibleNumber = isFreeSpace ? 'espacio libre' : `número ${value}`;
            return `<button class="${className}" type="button" data-cell-index="${cellIndex}" aria-pressed="false" aria-label="Cartón ${cartonData.num}, columna ${BINGO_COLUMNS[columnIndex].letter}, ${accessibleNumber}"><span class="cell-number">${cellContent}</span><span class="pattern-guide" aria-hidden="true"></span></button>`;
        }))
        .join('');

    cardElement.innerHTML = `
        <header class="carton-top-bar">
            <div class="carton-heading">
                <span class="carton-kicker">CARTÓN</span>
                <h3 class="carton-header" id="${cardTitleId}">N.º ${cartonData.num}</h3>
            </div>
            <button class="btn-remove" type="button" aria-label="Quitar cartón ${cartonData.num}" title="Quitar cartón">×</button>
        </header>
        <div class="bingo-title-grid" aria-hidden="true">
            <span>B</span><span>I</span><span>N</span><span>G</span><span>O</span>
        </div>
        <div class="ranges-row" aria-hidden="true">
            ${BINGO_COLUMNS.map((column) => `<span>${column.minimum} AL ${column.maximum}</span>`).join('')}
        </div>
        <div class="bingo-grid" role="group" aria-label="Casillas del cartón ${cartonData.num}">${gridHTML}</div>
    `;
    cardElement.setAttribute('aria-labelledby', cardTitleId);

    applyCardTheme(cardElement, state.selectedThemeId);
    return cardElement;
}

function markSavedCells(cardElement, markedIndexes = []) {
    if (!Array.isArray(markedIndexes) || markedIndexes.length === 0) {
        return;
    }

    const marked = new Set(markedIndexes.map(Number));
    cardElement.querySelectorAll('.bingo-cell').forEach((cell) => {
        if (marked.has(Number(cell.dataset.cellIndex))) {
            cell.classList.add('is-marked');
            cell.setAttribute('aria-pressed', 'true');
        }
    });
}

function addCard(id = null, options = {}) {
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
    updatePattern(state.currentPattern, false);
    updateCardsSummary();

    if (persist) {
        saveSession();
    }
}

function updateCardsSummary() {
    const count = document.querySelectorAll('#cardsContainer .bingo-card').length;
    const countLabel = count === 1 ? 'cartón' : 'cartones';
    const countValue = document.getElementById('cardCount');
    const summary = document.getElementById('cardsSummary');
    const emptyState = document.getElementById('emptyState');
    const resetButton = document.getElementById('resetCardsButton');

    if (countValue) {
        countValue.textContent = String(count);
    }

    if (summary) {
        summary.textContent = `${count} ${countLabel} ${count === 1 ? 'activo' : 'activos'}`;
    }

    if (emptyState) {
        emptyState.hidden = count > 0;
    }

    if (resetButton) {
        resetButton.disabled = document.querySelectorAll('.bingo-cell.is-marked').length === 0;
    }
}

function toggleCell(cell) {
    if (!cell || !cell.classList.contains('bingo-cell')) {
        return;
    }

    const isMarked = cell.classList.toggle('is-marked');
    cell.setAttribute('aria-pressed', String(isMarked));
    updateCardsSummary();
    if (isMarked) {
        createConfetti(cell);
    }

    saveSession();
}

function createConfetti(cell) {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const colors = ['#fdd835', '#ff6b6b', '#4dd0e1', '#81c784', '#ba68c8', '#ffb74d'];
    const confettiLayer = document.createElement('span');
    confettiLayer.className = 'confetti-layer';

    for (let index = 0; index < 10; index += 1) {
        const piece = document.createElement('span');
        piece.className = 'confetti-piece';
        piece.style.setProperty('--x', `${(Math.random() * 120 - 60).toFixed(2)}px`);
        piece.style.setProperty('--y', `${(Math.random() * 120 - 60).toFixed(2)}px`);
        piece.style.setProperty('--rotation', `${(Math.random() * 360).toFixed(2)}deg`);
        piece.style.setProperty('--confetti-color', colors[index % colors.length]);
        confettiLayer.appendChild(piece);
    }

    cell.appendChild(confettiLayer);
    setTimeout(() => confettiLayer.remove(), 700);
}

function resetAll() {
    document.querySelectorAll('.bingo-cell.is-marked').forEach((cell) => {
        cell.classList.remove('is-marked');
        cell.setAttribute('aria-pressed', 'false');
    });
    document.querySelectorAll('.confetti-layer').forEach((layer) => layer.remove());
    updateCardsSummary();
    saveSession();
}

function setChipColor(themeId) {
    const theme = CHIP_THEMES[themeId];
    if (!theme) {
        return;
    }

    state.selectedChipId = themeId;
    document.documentElement.style.setProperty('--chip-color', theme.fill);
    document.documentElement.style.setProperty('--chip-border', theme.border);
    document.documentElement.style.setProperty('--chip-glow', theme.glow);

    document.querySelectorAll('#chipOptions .color-btn').forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.chipId === themeId));
    });
}

function getPatternCells(cells, pattern) {
    const indices = PATTERN_DEFINITIONS[pattern];
    if (!indices) {
        return [];
    }

    return [...new Set(indices.map((index) => cells[index]).filter(Boolean))];
}

function updatePattern(pattern, shouldSave = true) {
    const validPattern = pattern === 'none'
        || Object.prototype.hasOwnProperty.call(PATTERN_DEFINITIONS, pattern);
    state.currentPattern = validPattern ? pattern : 'none';

    const patternSelect = document.getElementById('patternSelect');
    if (patternSelect) {
        patternSelect.value = state.currentPattern;
    }

    document.querySelectorAll('.bingo-cell').forEach((cell) => cell.classList.remove('guide-active'));

    if (state.currentPattern === 'none') {
        if (shouldSave) {
            saveSession();
        }
        return;
    }

    document.querySelectorAll('.bingo-grid').forEach((grid) => {
        const cells = Array.from(grid.querySelectorAll('.bingo-cell'));
        const guideCells = getPatternCells(cells, state.currentPattern);
        guideCells.forEach((cell) => cell.classList.add('guide-active'));
    });

    if (shouldSave) {
        saveSession();
    }
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

    themeOptions.innerHTML = renderColorButtons(CARD_THEMES, state.selectedThemeId, 'theme-id');
}

function populateChipOptions() {
    const chipOptions = document.getElementById('chipOptions');
    if (!chipOptions) {
        return;
    }

    chipOptions.innerHTML = renderColorButtons(CHIP_THEMES, state.selectedChipId, 'chip-id');
}

function restoreSession() {
    const savedSession = loadSession();
    const session = savedSession || getDefaultSession();
    const selectedThemeId = CARD_THEMES[session.selectedThemeId] ? session.selectedThemeId : DEFAULT_THEME_ID;
    const selectedChipId = CHIP_THEMES[session.selectedChipId] ? session.selectedChipId : DEFAULT_CHIP_ID;

    setSelectedTheme(selectedThemeId);
    setChipColor(selectedChipId);
    populateCartonSelect(session.selectedCartonId);

    state.currentPattern = session.currentPattern || 'none';
    session.cards.forEach((card) => {
        if (!BASE_CARTONES[card.cartonId]) {
            return;
        }

        addCard(card.cartonId, {
            marked: card.marked,
            persist: false
        });
    });

    updatePattern(state.currentPattern, false);
    updateCardsSummary();

    if (!savedSession) {
        saveSession();
    }
}

function bindEvents() {
    const cartonSelect = document.getElementById('cartonSelect');
    const patternSelect = document.getElementById('patternSelect');
    const chipOptions = document.getElementById('chipOptions');
    const cardThemeOptions = document.getElementById('cardThemeOptions');
    const addButton = document.getElementById('addCartonButton');
    const resetButton = document.getElementById('resetCardsButton');
    const cardsContainer = document.getElementById('cardsContainer');

    addButton?.addEventListener('click', () => addCard());
    resetButton?.addEventListener('click', resetAll);
    patternSelect?.addEventListener('change', (event) => updatePattern(event.target.value));

    chipOptions?.addEventListener('click', (event) => {
        const button = event.target.closest('.color-btn');
        if (!button) {
            return;
        }

        setChipColor(button.dataset.chipId);
        saveSession();
    });

    cardThemeOptions?.addEventListener('click', (event) => {
        const button = event.target.closest('.color-btn');
        if (!button) {
            return;
        }

        setSelectedTheme(button.dataset.themeId);
        saveSession();
    });

    cartonSelect?.addEventListener('change', saveSession);

    cardsContainer?.addEventListener('click', (event) => {
        const removeButton = event.target.closest('.btn-remove');
        if (removeButton) {
            const card = removeButton.closest('.bingo-card');
            if (card) {
                card.remove();
                updateCardsSummary();
                saveSession();
            }
            return;
        }

        const cell = event.target.closest('.bingo-cell');
        if (cell) {
            toggleCell(cell);
        }
    });
}

function initializeApp() {
    populatePatternSelect();
    populateCardThemeOptions();
    populateChipOptions();
    bindEvents();
    restoreSession();
}

document.addEventListener('DOMContentLoaded', initializeApp);
