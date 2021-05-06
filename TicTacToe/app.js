/*****ELEMENTS*****/
const turnIndicator = document.querySelector('#turnIndicator');
const cells = document.querySelectorAll('.cell');

const previousBtn = document.querySelector('#previousBtn');
const nextBtn = document.querySelector('#nextBtn');
const resetBtn = document.querySelector('#resetBtn');

/*****VARIABLES*****/
let gameHistory = [];
let moves = 0;
let xTurn = true;
let currentPlayer = '';
let occupiedCells = 0;
let previousPlayer = '';

let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

/*****EVENT LISTENERS*****/

//add event listener for each cell
for (let cell of cells) {
    cell.addEventListener('click', play);
}

previousBtn.addEventListener('click', () => { //previous button
    nextBtn.style.display = 'block';
    let lastMove = gameHistory.length - 1;
    console.log(gameHistory[lastMove]);
    for (let cell of cells) {
        console.log(cell.classList[1]);
    }
});

function undo() {
    if (moves > 0) {
        position--;
    }
};

function redo() {
    if (moves < gameHistory.length - 1) {
        position++;
    }
}



nextBtn.addEventListener('click', () => { //next button
    console.log('next');
})

/********
    a. restarts the game
    b. hides the next and prev buttons
    c. clears move history *********/

resetBtn.addEventListener('click', () => { //reset button
    // clear all Xs and Os
    for (let cell of cells) {
        let classList = cell.classList;
        if (classList.length = 3) {
            classList.remove(classList[2]);
        } else {
            return;
        }
    }
    //start with x turn again
    xTurn = true;
    updatePlayer('X');
    //remove previous and next buttons
    previousBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    //add event listener to cells
    isGameOver(false);

    //clears game history
    occupiedCells = 0;
    gameHistory = [];
    console.clear();
})

/*****FUNCTIONS*****/

function play(e) {
    const cell = e.target; //know wich cell was clicked
    const classList = e.target.classList; //check list of classes
    const row = classList[1]; //select second class as identifier of cell row location
    //adds an extra class to cell depending on if xturn is true (X), if false (O)
    const player = classList[2];
    if (player === 'X' || player === 'O') { //if class already contains x or o, do nothing
        return;
    }
    else if (xTurn) { // if x's turn
        classList.add('X'); //add x class (displays x in cell)
        addMove(row, 'X'); //add current x move to array
        updatePlayer('O'); //change turn indicator to o's turn
        xTurn = !xTurn; //x turn ends
        occupiedCells++;
        previousPlayer = 'X';
    } else { //if o's turn
        classList.add('O'); //add o class (displays o in cell)
        addMove(row, 'O'); //add current o move to array
        updatePlayer('X'); //change turn indicator to x's turn
        xTurn = !xTurn; //back to x turn
        occupiedCells++;
        previousPlayer = '0';
    }
    isWinner(); //check if any player has won the game
}

// add move to array
function addMove(row, player) {
    let rowIndex = parseInt(row);
    //coordinates of cell
    if (rowIndex === 0 || rowIndex === 1 || rowIndex === 2) { //if cell 0, 1, 2 was played
        let row = 0; //set row to 0
        if (rowIndex === 0) { //if cell 0
            let column = 0; //set column to 1
            saveMove(row, column, player); //saves location and player to array
        } else if (rowIndex === 1) {
            let column = 1;
            saveMove(row, column, player);
        } else {
            let column = 2;
            saveMove(row, column, player);
        }
    } else if (rowIndex === 3 || rowIndex === 4 || rowIndex === 5) { //if cell 3, 4, 5 was played
        let row = 1;
        if (rowIndex === 3) {
            let column = 0;
            saveMove(row, column, player);
        } else if (rowIndex === 4) {
            let column = 1;
            saveMove(row, column, player);
        } else {
            let column = 2;
            saveMove(row, column, player);
        }
    } else { //if cell 6, 7, 8 was played
        let row = 2;
        if (rowIndex === 6) {
            let column = 0;
            saveMove(row, column, player);
        } else if (rowIndex === 7) {
            let column = 1;
            saveMove(row, column, player);
        } else {
            let column = 2;
            saveMove(row, column, player);
        }
    }
}

//stores each move in move array
function saveMove(row, column, player) {
    let move = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    let moveCopy = [...move];
    board[row].splice(column, 1, player); //saves move to board array
    moveCopy[row][column] = player;
    gameHistory.push(moveCopy);
}

//changes turn indicator to player's turn
function updatePlayer(player) {
    turnIndicator.textContent = `${player}'s Turn`;
    currentPlayer = player;
}

//check if a player has won
function isWinner() {
    //store player if x or o or undefined
    const cell0 = cells[0].classList[2];
    const cell1 = cells[1].classList[2];
    const cell2 = cells[2].classList[2];
    const cell3 = cells[3].classList[2];
    const cell4 = cells[4].classList[2];
    const cell5 = cells[5].classList[2];
    const cell6 = cells[6].classList[2];
    const cell7 = cells[7].classList[2];
    const cell8 = cells[8].classList[2];

    const winningConditions = [
        //all three cells in any row are the same
        [cell0, cell1, cell2],
        [cell3, cell4, cell5],
        [cell6, cell7, cell8],
        //all three cells in any column are the same
        [cell0, cell3, cell6],
        [cell1, cell4, cell7],
        [cell2, cell5, cell8],
        //all three cells diagonally are the same
        [cell0, cell4, cell8],
        [cell2, cell4, cell6]
    ];

    // //check if any winning condition is fulfilled
    winningConditions.some((cell) => {
        if (cell[0] && cell[0] === cell[1] && cell[0] === cell[2]) {
            turnIndicator.textContent = `${cell[0]} has won!`;
            isGameOver(true);
            //display previous button
            previousBtn.style.display = 'block';
            return cell;
        } else {
            isDraw();
        }
    })
}

//checks if game is a draw - all cells are occupied and no winning combination
function isDraw() {
    if (occupiedCells === 9 && !isGameOver()) {
        turnIndicator.textContent = 'DRAW';
        previousBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        isGameOver(true);
    };
}

//if game is over, disable event listener on each cell
function isGameOver(status) {
    if (!status) {
        for (let cell of cells) {
            cell.addEventListener('click', play);
        }
    } else {
        for (let cell of cells) {
            cell.removeEventListener('click', play);
        }
    }
}