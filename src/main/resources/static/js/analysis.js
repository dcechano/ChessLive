let board = null;
const game = new Chess();
const whiteSquareGrey = '#a9a9a9';
const blackSquareGrey = '#696969';
const pgn = $('#pgn');
const pgnLog = document.getElementById('fen-long-form');
const gameData = JSON.parse(document.getElementById('gameAsJSON').value);
const opponent = document.getElementById('opponent');
let moveList = [];

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
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
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

const config = {
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
}

function onWindowResize() {
    board.resize();
    determineSize();
}

(function () {
    for (let m of gameData.pgn.split(' ')) {
        game.move(m);
        console.log(game.ascii());
        moveList.push(`<li class="pgn-link" data-fen="${game.fen()}">${m} </li>`);

    }
    board.position(game.fen());
    // let moves = game.pgn().split(/(?<!\d\.) /);
    // for (let m of moves) {
    //     // TODO fix. game.fen() returns the final position not current pos of ${m}.
    //     moveList.push(`<li class="pgn-link" data-fen="${game.fen()}">${m} </li>`);
    // }
    pgn.html(moveList.join(' '));

    pgnLog.innerHTML = moveList.join(' ');
    addPgnListeners();
    determineSize();
    window.onresize = onWindowResize;

})();