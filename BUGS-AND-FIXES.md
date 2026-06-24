# Bugs y soluciones

## Bug #1 — Typo: `width` duplicado

### Problema
```js
canvas.style.width = `${CANVAS_SIZE}px`;
canvas.style.width = `${CANVAS_SIZE}px`;  // ← debía ser height
```
La segunda línea sobreescribía `width` en lugar de asignar `height`.

### Fix
```js
canvas.style.width = `${CANVAS_SIZE}px`;
canvas.style.height = `${CANVAS_SIZE}px`;
```

---

## Bug #2 — `removeSquares`: operaciones sobre nodos fantasma

### Concepto clave
`querySelectorAll` devuelve una **NodeList estática**: una foto congelada del DOM en el momento en que se ejecutó. Los `.remove()` posteriores desconectan el nodo del árbol visual, pero el objeto JavaScript sigue vivo en memoria y sigue siendo accesible desde cualquier variable que lo referencie.

### Problema
```js
function removeSquares(squaresPerRowCol, subCanvasNodeList){

    // Parte 1: eliminar filas
    for(let row = 0; row < squaresPerRowCol; row++){
        const subCanvas = document.querySelector(".subcanvas"); // ← siempre agarra el primero del DOM
        subCanvas.remove();
    }

    // Parte 2: eliminar columnas
    subCanvasNodeList.forEach(subCanvas => {  // ← itera los 16, incluyendo los ya eliminados
        for(let col = 0; col < squaresPerRowCol; col++){
            const square = subCanvas.querySelector(".square");
            square.remove();  // ← opera sobre nodos fantasma (fuera del DOM pero vivos en memoria)
        }
    });
}
```

El código funcionaba "por suerte": las filas correctas se eliminaban accidentalmente, y el `forEach` hacía trabajo inútil sobre nodos ya desconectados.

### Fix
```js
function removeSquares(squaresPerRowCol, subCanvasNodeList){

    // Parte 1: eliminar filas de forma intencional
    const deletedSubCanvNodeList = subCanvasNodeList.slice(0, squaresPerRowCol);
    for(const subCanv of deletedSubCanvNodeList){
        subCanv.remove();
    }

    // Parte 2: eliminar columnas solo de los subcanvases que quedan
    const newSubCanvNodeList = subCanvasNodeList.slice(squaresPerRowCol);
    newSubCanvNodeList.forEach(subCanvas => {
        for(let col = 0; col < squaresPerRowCol; col++){
            const square = subCanvas.querySelector(".square");
            square.remove();
        }
    });
}
```

---

## Bug #3 — `Math.abs` en lugar de multiplicar por -1

### Problema
```js
appendExtraSquares((newSquaresNumber*(-1)), subCanvasNodeList);
```

### Fix
```js
appendExtraSquares(Math.abs(newSquaresNumber), subCanvasNodeList);
```
Más legible e intencional. `Math.abs` comunica claramente la intención: "quiero el valor absoluto".

---

## Bug #4 — Doble punto y coma en `resizeSquares`

```js
square.style.height = newSize + 'px';;  // ← doble ;;
```
Menor, pero ruido innecesario.

---

## Lección principal

> `.remove()` desconecta un nodo del DOM (deja de verse), pero el objeto JavaScript sigue vivo en memoria. Si tienes una referencia a él (como en una NodeList estática), puedes seguir operando sobre él — e incluso reinsertarlo al DOM con `appendChild` o `insertBefore`.