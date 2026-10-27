# Bingo

Aplicación de bingo multicartón, hecha con HTML, CSS y JavaScript sin dependencias.

## Uso

Abre `index.html` en el navegador. La primera visita inicia con el cartón 21; después se recuperan los cartones, marcas, colores y guía de juego guardados en ese navegador.

- Añade cualquiera de los cartones definidos en `script.js`.
- Pulsa una casilla o usa el teclado para marcarla.
- Cambia la guía, el color general de los cartones o el color de las fichas desde el panel.
- Usa **Borrar todas las marcas** para comenzar otra ronda conservando los cartones.

Los datos se guardan localmente con `localStorage`; no se envían a un servidor.

## Mantenimiento

- `BASE_CARTONES` contiene las tablas y valida la cuadrícula, el espacio libre, los rangos BINGO y los números repetidos por columna.
- `PATTERN_GROUPS` contiene las guías. Al iniciar, se valida que cada forma sea 5×5 y que el abecedario incluya A–Z en orden.
- `index.html` contiene la estructura accesible; `styles.css` contiene los estilos responsive y de movimiento reducido.
