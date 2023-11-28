const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer();

server.on('request', (request, response) => {
    const { method, url: requestUrl } = request;
    console.log("Logging " + method + " url: " + requestUrl);
    
    response.writeHead(200, { 'Content-Type': 'application/json' });
    let q = url.parse(requestUrl, true);
    response.write(handleUserAction(q.pathname, q.query));
    response.end();
});

server.on('error', error => console.error(error.stack));

server.listen(3000, "127.0.0.1", () => console.log('Server running at http://127.0.0.1:3000/ - to stop server press Ctrl+C'));

let gameboard = JSON.parse(fs.readFileSync('gameboard.json', 'utf-8'));
let turn;
let totalTurns;
let isActive = false;
let winner = null;

function handleUserAction(urlString, queryString) {
    let clientUrl = urlString.split("/");
    if (clientUrl[1] == "startgame") {
        turn = 1;
        totalTurns = 0;
        isActive = true;
        winner = null;
        // Initialize gameboard
        gameboard.board = gameboard.board.map(() => Array(gameboard.columns).fill(""));
        return JSON.stringify({ "turn": turn, "totalTurns": totalTurns, "board": gameboard.board });
    }
    else if (clientUrl[1] == "gameboard") {
        return JSON.stringify(gameboard.board);
    }
    else if (clientUrl[1] == "state") {
        return JSON.stringify({ "turn": turn, "active": isActive, "winner": winner });
    } 
    else if (clientUrl[1] == "droptoken" && isActive) {
        let col = parseInt(queryString.column);
        if (!isNaN(col) && col >= 0 && col < gameboard.columns) {
            totalTurns += 1;
            turn = evenOrOdd(totalTurns);
            dropToken(col, turn);
            winner = checkWin(gameboard.board);
            if (winner) {
                // isActive = true;
                return JSON.stringify({ "message": `Player ${winner} wins!`, "turn": turn, "totalTurns": totalTurns, "winner": winner });
            } else if (isBoardFull(gameboard.board)) {
                // isActive = true;
                return JSON.stringify({ "message": "Draw!", "turn": turn, "totalTurns": totalTurns, "winner": winner });
            } else {
                return JSON.stringify({ "message": `Player ${turn} played in column ${col}.`, "turn": turn, "totalTurns": totalTurns });
            }
        } else {
            return JSON.stringify({ "message": "Invalid column." });
        }
    }
    else {
        return JSON.stringify({ "message": "Invalid URL" });
    }
}

function evenOrOdd(num) {
    return num % 2 === 0 ? 2 : 1;
}

function dropToken(col, playerToken) {
    for (let row = gameboard.rows - 1; row >= 0; row--) {
        if (!gameboard.board[row][col]) {
            gameboard.board[row][col] = playerToken;
            break;
        }
    }
}

function isBoardFull(board) {
    return board.every(row => row.every(cell => cell));
}

function checkHorizontal(board) {
  // Check each row
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length - 3; c++) {
      if (board[r][c] && board[r][c] === board[r][c+1] && board[r][c] === board[r][c+2] && board[r][c] === board[r][c+3]) {
        return board[r][c]; // return the token of the player that won
      }
    }
  }
  return 0; // no winner found
}

function checkVertical(board) {
  // Check each column
  for (let c = 0; c < board[0].length; c++) {
    for (let r = 0; r < board.length - 3; r++) {
      if (board[r][c] && board[r][c] === board[r+1][c] && board[r][c] === board[r+2][c] && board[r][c] === board[r+3][c]) {
        return board[r][c]; // return the token of the player that won
      }
    }
  }
  return 0; // no winner found
}

function checkDiagonal(board) {
  // Check downward diagonals
  for (let r = 0; r < board.length - 3; r++) {
    for (let c = 0; c < board[0].length - 3; c++) {
      if (board[r][c] && board[r][c] === board[r+1][c+1] && board[r][c] === board[r+2][c+2] && board[r][c] === board[r+3][c+3]) {
        return board[r][c]; // return the token of the player that won
      }
    }
  }

  // Check upward diagonals
  for (let r = 3; r < board.length; r++) {
    for (let c = 0; c < board[0].length - 3; c++) {
      if (board[r][c] && board[r][c] === board[r-1][c+1] && board[r][c] === board[r-2][c+2] && board[r][c] === board[r-3][c+3]) {
        return board[r][c]; // return the token of the player that won
      }
    }
  }

  return 0; // no winner found
}

function checkWin(board) {
    // Check for a win in all directions
    return checkHorizontal(board) || checkVertical(board) || checkDiagonal(board);
}



// Start the server
server.listen(3000, () => {
    console.log('Connect4 server is running on http://localhost:3000');
});  