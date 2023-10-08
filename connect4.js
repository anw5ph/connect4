const http = require('http')
const url = require('url')

const server = http.createServer();

server.on('request', (request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    let q = url.parse(request.url, true);
    response.write(handleUserAction(q.pathname, q.query));
    response.end();
});

server.on('request', (request, response) => {
    const { method, url } = request;
    console.log(" logging " + method + " url: " + url);
})

server.on('error', error => console.error(error.stack));

server.listen(3000, "127.0.0.1", () => console.log('Server running at http://127.0.0.1:3000/ - to stop server press Ctrl+C'));

let turn;
let totalTurns;
let col; 
let isActive = true;
let winner = false;

function handleUserAction(urlString, queryString) {
    let clientUrl = urlString.split("/");
    // What does my url look like? http://localhost:8080/api/gameboard
    if (clientUrl[1] == "startgame") {
        turn = 1;
        totalTurns = 0;
        return JSON.stringify({ "turn": turn, "totalTurns": totalTurns});
    }
    else if (clientUrl[1] == "gameboard") {
        return "gameboard";
    }
    else if (clientUrl[1] == "state") {
        return JSON.stringify({ "turn": turn, "active": isActive, "totalTurns": winner});
        // return {
        //     "turn": turn,
        //     "active": isActive,
        //     "winner": winner
        // }
    } 
    else if (clientUrl[1] == "droptoken") {
        console.log(queryString);
        col = queryString.column;
        totalTurns += 1;
        turn = evenOrOdd(totalTurns);
        

        return JSON.stringify({"message": "Player " + turn + " played in column " + col + ".", "turn": turn, "totalTurns": totalTurns});
    }
    else {
        return "Invalid URL";
    }
}

function evenOrOdd(num) {
    if (num % 2 == 0) {
        return 2;
    }
    else {
        return 1;
    }
}

// 1. Let player make move
// 2. Check if move is valid
// 3. Check if move is winning move
// 4. Check if board is full
// 5. If not full, switch player
// 6. If full, game is over
// 7. If not full, go to step 1

// initialize game variables
// current_player = Player1

// while true:
    // Step 1: Let player make a move
//     player_move = get_player_move(current_player)

     // Step 2: Check if the move is valid
//     if is_valid_move(player_move):
         // Step 3: Check if the move is a winning move
//         if is_winning_move(player_move):
//             display_winner(current_player)
//             break
//         else:
             // Step 4: Check if the board is full
//             if is_board_full():
//                 display_draw()
//                 break
//             else:
//                 // Step 5: If not full, switch player
//                 switch_player()

//     // Step 7: If not full, go to step 1
//     else:
//         display_invalid_move_message()



/////////////////////////// Notes ///////////////////////////
//if (clientUrl[1] == "gameboard") {
    //     console.log("gameboard requested");
    //     return "gameboard";
    // } else if (clientUrl[1] == "move") {
    //     console.log("move");
    //     return "move";
    // } else if (clientUrl[1] == "data") {
    //     let stringData = "Jurassic 5";
    //     let arrayData = ["Run DMC", "LL Cool J", "Big Daddy Kane"]
    //     let dataContainer = {}
    //     dataContainer['oneGroup'] = stringData;
    //     dataContainer['twoGroup'] = arrayData;
    //     return JSON.stringify(dataContainer);
    // } else {
    //     return "";
    // }
/////////////////////////////////////////////////////////////