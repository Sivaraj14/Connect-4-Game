const playerRed = "R";
const playerYellow = "Y";
let currPlayer = playerRed;
let gameOver = false;
let board;
const rows = 6;
const columns = 7;
let currColumns = [];

const dropSound = document.getElementById("dropSound");
const winSound = document.getElementById("winSound");

const boardElem = document.getElementById("board");
const winnerElem = document.getElementById("winner");
const playerIndicator = document.getElementById("player-indicator");
const statusElem = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const redNameInput = document.getElementById("playerRedName");
const yellowNameInput = document.getElementById("playerYellowName");
const darkModeToggle = document.getElementById("darkModeToggle");

window.onload = () => {
    setGame();
    resetBtn.onclick = resetGame;
    darkModeToggle.onclick = toggleDarkMode;
};

function setGame() {
    board = [];
    currColumns = new Array(columns).fill(rows - 1);
    boardElem.innerHTML = "";
    winnerElem.innerText = "";
    winnerElem.style.fontSize = "";
    gameOver = false;

    currPlayer = playerRed;
    updatePlayerIndicator();

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            row.push(" ");
            const tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            tile.classList.add("tile");
            tile.addEventListener("click", setPiece);
            boardElem.appendChild(tile);
        }
        board.push(row);
    }
}

function updatePlayerIndicator() {
    let name = currPlayer === playerRed ? redNameInput.value.trim() || "Red" : yellowNameInput.value.trim() || "Yellow";
    playerIndicator.innerText = name;
    playerIndicator.style.color = currPlayer === playerRed ? "red" : "gold";
    playerIndicator.className = currPlayer === playerRed ? "red" : "yellow";

    // Background color changes
    document.body.style.backgroundColor = currPlayer === playerRed ? "#ffdddd" : "#ffffcc";

    statusElem.innerHTML = `<span id="player-indicator" class="${playerIndicator.className}">${name}</span>'s turn`;
}

function setPiece() {
    if (gameOver) return;

    const [_, c] = this.id.split("-").map(Number);
    let r = currColumns[c];
    if (r < 0) return;

    // Place piece
    board[r][c] = currPlayer;
    const tile = document.getElementById(`${r}-${c}`);

    // Play drop sound clone (to allow overlapping)
    const soundClone = dropSound.cloneNode();
    soundClone.play();

    if (currPlayer === playerRed) {
        tile.classList.add("red-piece");
        currPlayer = playerYellow;
    } else {
        tile.classList.add("yellow-piece");
        currPlayer = playerRed;
    }

    currColumns[c] = r - 1;

    updatePlayerIndicator();

    checkWinner();
}

function checkWinner() {
    // Horizontal
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (
                board[r][c] !== " " &&
                board[r][c] === board[r][c + 1] &&
                board[r][c] === board[r][c + 2] &&
                board[r][c] === board[r][c + 3]
            ) {
                highlightWinner([[r, c], [r, c + 1], [r, c + 2], [r, c + 3]]);
                setWinner(r, c);
                return;
            }
        }
    }

    // Vertical
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            if (
                board[r][c] !== " " &&
                board[r][c] === board[r + 1][c] &&
                board[r][c] === board[r + 2][c] &&
                board[r][c] === board[r + 3][c]
            ) {
                highlightWinner([[r, c], [r + 1, c], [r + 2, c], [r + 3, c]]);
                setWinner(r, c);
                return;
            }
        }
    }

    // Diagonal down-right
    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (
                board[r][c] !== " " &&
                board[r][c] === board[r + 1][c + 1] &&
                board[r][c] === board[r + 2][c + 2] &&
                board[r][c] === board[r + 3][c + 3]
            ) {
                highlightWinner([[r, c], [r + 1, c + 1], [r + 2, c + 2], [r + 3, c + 3]]);
                setWinner(r, c);
                return;
            }
        }
    }

    // Diagonal up-right
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (
                board[r][c] !== " " &&
                board[r][c] === board[r - 1][c + 1] &&
                board[r][c] === board[r - 2][c + 2] &&
                board[r][c] === board[r - 3][c + 3]
            ) {
                highlightWinner([[r, c], [r - 1, c + 1], [r - 2, c + 2], [r - 3, c + 3]]);
                setWinner(r, c);
                return;
            }
        }
    }

    // Check draw (all top rows full)
    if (currColumns.every(c => c < 0)) {
        winnerElem.innerText = "It's a Draw!";
        winnerElem.style.fontSize = "2.5rem";
        gameOver = true;
    }
}

function highlightWinner(coords) {
    coords.forEach(([r, c]) => {
        const tile = document.getElementById(`${r}-${c}`);
        tile.classList.add("winner");
    });
}

function setWinner(r, c) {
    gameOver = true;
    const winner = board[r][c] === playerRed ? "Red" : "Yellow";
    const name =
        winner === "Red" ? redNameInput.value.trim() || "Red" : yellowNameInput.value.trim() || "Yellow";

    winnerElem.innerText = `${name} Wins! 🎉`;
    winnerElem.style.fontSize = "3.5rem";

    // Play win sound
    const soundClone = winSound.cloneNode();
    soundClone.play();

    statusElem.innerText = "";
}

function resetGame() {
    setGame();
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}
