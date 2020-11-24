// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js
let board = null;
const game = new Chess();
const whiteSquareGrey = '#a9a9a9';
const blackSquareGrey = '#696969';
const pgn = $('#pgn');
const pgnLog = document.getElementById('pgn-long-form');
let id = 1;

let moveList = [];
const evansGambit = [
    '[Event "Casual Game"]',
    '[Site "Berlin GER"]',
    '[Date "1852.??.??"]',
    '[EventDate "?"]',
    '[Round "?"]',
    '[Result "1-0"]',
    '[White "Adolf Anderssen"]',
    '[Black "Jean Dufresne"]',
    '[ECO "C52"]',
    '[WhiteElo "?"]',
    '[BlackElo "?"]',
    '[PlyCount "47"]',
    '',
    '1. e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 Bxb4 5.c3 Ba5 6.d4 exd4 7.O-O',
    'd3 8. Qb3 Qf6 9.e5 Qg6 10.Re1 Nge7 11.Ba3 b5 12.Qxb5 Rb8 13.Qa4',
    'Bb6 14. Nbd2 Bb7 15.Ne4 Qf5 16.Bxd3 Qh5 17.Nf6+ gxf6 18.exf6',
    'Rg8 19.Rad1 Qxf3 20.Rxe7+ Nxe7 21.Qxd7+ Kxd7 22.Bf5+ Ke8',
    '23.Bd7+ Kf8'
]


function removeGreySquares() {
    $('#board .square-55d63').css('background', '')
}

function greySquare(square) {
    var $square = $('#board .square-' + square)

    var background = whiteSquareGrey
    if ($square.hasClass('black-3c85d')) {
        background = blackSquareGrey
    }

    $square.css('background', background)
}

function onDragStart(source, piece) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false

    // or if it's not that side's turn
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false
    }
}

function onDrop(source, target) {
    removeGreySquares()
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    // illegal move
    if (move === null) return 'snapback'
}

function onMouseoverSquare(square, piece) {
    // get list of possible moves for this square
    var moves = game.moves({
        square: square,
        verbose: true
    })

    // exit if there are no moves available for this square
    if (moves.length === 0) return

    // highlight the square they moused over
    greySquare(square)

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to)
    }
}

function onMouseoutSquare(square, piece) {
    removeGreySquares()
}

function onSnapEnd() {
    board.position(game.fen());
    updatePgn();
}

function updatePgn() {
    let newMove = game.pgn().split(/(?<!\d\.) /).pop();
    moveList.push(`<li class="fen-link" data-fen="${game.fen()}">${newMove} </li>`);
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

    let longform = $('#pgn-long-form').children();
    for (let i = 0; i < longform.length; i++) {
        longform[i].addEventListener('click', function () {
            let pos = longform[i].dataset.fen;
            board.position(pos);
        });
    }
}

function sendData() {
    stompClient.send('/app/game/1', {}, JSON.stringify({'pgn': game.fen()}));
}

const config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
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
    console.log('window resizing');
    board.resize();
    determineSize();
}

determineSize();
window.onresize = onWindowResize;
