const chess = new Chess();
const Chessground = require('chessground').Chessground;
const pgnLog = document.getElementById('pgn-long-form');
const gameData = JSON.parse(document.getElementById('gameAsJSON').value);
let moveList = [];

(() => {
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

(() => {
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

const getValidMoves = (chess) => {
    let dests = new Map();
    chess.SQUARES.forEach(function (s) {
        let ms = chess.moves({ square: s, verbose: true });
        if (ms.length)
            dests.set(s, ms.map((m) => { return m.to; }));
    });
    return dests;
}

const updatePgnLog = () => {
    let ply = (moveList.length % 2 !== 0) ? `${(moveList.length + 1) / 2}. ` : '';
    pgnLog.innerHTML += `<li class="pgn-link" data-fen=${chess.fen()}>${ply}${moveList[moveList.length - 1]}</li>`;
}

let prevScrollpos = window.pageYOffset;
window.onscroll = () => {
    let currentScrollPos = window.pageYOffset;
    let nav = document.getElementsByClassName('nav')[0];
    if (prevScrollpos > currentScrollPos) {
        nav.style.top = '0';
    } else {
        nav.style.top = '-50px';
    }
    prevScrollpos = currentScrollPos;
}


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
    }
};

const board = new Chessground(document.getElementById('board'), config);
