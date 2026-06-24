let squareSize = 32;

let cols = 16;
let rows = 16;

const CANVAS_SIZE = squareSize * 16;

const canvas = document.querySelector("div#canvas");
canvas.style.width = `${CANVAS_SIZE}px`;
canvas.style.height = `${CANVAS_SIZE}px`;

drawInitGrid();

canvas.style.width = "max-content";

const btnChangeSize = document.querySelector("button#btnSquareNumbers");
btnChangeSize.addEventListener("click", drawNewGrid);

//--------------------------------------------------------------
//                  F U N C T I O N S
//--------------------------------------------------------------

/**
 * Dibuja la cuadrícula inicial de 16x16 al cargar la página.
 * Itera sobre el número de filas y delega la creación de cada
 * una a `createFilledRows`.
 */
function drawInitGrid(){
    for(let row = 0; row < rows; row++){
        createFilledRows(row);
    }
}

/**
 * Solicita al usuario un nuevo tamaño de cuadrícula y redibuja
 * el canvas ajustando filas, columnas y tamaño de cada cuadro.
 *
 * - Si el nuevo número es mayor al actual → agrega filas y columnas.
 * - Si el nuevo número es menor al actual → elimina filas y columnas.
 * - Valida que el input sea numérico, mayor a 0 y distinto al tamaño actual.
 *
 * Modifica las variables globales `cols`, `rows` y `squareSize`.
 */
function drawNewGrid(){
    const userSquaresNumber = Number(prompt("Type "));
    
    if(isFinite(userSquaresNumber) && userSquaresNumber > 0 && userSquaresNumber != cols){
        const subCanvasNodeList = document.querySelectorAll(".subcanvas");

        const actualSquaresNumber = cols;
        
        cols = userSquaresNumber;
        rows = userSquaresNumber;

        squareSize = CANVAS_SIZE / cols;

        const newSquaresNumber = actualSquaresNumber - userSquaresNumber;

        if(newSquaresNumber < 0){
            console.log(`Add ${Math.abs(newSquaresNumber)} more squares`);
            resizeSquares(squareSize);
            appendExtraSquares(Math.abs(newSquaresNumber), subCanvasNodeList);
        }
        else{
            console.log(`Remove ${newSquaresNumber} existing squares`);
            removeSquares(newSquaresNumber, subCanvasNodeList);
            resizeSquares(squareSize);            
        }
        
        return;
    }
    
    alert("El valor debe ser numérico y mayor a 0. \nAdemás no debe de ser igual al numero de cuadrados por lado actuales.");
}

/**
 * Crea un elemento div que representa un cuadro individual de la cuadrícula.
 * Le asigna clases CSS, dimensiones actuales y un listener que lo colorea
 * de azul al pasar el cursor encima.
 *
 * @param {number} col - Índice de la columna a la que pertenece el cuadro.
 *                       Se usa para asignar la clase CSS `col{n}`.
 * @returns {HTMLDivElement} El cuadro creado, listo para insertarse en el DOM.
 */
function createSquare(col){
    const square = document.createElement("div");
    square.setAttribute("class", `square col${col}`);
    square.style.width = `${squareSize}px`;
    square.style.height = `${squareSize}px`;

    square.addEventListener("mouseover", () => {
        square.style.backgroundColor = "blue";
    }); 

    return square;
}

/**
 * Elimina filas y columnas sobrantes cuando el usuario reduce el tamaño
 * de la cuadrícula.
 *
 * Estrategia:
 * 1. Elimina las primeras `squaresPerRowCol` filas (subcanvases) del DOM.
 * 2. En las filas restantes, elimina los primeros `squaresPerRowCol` cuadros
 *    de cada una.
 *
 * Usa la NodeList estática recibida como parámetro para evitar operar
 * sobre nodos ya eliminados del DOM.
 *
 * @param {number} squaresPerRowCol - Cantidad de filas/columnas a eliminar.
 * @param {NodeList} subCanvasNodeList - Snapshot estático de todos los
 *                                       subcanvases antes de la operación.
 */
function removeSquares(squaresPerRowCol, subCanvasNodeList){

    const deletedSubCanvNodeList = subCanvasNodeList.slice(0, squaresPerRowCol);
    for(const subCanv of deletedSubCanvNodeList){
        subCanv.remove();
    }

    const newSubCanvNodeList = subCanvasNodeList.slice(squaresPerRowCol);

    newSubCanvNodeList.forEach(subCanvas => {
        for(let col = 0; col < squaresPerRowCol; col++){
            const square = subCanvas.querySelector(".square");
            square.remove();
        }
    });
}

/**
 * Redimensiona todos los cuadros existentes en el canvas al nuevo tamaño.
 * Se llama cada vez que cambia el número de cuadros por lado, para que
 * todos quepan dentro del CANVAS_SIZE fijo.
 *
 * @param {number} newSize - Nuevo ancho y alto en píxeles para cada cuadro.
 */
function resizeSquares(newSize){
    const allSquaresNodeList = document.querySelectorAll(".square");
    allSquaresNodeList.forEach(square => {
        square.style.width = newSize + 'px';
        square.style.height = newSize + 'px';
    });
}

/**
 * Agrega filas y columnas nuevas cuando el usuario aumenta el tamaño
 * de la cuadrícula.
 *
 * Estrategia:
 * 1. A cada subcanvas existente le añade `extraCols` cuadros nuevos al final.
 * 2. Crea `extraCols` filas nuevas completas (con el nuevo total de columnas).
 *
 * @param {number} extraCols - Cantidad de columnas/filas adicionales a agregar.
 * @param {NodeList} subcanvasNodeList - Snapshot estático de los subcanvases
 *                                       existentes antes de agregar los nuevos.
 */
function appendExtraSquares(extraCols, subcanvasNodeList){
    const actualRowsCols = subcanvasNodeList.length;

    subcanvasNodeList.forEach(subCanvas => {
        for(let col = actualRowsCols; col < (actualRowsCols + extraCols); col++){
            const square = createSquare(col);
            subCanvas.appendChild(square);
        }
    });
    
    for(let row = actualRowsCols; row < actualRowsCols + extraCols; row++){
        createFilledRows(row);
    }
}

/**
 * Crea una fila completa (subcanvas) y la agrega al canvas principal.
 * La fila es un div flex que contiene `cols` cuadros generados con `createSquare`.
 *
 * @param {number} row - Índice de la fila. Se usa para asignar la clase CSS `row{n}`.
 */
function createFilledRows(row){
    const subCanvas = document.createElement("div");
    subCanvas.setAttribute("class", `subcanvas row${row}`);
    subCanvas.style.display = "flex";

    for(let col = 0; col < cols; col++){
        const square = createSquare(col);
        subCanvas.appendChild(square);
    }
    canvas.appendChild(subCanvas);
}