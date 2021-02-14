
const chess = new Chess();
const Chessground = require('chessground').Chessground;
const pgnLog = document.getElementById('pgn-long-form');
const gameData = JSON.parse(document.getElementById('gameAsJSON').value);
const me = document.getElementById('you');
const opponent = document.getElementById('opponent');
const color = gameData.white === me.textContent ? 'white' : 'black';
let stompClient = null;
let moveList = [];

let config ={
    orientation: 'white',
    turnColor: 'white',
    autoCastle: true,
    animation: {
        enabled: true,
        duration: 250
    }, highlight: {
        lastMove: true,
        check: true
    },
    movable: {
        free: false,
        color: 'both',
        rookCastle: true,
        dests: getValidMoves(chess),
        showDests: true,
        events: {}
    },
    events: {
        // move: function (orig, dest) {
        //     let moveObj = chess.move({from: orig, to: dest});
        //     if (chess.game_over()) {
        //         processGameOver();
        //     }
        //
        //
        //     let config = {
        //         turnColor: sideToMove(chess),
        //         movable: {
        //             dests: getValidMoves(chess)
        //         }
        //     }
        //     board.set(config);
        //     if (!(chess.turn() === color.charAt(0))) {
        //         myClock.pause();
        //         opponentClock.resume();
        //         let gameUpdate = new GameUpdate(me.textContent,
        //             opponent.textContent,
        //             `${orig}-${dest}`,
        //             chess.fen(),
        //             myClock.seconds);
        //
        //         sendData(gameUpdate);
        //     }
        //     moveList.push(moveObj.san);
        //     updatePgnLog();
        // }
    }
};

const board = new Chessground(document.getElementById('board'), config);

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
    gameData.pgn.split(' ').forEach(move => {
        let moveObj = chess.move(move);
        console.log(moveObj);
        moveList.push(move);
        updatePgnLog();
    });

    let pgnNodes = document.getElementsByClassName('pgn-link');
    for (let node of pgnNodes) {
        node.addEventListener('click', (e) => {
            e.preventDefault();
            board.set({fen: node.dataset.fen})
        });
    }

})();

(function () {
    let list = [];
    let output = [];
    for (let i = 0; i < 50; i++) {
        list.push(i);
    }
    output = list.map(num => {
        return num * 2;
    });
    console.log(`printing the original list ${list}`);
    console.log(`printing the mapped list ${output}`);
})();

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

function updatePgnLog() {
    let ply = (moveList.length % 2 !== 0) ? `${(moveList.length + 1) / 2}. ` : '';
    pgnLog.innerHTML += `<li class="pgn-link" data-fen=${chess.fen()}>${ply}${moveList[moveList.length - 1]}</li>`;
}
