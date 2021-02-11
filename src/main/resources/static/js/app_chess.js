// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js
const chess = new Chess();
const Chessground = require('chessground').Chessground;
const pgnLog = document.getElementById('fen-long-form');
const gameData = JSON.parse(document.getElementById('gameAsJSON').value);
const me = document.getElementById('you');
const opponent = document.getElementById('opponent');
const color = gameData.white === me.textContent ? 'white' : 'black';
let stompClient = null;
let moveList = [];
let FENList = [];

let config ={
    orientation: color,
    turnColor: 'white',
    autoCastle: true,
    animation: {
        enabled: true,
        duration: 500
    }, highlight: {
        lastMove: true,
        check: true
    },
    movable: {
        free: false,
        color: color,
        rookCastle: true,
        dests: getValidMoves(chess),
        showDests: true,
        events: {}
    },
    events: {
        move: function (orig, dest) {
            chess.move({from: orig, to: dest});
            let config = {
                turnColor: sideToMove(chess),
                movable: {
                    dests: getValidMoves(chess)
                }
            }
            board.set(config);
            if (!(chess.turn() === color.charAt(0))) {
                let gameUpdate = new GameUpdate(me.textContent,
                    opponent.textContent,
                    `${orig}-${dest}`,
                    chess.fen(),
                    90);

                sendData(gameUpdate);
            }
        }
    }
};

const board = new Chessground(document.getElementById('board'), config);
function sendData(gameUpdate) {
    stompClient.send('/app/updateOpponent', {}, JSON.stringify(gameUpdate));
}


function determineSize() {

    let htmlBoard = document.getElementsByClassName('board-b72b1')[0];
    let oldWidth = htmlBoard.style.width.split('px')[0];

    // + 4 because htmlBoard has a 2px border and content-box box-sizing
    let newWidth = Number(oldWidth) + 4;

    let info = document.getElementsByClassName('user-info');
    for (let arg of info) {
        arg.style.width = newWidth + 'px';
    }

    let pgn = document.getElementById('pgn');
    pgn.style.width = newWidth + 'px';
}

function onWindowResize() {
    // board.resize();
    // determineSize();
}

// determineSize();
window.onresize = onWindowResize;

(function () {
    let socket = new SockJS('/chess-lite');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log(`Logging frame: ${frame}`);

        stompClient.subscribe("/user/getGame", function (data) {
            console.log(JSON.stringify(data.body));
        });

        stompClient.subscribe('/user/queue/update', function (data) {
            let gameUpdate = JSON.parse(data.body);

            if (!gameUpdate.updateType) {
                throw new Error("The type of update hasn't been set for GameUpdate object");
            }

            switch (gameUpdate.updateType) {
                case "NEW_MOVE":
                    processNewMove(gameUpdate);
                    break;

                case "RESIGNATION":
                    processResignation();
                    break;

                case "DRAW_OFFER":
                    decideDrawOffer();
                    break;

                case "ACCEPT_DRAW":
                    acceptDrawOffer();
                    break;
            }


        });
    });

})();

(function () {
    (color === 'white') ? myClock.resume() : opponentClock.resume();
})();

function processNewMove(gameUpdate) {
    opponentClock.pause();
    opponentClock.seconds = gameUpdate.seconds;
    opponentClock.updateDisplay();
    myClock.resume();
    let from_to = gameUpdate.newMove.split('-');

    let move = chess.move({
        from: from_to[0],
        to: from_to[1],
        promotion: 'q'
    });

    if (move === null || move === undefined) {
        window.alert("A invalid move was sent from the server. Game out of sync.");
    } else {

        board.move(from_to[0], from_to[1]);
        if (chess.game_over()) {
            displayResult('Checkmate');
        }
        // updatePgn();
    }

}

function processResignation() {
    stopClocks();
    chess.set_resign(true);
    board.set({viewOnly: true});
    displayResult('Resignation');

    gameData.pgn = chess.history().join(' ');
    gameData.result = `${color} won by resignation`;

    stompClient.send('/app/gameOver', {}, JSON.stringify(gameData));

}

function acceptDrawOffer(){
    stopClocks();
    chess.set_draw(true);
    board.set({viewOnly: true});
    displayResult('Draw');
    gameData.pgn = chess.history().join(' ');
    gameData.result = 'Game drawn by agreement';
    stompClient.send('/app/gameOver', {}, JSON.stringify(gameData));

}

function getValidMoves(chess) {
    var dests = new Map();
    chess.SQUARES.forEach(function (s) {
        var ms = chess.moves({ square: s, verbose: true });
        if (ms.length)
            dests.set(s, ms.map(function (m) { return m.to; }));
    });
    return dests;
}

function sideToMove(chess) {
    return (chess.turn() === 'w') ? 'white' : 'black';
}

function displayResult(result) {
    let game_result = document.getElementById('game_result');
    let currActive = document.getElementsByClassName('active')[0];
    currActive.classList.toggle('active');
    game_result.classList.toggle('active');
    let resultLabel = document.getElementById('result');
    resultLabel.textContent = `Game finished by ${result}`
}

function decideDrawOffer() {
    let draw_decision = document.getElementById('draw_decision');
    let currActive = document.getElementsByClassName('active')[0];
    currActive.classList.toggle('active');
    draw_decision.classList.toggle('active');
}

function stopClocks() {
    myClock.stop();
    opponentClock.stop();
}

module.exports = {
    stompClient: stompClient,
    board: board,
    chess: chess,
    me: me,
    stopClocks: stopClocks,
    displayResult: displayResult,

}