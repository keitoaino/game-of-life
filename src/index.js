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

  field = Array.from({ length: numberOfColumns }, () => new Array(numberOfRows).fill(0));

  fieldCanvas = document.querySelector('#field');
  fieldCanvasContext = fieldCanvas.getContext('2d');

  fieldCanvas.style.width = `${fieldWidth}px`;
  fieldCanvas.style.height = `${fieldHeight}px`;
  fieldCanvas.width = fieldWidth * scale;
  fieldCanvas.height = fieldHeight * scale;

  generateRandomField();
  drawField();

  setInterval(gameTick, 500);
}

function drawField() {
  fieldCanvasContext.beginPath();
  fieldCanvasContext.clearRect(0, 0, fieldCanvas.width, fieldCanvas.height);

  for (let i = 0; i < numberOfColumns; i++) {
    for (let j = 0; j < numberOfRows; j++) {
      if (field[i][j]) {
        drawCell(i, j);
      }
    }
  }

  fieldCanvasContext.fill();
}

function drawCell(column, row) {
  const x = (column * cellPlaceSize + cellPlaceSize / 2) * scale;
  const y = (row * cellPlaceSize + cellPlaceSize / 2) * scale;

  fieldCanvasContext.moveTo(x, y);
  fieldCanvasContext.arc(x, y, cellRadius * scale, 0, 2 * Math.PI);
  fieldCanvasContext.fillStyle = '#3498db';
}

function gameTick() {
  const newField = Array.from({ length: numberOfColumns }, () => new Array(numberOfRows).fill(0));

  for (let i = 0; i < numberOfColumns; i++) {
    for (let j = 0; j < numberOfRows; j++) {
      const numberOfNeighbours = getNumberOfNeighbours(i, j);

      const toBeBorn = !field[i][j] && (numberOfNeighbours === 3);
      const stayAlive = field[i][j] && ((numberOfNeighbours === 2) || (numberOfNeighbours === 3));

      newField[i][j] = (toBeBorn || stayAlive) ? 1 : 0;
    }
  }

  for (let i = 0; i < numberOfColumns; i++) {
    for (let j = 0; j < numberOfRows; j++) {
      field[i][j] = newField[i][j];
    }
  }

  drawField();
}

function generateRandomField() {
  for (let i = 0; i < numberOfColumns; i++) {
    for (let j = 0; j < numberOfRows; j++) {
      field[i][j] = Math.random() > 0.5 ? 1 : 0;
    }
  }
}

function getNumberOfNeighbours(x, y) {
  const prevX = getNormalizedCoordinate(x - 1, numberOfColumns);
  const nextX = getNormalizedCoordinate(x + 1, numberOfColumns);
  const prevY = getNormalizedCoordinate(y - 1, numberOfRows);
  const nextY = getNormalizedCoordinate(y + 1, numberOfRows);

  return [
    field[prevX][prevY],
    field[prevX][y],
    field[prevX][nextY],
    field[x][prevY],
    field[x][nextY],
    field[nextX][prevY],
    field[nextX][y],
    field[nextX][nextY],
  ].reduce((a, b) => a + b);
}

function getNormalizedCoordinate(coordinate, size) {
  return (coordinate + size) % size;
}
