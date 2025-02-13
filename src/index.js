const scale = 2;
const cellRadius = 10;
const cellPlaceSize = (cellRadius + 1) * 2;

let numberOfColumns;
let numberOfRows;

let field;
let fieldCanvas;
let fieldCanvasContext;

addEventListener('load', setFieldSize);
addEventListener('resize', setFieldSize);

function setFieldSize() {
  const fieldWidth = Math.floor((window.innerWidth - 32 * 2) / cellPlaceSize) * cellPlaceSize;
  const fieldHeight = Math.floor((window.innerHeight - 32 * 2) / cellPlaceSize) * cellPlaceSize;

  numberOfColumns = fieldWidth / cellPlaceSize;
  numberOfRows = fieldHeight / cellPlaceSize;

  field = Array.from(Array(numberOfRows), () => new Array(numberOfColumns));

  fieldCanvas = document.querySelector('#field');
  fieldCanvasContext = fieldCanvas.getContext('2d');

  fieldCanvas.style.width = `${fieldWidth}px`;
  fieldCanvas.style.height = `${fieldHeight}px`;
  fieldCanvas.width = fieldWidth * scale;
  fieldCanvas.height = fieldHeight * scale;

  generateRandomField();
  drawField();
}

function drawField() {
  // draw circles
  for (let i = 0; i < numberOfRows; i++) {
    for (let j = 0; j < numberOfColumns; j++) {
      if (field[i][j]) {
        drawCell(i, j);
      }
    }
  }

  fieldCanvasContext.fill();
}

function drawCell(row, column) {
  const x = (column * cellPlaceSize + cellPlaceSize / 2) * scale;
  const y = (row * cellPlaceSize + cellPlaceSize / 2) * scale;

  fieldCanvasContext.moveTo(x, y);
  fieldCanvasContext.arc(x, y, cellRadius * scale, 0, 2 * Math.PI);
  fieldCanvasContext.fillStyle = '#3498db';
}

function generateRandomField() {
  for (let i = 0; i < numberOfRows; i++) {
    for (let j = 0; j < numberOfColumns; j++) {
      if (Math.random() > 0.5) {
        field[i][j] = 1;
      }
    }
  }
}
