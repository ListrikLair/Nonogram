// model
app = document.getElementById('app');
const model = {
    data: {
        gameChosen: false,
        gridSize: null,
        colorActive: true,
        inputValue: '■',
        newGame: true,
        lives: 3,
        topRowIndex: 0,
    },
    puzzle: {
        answer: [],
        yourAnswer: [],
        topRowNumbers: [
            [1,1,2,1], [1], [], [], [], [], [], [], [], [], [], [], [], [], []
        ],
        leftRowNumbers: []
    }
}


// view
updateView();
function updateView() {
    if (model.data.gameChosen == false) {
        createStartPageHtml();
    } else if (model.data.newGame == true) {
        createGamePageHtml();
    } else { createButtonHtml(); }
}

function updateDataView() {
    document.getElementById('currentInput').innerHTML = model.data.inputValue;
    document.getElementById('livesLeft').innerHTML = 'Mistakes left: ' + model.data.lives;

}

function createStartPageHtml() {
    app.innerHTML = /*HTML*/ `
    <h1>Choose your game</h1>
    <div>
        <button onclick="chooseGame(3)">3x3</button>
        <button onclick="chooseGame(5)">5x5</button>
        <button onclick="chooseGame(10)">10x10</button>
        <button onclick="chooseGame(15)">15x15</button>
    </div>
`;
}

function createGamePageHtml() {
    app.innerHTML += /*HTML*/`
    <div id="topRow" style="grid-template-columns: repeat(${model.data.gridSize}, 2rem);">${createTopRowHtml()}</div>
    <div id="leftRow" style="grid-template-rows: repeat(${model.data.gridSize}, 2rem);">${createTopRowHtml()}</div>
    <div id="gameGrid" style="grid-template-columns: repeat(${model.data.gridSize}, 2rem); grid-template-rows: repeat(${model.data.gridSize}, 2rem);">${createGameHtml()}</div>
    <div>${createButtonHtml()}</div>
    `;
    model.data.newGame = false;
}

function createTopRowHtml() {
    let html = '';
    for (let i = 0; i < model.data.gridSize; i++) {
        html += /*HTML*/`
        <div id="topRow${i}">${model.puzzle.topRowNumbers[0][i]}</div>
        `;
    } return html;
}

function createLeftRowHtml() {
    let html = '';
    for (let i = 0; i < model.data.gridSize; i++) {
        html += /*HTML*/`
        <div id="leftRow${i}">${model.puzzle.leftRowNumbers[0][i]}</div>
        `;
    } return html;
}

function createGameHtml() {
    let gameHtml = '';
    for (let i = 0; i < model.data.gridSize * model.data.gridSize; i++) {
        gameHtml += /*HTML*/`
        <div id="${i}" onclick="fillCell(${i})"></div>
        `;
    } return gameHtml;
}

function createButtonHtml() {
    html = '';
    html += /*HTML*/`
        <button onclick="swapColor()">■ / X</button>
        <div id="currentInput">${model.data.inputValue}</div>
        <div id="livesLeft">Mistakes left: ${model.data.lives}</div>
    `;
    return html;
}

// controller
function chooseGame(gameSize) {
    model.data.gameChosen = true;
    model.data.gridSize = gameSize;
    app.innerHTML = '';
    updateView();
    randomizeCells();
    document.getElementById('gameGrid', 'topRow', 'leftRow').classList.add('gameGrid' + gameSize);
    // document.getElementById('topRow').classList.add('gameGrid' + gameSize);
    // document.getElementById('leftRow').classList.add('gameGrid' + gameSize);
    updateView();
}

function swapColor() {
    if (model.data.colorActive != false) {
        model.data.colorActive = false;
        model.data.inputValue = 'X';
    } else {
        model.data.colorActive = true;
        model.data.inputValue = '■';
    }
    updateDataView();
}

function fillCell(cellIndex) {
    cellI = document.getElementById(cellIndex);
    if (cellI.innerHTML == '' && cellI.style.background != 'black') {
        checkIfRight(cellIndex);
    }
    if (cellI.innerHTML != '' || cellI.style.background == 'black') {
        cellI.innerHTML = '';
        cellI.style.background = '';
        indexInArray = model.puzzle.yourAnswer.indexOf(cellIndex);
        model.puzzle.yourAnswer.splice(indexInArray, 1)
        checkIfWin();
        return;
    }
    if (model.data.inputValue == 'X') {
        cellI.innerHTML = 'X';
    } else {
        cellI.style.background = 'black';
        model.puzzle.yourAnswer.push(cellIndex);
        checkIfWin();
    }
    updateDataView();
}

function randomizeCells() {
    let cellNumb = (model.data.gridSize * model.data.gridSize) * 0.7;
    for (let i = 0; i < cellNumb; i++) {
        let randomCell = Math.floor(Math.random() * (model.data.gridSize * model.data.gridSize));
        document.getElementById(randomCell).classList.add('coloredCell');
        if (model.puzzle.answer.includes(randomCell)) {
        } else {
            model.puzzle.answer.push(randomCell);
        }
    }
    sortArrays();
    calculateNumbers();
    updateView();
}

function checkIfRight(cellIndex) {
    if (model.data.inputValue == '■') {
        if (document.getElementById(cellIndex).classList.contains('coloredCell')) {
            checkIfWin();
            return;
        } else {
            model.data.lives -= 1;
            if (model.data.lives == 0) {
                alert("You lose!");
                resetGame();
            }
        }
    }
    updateDataView();
}

function sortArrays() {
    model.puzzle.answer.sort();
    model.puzzle.answer.sort(compareNumbers);
    model.puzzle.yourAnswer.sort();
    model.puzzle.yourAnswer.sort(compareNumbers);
}

function compareNumbers(a, b) {
    return a - b;
}

function checkIfWin() {
    sortArrays();
    if (model.puzzle.answer.toString() == model.puzzle.yourAnswer.toString()) {
        alert("You Win");
        resetGame();
    }
}

function resetGame() {
    model.data.gameChosen = false;
    model.data.colorActive = true;
    model.data.inputValue = '■';
    model.data.newGame = true;
    model.data.lives = 3;
    model.puzzle.answer = [];
    model.puzzle.yourAnswer = [];
    updateView();
}

function calculateNumbers() {
    for (let i = 0; i < model.data.gridSize; i++) {
        // if (model.puzzle.answer[i] % model.data.gridSize == i % model.data.gridSize){
        calculateColumns(i);
    }
}

function calculateColumns(columnIndex) {
    for (let i = columnIndex; i < model.data.gridSize * model.data.gridSize; i += model.data.gridSize) {
        let idNumber = i + (columnIndex * model.data.gridSize);
        if (document.getElementById(idNumber).classList.contains('coloredCell')) {
            if (model.puzzle.answer.includes((model.puzzle.answer[i]) - model.data.gridSize && i > 0)) {
                model.puzzle.topRowNumbers[0][model.data.topRowIndex - (model.data.gridSize)] += 1;
            } else {
                model.puzzle.topRowNumbers[0][model.data.topRowIndex].push(1);
            }
        }
    }
    model.data.topRowIndex += 1;
}