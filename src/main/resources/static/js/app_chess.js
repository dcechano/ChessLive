// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js
let board = null;
const game = new Chess();
const whiteSquareGrey = '#a9a9a9';
const blackSquareGrey = '#696969';
const pgn = $('#pgn');
const pgnLog = document.getElementById('fen-long-form');
const gameData = JSON.parse(document.getElementById('gameAsJSON').value);
const me = document.getElementById('you');
const opponent = document.getElementById('opponent');
const color = gameData.white === me.textContent ? 'white' : 'black';
let stompClient = null;
console.log(JSON.stringify(gameData));
let moveList = [];
let FENList = [];

function removeGreySquares() {
    $('#board .square-55d63').css('background', '');
}

function greySquare(square) {
    if (!game.game_over()) {
        let $square = $('#board .square-' + square)

        let background = whiteSquareGrey
        if ($square.hasClass('black-3c85d')) {
            background = blackSquareGrey
        }

        $square.css('background', background)
    }
}

function onDragStart(source, piece) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false;

    // or if it's not that side's turn
    let regEx = new RegExp(`^${color[0]}`);
    if (game.turn() !== color[0] || piece.search(regEx) === -1) {
        return false
    }
}

function onDrop(source, target) {
    removeGreySquares()
    // see if the move is legal
    let move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    // illegal move
    if (move === null) {
        return 'snapback';
    }
}

function onMouseoverSquare(square, piece) {
    // get list of possible moves for this square
    let moves = game.moves({
        square: square,
        verbose: true
    })

    // exit if there are no moves available for this square
    if (moves.length === 0) return

    // highlight the square they moused over
    greySquare(square)

    // highlight the possible squares for this piece
    for (let i = 0; i < moves.length; i++) {
        greySquare(moves[i].to)
    }
}

function onMouseoutSquare(square, piece) {
    removeGreySquares()
}

function onSnapEnd(source, target, piece) {
    updatePgn();
    myClock.pause();
    let gameUpdate = new GameUpdate(me.textContent, opponent.textContent,
        `${source}-${target}`, game.fen(), myClock.seconds);
    console.log(gameUpdate);
    opponentClock.resume();
    sendData(gameUpdate);
}

function updatePgn() {
    let newMove = game.pgn().split(/(?<!\d\.) /).pop();
    moveList.push(`<li class="pgn-link" data-fen="${game.fen()}">${newMove} </li>`);
    pgn.html(moveList.join(' '));

    pgnLog.innerHTML = moveList.join(' ');
    addPgnListeners();
}

function addPgnListeners() {
    let node = pgn.children();

    for (let i = 0; i < node.length; i++) {
        node[i].addEventListener('click', function () {
            let pos = node[i].dataset.fen;
            board.position(pos);
        });
    }

    let longform = $('#fen-long-form').children();
    for (let i = 0; i < longform.length; i++) {
        longform[i].addEventListener('click', function () {
            let pos = longform[i].dataset.fen;
            board.position(pos);
        });
    }
}

function sendData(gameUpdate) {
    stompClient.send('/app/updateOpponent', {}, JSON.stringify(gameUpdate.getObj()));
}

const config = {
    orientation: gameData.white === me.textContent ? 'white' : 'black',
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd,
}

board = Chessboard('board', config);

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
    board.resize();
    determineSize();
}

determineSize();
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

            if (gameUpdate.updateType === 'NEW_MOVE') {
                opponentClock.pause();
                opponentClock.seconds = gameUpdate.seconds;
                opponentClock.updateDisplay();
                myClock.resume();
                let from_to = gameUpdate.newMove.split('-');

                let move = game.move({
                    from: from_to[0],
                    to: from_to[1],
                    promotion: 'q'
                });

                if (move === null || move === undefined) {
                    window.alert("A invalid move was sent from the server. Game out of sync.");
                } else {
                    board.position(game.fen());
                    if (game.game_over()) {
                        displayResult('Checkmate');
                    }
                    updatePgn();
                }
            } else if(gameUpdate.updateType === 'RESIGNATION') {
                stopClocks();
                game.set_resign(true);
                displayResult('Resignation');

                gameData.pgn = game.history().join(' ');
                gameData.result = `${color} won by resignation`;

                stompClient.send('/app/gameOver', {}, JSON.stringify(gameData));

            } else if (gameUpdate.updateType === 'DRAW_OFFER') {
                decideDrawOffer();
            } else if (gameUpdate.updateType === 'ACCEPT_DRAW') {
                stopClocks();
                game.set_draw(true);

                displayResult('Draw');
                gameData.pgn = game.history().join(' ');
                gameData.result = 'Game drawn by agreement';
                stompClient.send('/app/gameOver', {}, JSON.stringify(gameData));

            }
        });
    });

})();

(function () {
    (color === 'white') ? myClock.resume() : opponentClock.resume();
})();

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