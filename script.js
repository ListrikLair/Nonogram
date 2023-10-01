// model
app = document.getElementById('app');
const model = {
    data: {
        gameChosen: false,
        gridSize: null,
        colorActive: false,
        inputValue: 'X',
        newGame: true,
    }
}


// view
updateView();
function updateView() {
    if (model.data.gameChosen == false) {
        createStartPageHtml();
    } else if(model.data.newGame == true) {
        createGamePageHtml();
    } else {return;}
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
    <div id="gameGrid" style="grid-template-columns: repeat(${model.data.gridSize}, 2rem); grid-template-rows: repeat(${model.data.gridSize}, 2rem);">${createGameHtml()}</div>
        <button onclick="swapColor()">■ / X</button>
        <div>${model.data.inputValue}</div>
    `;
    model.data.newGame = false;
}

function createGameHtml() {
    let gameHtml = '';
    for (i = 0; i < model.data.gridSize*model.data.gridSize; i++) {
        gameHtml += /*HTML*/`
        <div id="${i}" onclick="fillCell(${i})"></div>
        `;
    } return gameHtml;
}

// controller
function chooseGame(gameSize) {
    model.data.gameChosen = true;
    model.data.gridSize = gameSize;
    app.innerHTML = '';
    randomizeCells();
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
    updateView();
}

function fillCell(cellIndex){
    if(document.getElementById(cellIndex).innerHTML != ''){
        document.getElementById(cellIndex).innerHTML = '';
        return;
    }
    if(model.data.inputValue == 'X'){
        document.getElementById(cellIndex).innerHTML = 'X';
    } else {
        document.getElementById(cellIndex).innerHTML = '■';
    }
    updateView();
}

function randomizeCells(){
    let cellNumb = (model.data.gridSize*model.data.gridSize)* 0.7;
    for (i = 0; i < cellNumb; i++){
        let randomCell = Math.floor(Math.random()*cellNumb);
        // document.getElementById(randomCell).classList.add('coloredCell');
    }
}