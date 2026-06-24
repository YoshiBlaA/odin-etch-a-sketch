# Etch-a-Sketch

Cuadrícula de dibujo en el navegador hecha con JS vanilla y manipulación del DOM. Pasa el cursor sobre las celdas para colorearlas y cambia el tamaño de la cuadrícula en tiempo real. Proyecto del path Foundations de [The Odin Project](https://www.theodinproject.com/).

---

## Lo que aprendí

- **Manipulación del DOM**: crear, insertar y eliminar nodos dinámicamente con `createElement`, `appendChild` y `remove`.
- **Event listeners**: uso de `addEventListener` con `mouseover` para interactividad en tiempo real.
- **NodeList estática vs. viva**: `querySelectorAll` devuelve una foto congelada del DOM. Los nodos eliminados con `.remove()` desaparecen visualmente pero siguen vivos en memoria, lo que puede causar operaciones involuntarias sobre nodos fantasma.
- **Validación de input**: uso de `isFinite` y condiciones compuestas para rechazar valores no numéricos, negativos o iguales al estado actual.
- **Redimensionamiento dinámico**: cálculo del tamaño de cada celda en función de un canvas de tamaño fijo (`CANVAS_SIZE / cols`).

---

## Créditos

- Proyecto propuesto por [The Odin Project](https://www.theodinproject.com/) — Foundations Path.