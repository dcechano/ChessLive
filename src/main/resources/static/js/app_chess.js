// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js
let board = null;
const game = new Chess();
const whiteSquareGrey = '#a9a9a9';
const blackSquareGrey = '#696969';
const fen = $('#fen');
const pgnLog = document.getElementById('fen-long-form');
const gameData = JSON.parse(document.getElementById('gameAsJSON').value);
const me = document.getElementById('you');
const opponent = document.getElementById('opponent');
const color = gameData.white.username === me.textContent ? 'w' : 'b';
let stompClient = null;


let moveList = [];

function removeGreySquares() {
    $('#board .square-55d63').css('background', '');
}

function greySquare(square) {
    let $square = $('#board .square-' + square)

    let background = whiteSquareGrey
    if ($square.hasClass('black-3c85d')) {
        background = blackSquareGrey
    }

    $square.css('background', background)
}

function onDragStart(source, piece) {
    // do not pick up pieces if the game is over
    if (game.game_over()) {
        console.log('Game is over');
        return false;
    }

    console.log('Game is not over');

    // or if it's not that side's turn
    let regEx = new RegExp(`^${color}`);
    console.log(piece.search(regEx));
    if (game.turn() !== color || piece.search(regEx) === -1) {
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
    let fen = game.fen();
    board.position(fen);
    updatePgn();
    let gameUpdate = new GameUpdate(me.textContent, opponent.textContent, `${source}-${target}`, fen);
    sendData(gameUpdate);
}

function updatePgn() {

    let newMove = game.pgn().split(/(?<!\d\.) /).pop();
    moveList.push(`<li class="fen-link" data-fen="${game.fen()}">${newMove} </li>`);
    fen.html(moveList.join(' '));

    pgnLog.innerHTML = moveList.join(' ');
    addPgnListeners();
}

function addPgnListeners() {
    let node = fen.children();

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
    orientation: gameData.white.username === me.textContent ? 'white' : 'black',
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

    let fen = document.getElementById('fen');
    fen.style.width = newWidth + 'px';
}

function onWindowResize() {
    console.log('window resizing');
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
            console.log("message recieved from the /user/getGame endpoint");
            console.log(JSON.stringify(data.body));
        });

        stompClient.subscribe('/user/queue/update', function (data) {
            let update = JSON.parse(data.body);

            if (update.updateType === null || update.updateType === undefined) {
                throw new Error("The type of update hasn't been set for GameUpdate object");
            }

            if (update.updateType === 'NEW_MOVE') {
                let from_to = update.newMove.split('-');

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
                        // TODO definetly make this more elegant
                        window.alert("Game over");
                    }
                    updatePgn();
                }
            //    TODO figure out what to do here
            } else if(update.updateType === 'RESIGNATION') {
                game.set_resign(true);
                displayResult('Resignation');

            } else if (update.updateType === 'DRAW_OFFER') {
                decideDrawOffer();
            } else if (update.updateType === 'ACCEPT_DRAW') {
                console.log('draw accepted')
                game.set_draw(true);
                displayResult('Draw');
            }
        });
    });

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