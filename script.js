function createPlayer(name, symbol) {
    let score = 0;
    const getPoints = () => score;
    const winPoints = () => score++;
    return {name, symbol, getPoints, winPoints}
}

const gameController = (function () {
    //for winning plays: all 3 in a row, so iterate through 3x3 array if all cells along a row are the same
    //and columns, but for diagonals, iterate through each column and row and check if row+1 is the same as row, continue
    //-1 in array indicates empty space

    let turnOrder = true; //set to boolean to allow for alternating turn order: true is P1, false is P2;
    const turnText = document.getElementById("turn");
    let gameEnded = false;

    const playerOne = createPlayer('', '❌');
    const playerTwo = createPlayer('', '⭕');
    
    const playerOneText = document.getElementById("p-one");
    const playerTwoText = document.getElementById("p-two");

    const setTurnOrder = () => {
        const num = Math.floor(Math.random(0,1) * 2);
        //starting turn order
        if(num == 1) {
            turnText.textContent = `${playerOne.name}'s turn. (❌)`
            turnOrder = false;
        }
        else {
            turnText.textContent = `${playerTwo.name}'s turn. (⭕)`
            turnOrder = true;
        }
    }

    const initializeGame = () => {

        playerOne.name = document.getElementById("player-one").value;
        playerTwo.name = document.getElementById("player-two").value;

        let playerOneTitle = `${playerOne.name}: ${playerOne.getPoints()}`;
        let playerTwoTitle = `${playerTwo.name}: ${playerTwo.getPoints()}`;

        playerOneText.textContent = playerOneTitle;
        playerTwoText.textContent = playerTwoTitle;
        
        setTurnOrder();

        //creating the board
        for(let i = 0; i< 9; i++) {
            const box = document.createElement("div");
            box.id = "box", box.className = `box${i}`;
            box.classList.add("box");
            document.getElementById("container").appendChild(box);
            box.addEventListener("click", () => {
                if(box.textContent == '') {
                    if(!gameEnded) {
                        turnOrder ? box.textContent = "⭕" : box.textContent = "❌";
                        turnOrder ? turnText.textContent = `${playerOne.name}'s turn. (❌)` : turnText.textContent = `${playerTwo.name}'s turn. (⭕)`;
                        turnOrder = !turnOrder;

                        const boxIndex = parseInt(box.className[3]);

                        const rowNum = Math.floor(boxIndex / 3) + 1;
                        const colNum = boxIndex % 3 + 1;
                        
                        turnOrder ? addSymbol(rowNum, colNum, playerOne.symbol) : addSymbol(rowNum, colNum, playerTwo.symbol);
                    }
                }
            })
        }
    };

    let gameBoard = [[-1,-1,-1], 
                     [-1,-1,-1], 
                     [-1,-1,-1]];
    
    const addSymbol = (row, col, symbol) => {
        if(row > 3 || row < 1 || col > 3 || row < 1) {
            console.error("Row or column are out of bounds.")
        }
        else {
            gameBoard[row-1][col-1] = symbol.toLowerCase();
            checkGameStatus();
        }
    };

    const checkGameStatus = () => {
        let filledRows = 0;

        for(let i=0; i< 3; i++) {
            //checks for if three across a row was achieved
            if(gameBoard[i].every((cell) => cell === "❌")) {
                turnText.textContent = `${playerOne.name} has won the game! Press space to reset the board.`
                playerOne.winPoints();
                gameEnded = true;
                break;
            }
            else if(gameBoard[i].every((cell) => cell === "⭕")) {
                turnText.textContent = `${playerTwo.name} has won the game! Press space to reset the board.`
                playerTwo.winPoints();
                gameEnded = true;
                break;
            }
            //check if three across a column was achieved
            else if(gameBoard[0][i] == gameBoard[1][i] && gameBoard[0][i] == gameBoard[2][i] && typeof(gameBoard[0][i]) == "string") {
                turnText.textContent = `${gameBoard[0][i]} has won the game! Press space to reset the board.`
                if (gameBoard[0][i] === "❌") {
                    turnText.textContent = `${playerOne.name} has won the game! Press space to reset the board.`
                    playerOne.winPoints();
                }
                else {
                    turnText.textContent = `${playerTwo.name} has won the game! Press space to reset the board.`
                    playerTwo.winPoints();
                }
                gameEnded = true;
                break;
            }
            //check for amount of filled rows, to use to discover when draw is reached
            if(gameBoard[i].every((cell) => cell != -1)) {
                filledRows++;
                //check for draw
                if(filledRows === 3) {
                    turnText.textContent = `Game has been drawn! Press space to reset the board.`
                    gameEnded = true;
                }
            }
        }
        //check for diagonal across left to right
        if((gameBoard[0][0] == gameBoard[1][1] && gameBoard[1][1] == gameBoard[2][2] && typeof(gameBoard[1][1]) == "string") || (gameBoard[0][2] == gameBoard[1][1] && gameBoard[1][1] == gameBoard[2][0]) && typeof(gameBoard[1][1]) == "string") {
            //[1][1] used as is common element for both conditional statements
            if (gameBoard[1][1] === "❌") {
                turnText.textContent = `${playerOne.name} has won the game! Press space to reset the board.`
                playerOne.winPoints();
            }
            else {
                turnText.textContent = `${playerTwo.name} has won the game! Press space to reset the board.`
                playerTwo.winPoints();
            }
            gameEnded = true;
        }

        let playerOneTitle = `${playerOne.name}: ${playerOne.getPoints()}`;
        let playerTwoTitle = `${playerTwo.name}: ${playerTwo.getPoints()}`;

        playerOneText.textContent = playerOneTitle;
        playerTwoText.textContent = playerTwoTitle;

        if(gameEnded) {
            document.addEventListener('keydown', resetHandler);
        }
    }

    let resetHandler = (event) => {
        if(event.key == " ") {
            setTurnOrder();
            resetBoard();
        }
    }

    const resetBoard = () => {
        const boxes = document.getElementsByClassName("box");
        Array.from(boxes).forEach((box) => {
            box.textContent = "";
        });

        gameBoard = [[-1,-1,-1], 
                     [-1,-1,-1], 
                     [-1,-1,-1]];
        
        document.removeEventListener('keydown', resetHandler);
        gameEnded = false;
    }

    return {initializeGame}
})();   

//initiate the game upon loading

const form = document.getElementById("settings")
form.addEventListener("close", () => {
    gameController.initializeGame();
});