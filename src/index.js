const colorPeterRiver = '#3498db';

const scale = 2;
const cellRadius = 10;
const cellPlaceSize = (cellRadius + 1) * 2;

const playPauseButtonState = {
  play: 'play_circle',
  pause: 'pause_circle',
};

let numberOfColumns;
let numberOfRows;

let field;
let fieldCanvas;
let fieldCanvasContext;

const minInterval = 50;
const maxInterval = 1000;
let tickInterval = 500;
let tickIntervalId;

addEventListener('load', setUpListeners);
addEventListener('load', setFieldSize);
addEventListener('resize', setFieldSize);

function setUpListeners() {
  const playPauseButton = document.querySelector('#play-pause');
  const tickIntervalSlider = document.querySelector('#tick-interval');

  playPauseButton.addEventListener('click', () => {
    if (tickIntervalId) {
      clearInterval(tickIntervalId);
      tickIntervalId = undefined;
      playPauseButton.textContent = playPauseButtonState.play;
    } else {
      tickIntervalId = setInterval(gameTick, tickInterval);
      playPauseButton.textContent = playPauseButtonState.pause;
    }
  });

  tickIntervalSlider.addEventListener('input', (event) => {
    tickInterval = minInterval + maxInterval - event.target.value;

    if (tickIntervalId) {
      clearInterval(tickIntervalId);
      tickIntervalId = setInterval(gameTick, tickInterval);
    }
  });
}

function setFieldSize() {
  const fieldWidth = Math.floor(window.innerWidth / cellPlaceSize) * cellPlaceSize;
  const fieldHeight = Math.floor(window.innerHeight / cellPlaceSize) * cellPlaceSize;

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
  fieldCanvasContext.fillStyle = colorPeterRiver;
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
