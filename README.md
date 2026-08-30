# Bingo Multicartón

Una pequeña aplicación web de bingo para gestionar varios cartones a la vez, marcar números, aplicar patrones de guía y personalizar la apariencia.

## Características

- Visualización de múltiples cartones simultáneamente
- Marcado y desmarcado de celdas con un solo clic
- Modo de guía con patrones como:
  - Línea horizontal
  - Línea vertical
  - Diagonales
  - X
  - Cruz
  - Columnas B, I, G, O
  - Letra N
  - Letra T
  - 4 esquinas
  - Cartón completo
- Personalización del color de las fichas
- Limpieza general de todos los cartones
- Diseño responsivo para móviles
- Animación de confeti al marcar una celda

## Archivos del proyecto

- `index.html` — estructura principal de la interfaz
- `styles.css` — estilos visuales, responsividad y animaciones
- `script.js` — lógica del juego, generación de cartones y patrones

## Cómo usarlo

1. Abre `index.html` en tu navegador.
2. Selecciona un cartón en el menú desplegable.
3. Haz clic en el botón "Agregar" para cargarlo.
4. Marca los números de cada cartón con clic.
5. Usa el selector de patrones para resaltar guías de juego.
6. Cambia el color de las fichas si lo deseas.

## Estructura del cartón

Cada cartón tiene:

- 5 columnas
- 5 filas
- un espacio libre central
- números distribuidos por rangos tipo BINGO

## Requisitos

No necesita instalación ni dependencias.

Solo requiere un navegador moderno con soporte para JavaScript.

## Ejecutar localmente

Puedes abrirlo directamente en el navegador, o servirlo con un servidor local simple si prefieres:

```bash
python -m http.server 8000
```

Luego abre:

```text
http://localhost:8000
```

## Nota

Este proyecto está pensado como una herramienta visual para cartones físicos o de juego en vivo, no como generador aleatorio de cartones.
