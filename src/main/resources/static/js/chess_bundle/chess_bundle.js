(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
class ChatMessage{
    constructor(from, to, message) {
        this.from = from;
        this.to = to;
        this.message = message;
    }
}

module.exports = ChatMessage;
},{}],2:[function(require,module,exports){
class Clock {
    constructor(timeControl, domDisplay) {
        let arr = timeControl.split('_');
        this.inc = +arr.pop();
        switch (arr[0]) {
            case 'TWO':
                this.seconds = 2*60;
                break;
            case 'FIVE':
                this.seconds = 5*60;
                break;
            case 'TEN':
                this.seconds = 10*60;
                break;
        }
        this.on = false;
        this.display = domDisplay;
    }

    run() {
        if (this.on) {
            this.seconds--;
            this.updateDisplay();
        }
    }

    stop() {
        this.on = false;
    }

    pause() {
        this.on = false;
        this.seconds += this.inc;
        this.updateDisplay();
    }

    resume() {
        this.on = true;
    }

    updateDisplay() {
        if (this.seconds === 0) {
            this.display.style.color = 'red';
            this.display.textContent = '00:00';
            this.on = false;
            return;
        }
        let mins = Math.floor(this.seconds / 60);
        let seconds = this.seconds % 60;
        this.display.textContent = `${mins}:${(seconds < 10) ? ('0' + seconds): seconds}`;
    }
}

module.exports = Clock;
},{}],3:[function(require,module,exports){
class GameUpdate {

    constructor(from, to, newMove, newPosition, seconds) {
        this.from = from;
        this.to = to;
        this.newMove = newMove;
        this.updateType = 'NEW_MOVE';
        this.seconds = seconds;
    }

    resign() {
        this.updateType = 'RESIGNATION';
    }

    offerDraw() {
        this.updateType = 'DRAW_OFFER';
    }

    acceptDraw() {
        this.updateType = "ACCEPT_DRAW";
    }

    declineDraw() {
        this.updateType = "DECLINE_DRAW";
    }
}

module.exports = GameUpdate;
},{}],4:[function(require,module,exports){
const chess = new Chess();
const Chessground = require('chessground').Chessground;
const clocks = require('./timekeeper'), myClock = clocks.myClock, opponentClock = clocks.opponentClock;
const GameUpdate = require('./GameUpdate');
const pgnLog = document.getElementById('pgn-long-form');
const gameData = JSON.parse(document.getElementById('gameAsJSON').value);
const me = document.getElementById('you');
const opponent = document.getElementById('opponent');
const color = gameData.white === me.textContent ? 'white' : 'black';
let stompClient = null;
let moveList = [];


const sendData = (gameUpdate) => {
    stompClient.send('/app/updateOpponent', {}, JSON.stringify(gameUpdate));
}

(() => {
    let socket = new SockJS('/chess-lite');
    stompClient = Stomp.over(socket);
    stompClient.debug = (str) => {};

    stompClient.connect({},  (frame) => {

        stompClient.subscribe('/user/queue/update', (data) => {
            let gameUpdate = JSON.parse(data.body);

            if (!gameUpdate.updateType) {
                throw new Error('The type of update hasn\'t been set for GameUpdate object');
            }

            switch (gameUpdate.updateType) {
                case 'NEW_MOVE':
                    processNewMove(gameUpdate);
                    break;

                case 'RESIGNATION':
                    processResignation();
                    break;

                case 'DRAW_OFFER':
                    decideDrawOffer();
                    break;

                case 'ACCEPT_DRAW':
                    acceptDrawOffer();
                    break;
            }

        });

        stompClient.subscribe('/user/queue/message', (data) => {
            let msg = JSON.parse(data.body).message;
            let chatLog = document.getElementById('chat-messages');
            chatLog.innerHTML += `<li class="opponent_message">${msg}</li>`;
        });
    });

})();

(() => {
    (color === 'white') ? myClock.resume() : opponentClock.resume();
})();

const processNewMove = (gameUpdate) => {
    opponentClock.pause();
    opponentClock.seconds = gameUpdate.seconds;
    opponentClock.updateDisplay();
    myClock.resume();
    let from_to = gameUpdate.newMove.split('-');

    board.move(from_to[0], from_to[1]);
}

const processGameOver = () => {

    let result;
    if (chess.in_checkmate()) {
        result = 'checkmate';
    } else if (chess.in_threefold_repetition()) {
        result = 'threefold repetition';
    } else if (chess.in_stalemate()) {
        result = 'stalemate';
    } else if (chess.insufficient_material()) {
        result = 'draw due to insufficient material'
    }
    displayResult(result);
}

const processResignation = () => {
    stopClocks();
    chess.set_resign(true);
    board.set({viewOnly: true});
    displayResult('Resignation');

    gameData.pgn = chess.history().join(' ');
    gameData.result = `${color} won by resignation`;

    stompClient.send('/app/gameOver', {}, JSON.stringify(gameData));

}

const acceptDrawOffer = () =>{
    stopClocks();
    chess.set_draw(true);
    board.set({viewOnly: true});
    displayResult('Draw');
    gameData.pgn = chess.history().join(' ');
    gameData.result = 'Game drawn by agreement';
    stompClient.send('/app/gameOver', {}, JSON.stringify(gameData));
}

const getValidMoves = (chess) => {
    let dests = new Map();
    chess.SQUARES.forEach((s) => {
        var ms = chess.moves({ square: s, verbose: true });
        if (ms.length)
            dests.set(s, ms.map(function (m) { return m.to; }));
    });
    return dests;
}

const sideToMove = (chess) => {
    return (chess.turn() === 'w') ? 'white' : 'black';
}

const displayResult = (result) => {
    let game_result = document.getElementById('game_result');
    let currActive = document.getElementsByClassName('active')[0];
    currActive.classList.toggle('active');
    game_result.classList.toggle('active');
    let resultLabel = document.getElementById('result');
    resultLabel.textContent = `Game finished by ${result}.`
}

const decideDrawOffer = () => {
    let draw_decision = document.getElementById('draw_decision');
    let currActive = document.getElementsByClassName('active')[0];
    currActive.classList.toggle('active');
    draw_decision.classList.toggle('active');
}

const stopClocks = () => {
    myClock.stop();
    opponentClock.stop();
}

const updatePgnLog = () => {
    const index = moveList.length - 1;
    let ply = (moveList.length % 2 !== 0) ? `${(index + 2) / 2}. ` : '';
    let newTag = `<li class="pgn-link" data-fen=${chess.fen()}>${ply}${moveList[index]}</li>`;

    pgnLog.insertAdjacentHTML('beforeend', newTag);
    let el = document.querySelectorAll('#pgn-long-form .pgn-link')[index];
    el.addEventListener('click', () => {
        board.set({fen: el.dataset.fen});
    });

    let pgn = document.getElementById('pgn');
    if (!moveList[1]) {
        document.getElementById('pgn').textContent = null;
    }
    pgn.insertAdjacentHTML('beforeend', `${newTag} `);

    let el2 = document.querySelectorAll('#pgn .pgn-link')[index];
    el2.addEventListener('click', () => {
        board.set({fen: el2.dataset.fen});
    });
}

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
        move: (orig, dest) => {
            let moveObj = chess.move({from: orig, to: dest});
            if (chess.game_over()) {
                processGameOver();
            }


            let config = {
                turnColor: sideToMove(chess),
                movable: {
                    dests: getValidMoves(chess)
                }
            }
            board.set(config);
            if (!(chess.turn() === color.charAt(0))) {
                myClock.pause();
                opponentClock.resume();
                let gameUpdate = new GameUpdate(me.textContent,
                    opponent.textContent,
                    `${orig}-${dest}`,
                    chess.fen(),
                    myClock.seconds);

                sendData(gameUpdate);
            }
            moveList.push(moveObj.san);
            updatePgnLog();
        }
    }
};

const board = new Chessground(document.getElementById('board'), config);

module.exports = {
    stompClient: stompClient,
    board: board,
    chess: chess,
    me: me,
    opponent: opponent,
    stopClocks: stopClocks,
    displayResult: displayResult,
}
},{"./GameUpdate":3,"./timekeeper":6,"chessground":10}],5:[function(require,module,exports){
const app = require('./app_chess');
const stompClient = app.stompClient,
    chess = app.chess,
    board = app.board,
    me = app.me,
    opponent = app.opponent,
    stopClocks = app.stopClocks,
    displayResult = app.displayResult;

const GameUpdate = require('./GameUpdate');
const ChatMessage = require('./ChatMessage');


// Nav listener

let navButton = document.getElementById('nav-button');
navButton.addEventListener('click', () => {

    let navLinks = document.getElementsByClassName('nav-links')[0];
    navLinks.style.display =  'flex';
    navButton.style.display = 'none';

});

let closeNav = document.getElementById('close-nav');
closeNav.addEventListener('click', () => {
    let navLinks = document.getElementsByClassName('nav-links')[0];
    navLinks.style.display = 'none';
    navButton.style.display = 'unset';

});


// Log related listeners

let links = document.getElementsByClassName('widget-link');
for (let link of links) {
    link.addEventListener('click', () =>  {
        let currSelected = document.getElementsByClassName('selected')[0];
        currSelected.classList.toggle('selected');
        link.classList.toggle('selected');

        let dataSet = link.dataset.for;
        let ref = document.getElementById(dataSet);
        let currActive = document.getElementsByClassName('active')[0];
        currActive.classList.toggle('active');
        ref.classList.toggle('active');
    });
}

let chatInput = document.getElementById('chat-input');
chatInput.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') chatButton.click();
});


let chatButton = document.getElementById('chat-button');
chatButton.addEventListener('click', () => {

    let chatLog = document.getElementById('chat-messages');
    let msg = chatInput.value;
    chatLog.innerHTML += `<li class="user-message">${msg}</li>`;
    chatInput.value = null;
    let chatMsg = new ChatMessage(me.textContent, opponent.textContent, msg);
    stompClient.send('/app/message', {}, JSON.stringify(chatMsg));
});

let notesInput = document.getElementById('notes-input');
notesInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') noteButton.click();
});

let noteButton = document.getElementById('notes-button');
noteButton.addEventListener('click', () => {
    let notesLog = document.getElementById('notes');
    notesLog.innerHTML += `<li class="note">${notesInput.value}</li> `
    notesInput.value = null;
});


// Game control listeners

let endGame = document.getElementsByClassName('endgame')[0];
endGame.addEventListener('click', () => {
    let btns = document.getElementsByClassName('end-buttons')[0];
    btns.style.display = 'flex';
});

let close = document.getElementsByClassName('window-close')[0];
close.addEventListener('click', (e) => {
    e.stopPropagation();
    closeWindow();
});

let resign = document.getElementById('resign');
resign.addEventListener('click', (e) => {
    e.stopPropagation();
    closeWindow();
    chess.set_resign(true);
    board.set({viewOnly: true});
    stopClocks();
    let gameUpdate = new GameUpdate(me.textContent, opponent.textContent);
    gameUpdate.resign();
    stompClient.send('/app/updateOpponent', {}, JSON.stringify(gameUpdate));
    displayResult('Resignation');

});

let draw = document.getElementById('offer_draw');
draw.addEventListener('click', (e) => {
    e.stopPropagation();
    closeWindow();
    let gameUpdate = new GameUpdate(me.textContent, opponent.textContent);
    gameUpdate.offerDraw();
    stompClient.send('/app/updateOpponent', {}, JSON.stringify(gameUpdate));
});


let accept = document.getElementById('accept');
accept.addEventListener('click', () =>  {
    chess.set_draw(true);
    board.set({viewOnly: true});
    displayResult('draw agreement');
    afterDrawDecision();
    displayResult('Draw');
    stopClocks();
    let gameUpdate = new GameUpdate(me.textContent, opponent.textContent);
    gameUpdate.acceptDraw();
    stompClient.send('/app/updateOpponent', {}, JSON.stringify(gameUpdate));
});

let decline = document.getElementById('decline');
decline.addEventListener('click', () => {
    afterDrawDecision();
    let gameUpdate = new GameUpdate(me.textContent, opponent.textContent);
    gameUpdate.declineDraw();
    stompClient.send('/app/updateOpponent', {}, JSON.stringify(gameUpdate));

});

// Util functions

const closeWindow = () => {
    let btns = document.getElementsByClassName('end-buttons')[0];
    btns.style.display = 'none';
}

const afterDrawDecision = () => {
    let currActive = document.getElementsByClassName('active')[0];
    currActive.classList.toggle('active');
    let currSelected = document.getElementsByClassName('selected')[0]

    let dataSet = currSelected.dataset.for;
    let ref = document.getElementById(dataSet);
    ref.classList.toggle('active');
}
},{"./ChatMessage":1,"./GameUpdate":3,"./app_chess":4}],6:[function(require,module,exports){
const Clock = require("./Clock")
const timeControl = JSON.parse(document.getElementById('gameAsJSON').value).timeControl;

const myClock = new Clock(timeControl, document.getElementById('clock2'));
const opponentClock = new Clock(timeControl, document.getElementById('clock1'));

setInterval(() => {
    myClock.run();
    opponentClock.run();
}, 1000);

module.exports = {
    myClock: myClock,
    opponentClock: opponentClock
};


},{"./Clock":2}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = exports.anim = void 0;
const util = require("./util");
function anim(mutation, state) {
    return state.animation.enabled ? animate(mutation, state) : render(mutation, state);
}
exports.anim = anim;
function render(mutation, state) {
    const result = mutation(state);
    state.dom.redraw();
    return result;
}
exports.render = render;
function makePiece(key, piece) {
    return {
        key: key,
        pos: util.key2pos(key),
        piece: piece
    };
}
function closer(piece, pieces) {
    return pieces.sort((p1, p2) => {
        return util.distanceSq(piece.pos, p1.pos) - util.distanceSq(piece.pos, p2.pos);
    })[0];
}
function computePlan(prevPieces, current) {
    const anims = new Map(), animedOrigs = [], fadings = new Map(), missings = [], news = [], prePieces = new Map();
    let curP, preP, vector;
    for (const [k, p] of prevPieces) {
        prePieces.set(k, makePiece(k, p));
    }
    for (const key of util.allKeys) {
        curP = current.pieces.get(key);
        preP = prePieces.get(key);
        if (curP) {
            if (preP) {
                if (!util.samePiece(curP, preP.piece)) {
                    missings.push(preP);
                    news.push(makePiece(key, curP));
                }
            }
            else
                news.push(makePiece(key, curP));
        }
        else if (preP)
            missings.push(preP);
    }
    for (const newP of news) {
        preP = closer(newP, missings.filter(p => util.samePiece(newP.piece, p.piece)));
        if (preP) {
            vector = [preP.pos[0] - newP.pos[0], preP.pos[1] - newP.pos[1]];
            anims.set(newP.key, vector.concat(vector));
            animedOrigs.push(preP.key);
        }
    }
    for (const p of missings) {
        if (!animedOrigs.includes(p.key))
            fadings.set(p.key, p.piece);
    }
    return {
        anims: anims,
        fadings: fadings
    };
}
function step(state, now) {
    const cur = state.animation.current;
    if (cur === undefined) {
        if (!state.dom.destroyed)
            state.dom.redrawNow();
        return;
    }
    const rest = 1 - (now - cur.start) * cur.frequency;
    if (rest <= 0) {
        state.animation.current = undefined;
        state.dom.redrawNow();
    }
    else {
        const ease = easing(rest);
        for (const cfg of cur.plan.anims.values()) {
            cfg[2] = cfg[0] * ease;
            cfg[3] = cfg[1] * ease;
        }
        state.dom.redrawNow(true);
        requestAnimationFrame((now = performance.now()) => step(state, now));
    }
}
function animate(mutation, state) {
    const prevPieces = new Map(state.pieces);
    const result = mutation(state);
    const plan = computePlan(prevPieces, state);
    if (plan.anims.size || plan.fadings.size) {
        const alreadyRunning = state.animation.current && state.animation.current.start;
        state.animation.current = {
            start: performance.now(),
            frequency: 1 / state.animation.duration,
            plan: plan
        };
        if (!alreadyRunning)
            step(state, performance.now());
    }
    else {
        state.dom.redraw();
    }
    return result;
}
function easing(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

},{"./util":23}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const board = require("./board");
const fen_1 = require("./fen");
const config_1 = require("./config");
const anim_1 = require("./anim");
const drag_1 = require("./drag");
const explosion_1 = require("./explosion");
function start(state, redrawAll) {
    function toggleOrientation() {
        board.toggleOrientation(state);
        redrawAll();
    }
    return {
        set(config) {
            if (config.orientation && config.orientation !== state.orientation)
                toggleOrientation();
            (config.fen ? anim_1.anim : anim_1.render)(state => config_1.configure(state, config), state);
        },
        state,
        getFen: () => fen_1.write(state.pieces),
        toggleOrientation,
        setPieces(pieces) {
            anim_1.anim(state => board.setPieces(state, pieces), state);
        },
        selectSquare(key, force) {
            if (key)
                anim_1.anim(state => board.selectSquare(state, key, force), state);
            else if (state.selected) {
                board.unselect(state);
                state.dom.redraw();
            }
        },
        move(orig, dest) {
            anim_1.anim(state => board.baseMove(state, orig, dest), state);
        },
        newPiece(piece, key) {
            anim_1.anim(state => board.baseNewPiece(state, piece, key), state);
        },
        playPremove() {
            if (state.premovable.current) {
                if (anim_1.anim(board.playPremove, state))
                    return true;
                state.dom.redraw();
            }
            return false;
        },
        playPredrop(validate) {
            if (state.predroppable.current) {
                const result = board.playPredrop(state, validate);
                state.dom.redraw();
                return result;
            }
            return false;
        },
        cancelPremove() {
            anim_1.render(board.unsetPremove, state);
        },
        cancelPredrop() {
            anim_1.render(board.unsetPredrop, state);
        },
        cancelMove() {
            anim_1.render(state => { board.cancelMove(state); drag_1.cancel(state); }, state);
        },
        stop() {
            anim_1.render(state => { board.stop(state); drag_1.cancel(state); }, state);
        },
        explode(keys) {
            explosion_1.explosion(state, keys);
        },
        setAutoShapes(shapes) {
            anim_1.render(state => state.drawable.autoShapes = shapes, state);
        },
        setShapes(shapes) {
            anim_1.render(state => state.drawable.shapes = shapes, state);
        },
        getKeyAtDomPos(pos) {
            return board.getKeyAtDomPos(pos, board.whitePov(state), state.dom.bounds());
        },
        redrawAll,
        dragNewPiece(piece, event, force) {
            drag_1.dragNewPiece(state, piece, event, force);
        },
        destroy() {
            board.stop(state);
            state.dom.unbind && state.dom.unbind();
            state.dom.destroyed = true;
        }
    };
}
exports.start = start;

},{"./anim":7,"./board":9,"./config":11,"./drag":12,"./explosion":16,"./fen":17}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whitePov = exports.getSnappedKeyAtDomPos = exports.getKeyAtDomPos = exports.stop = exports.cancelMove = exports.playPredrop = exports.playPremove = exports.isDraggable = exports.canMove = exports.unselect = exports.setSelected = exports.selectSquare = exports.dropNewPiece = exports.userMove = exports.baseNewPiece = exports.baseMove = exports.unsetPredrop = exports.unsetPremove = exports.setCheck = exports.setPieces = exports.reset = exports.toggleOrientation = exports.callUserFunction = void 0;
const util_1 = require("./util");
const premove_1 = require("./premove");
function callUserFunction(f, ...args) {
    if (f)
        setTimeout(() => f(...args), 1);
}
exports.callUserFunction = callUserFunction;
function toggleOrientation(state) {
    state.orientation = util_1.opposite(state.orientation);
    state.animation.current =
        state.draggable.current =
            state.selected = undefined;
}
exports.toggleOrientation = toggleOrientation;
function reset(state) {
    state.lastMove = undefined;
    unselect(state);
    unsetPremove(state);
    unsetPredrop(state);
}
exports.reset = reset;
function setPieces(state, pieces) {
    for (const [key, piece] of pieces) {
        if (piece)
            state.pieces.set(key, piece);
        else
            state.pieces.delete(key);
    }
}
exports.setPieces = setPieces;
function setCheck(state, color) {
    state.check = undefined;
    if (color === true)
        color = state.turnColor;
    if (color)
        for (const [k, p] of state.pieces) {
            if (p.role === 'king' && p.color === color) {
                state.check = k;
            }
        }
}
exports.setCheck = setCheck;
function setPremove(state, orig, dest, meta) {
    unsetPredrop(state);
    state.premovable.current = [orig, dest];
    callUserFunction(state.premovable.events.set, orig, dest, meta);
}
function unsetPremove(state) {
    if (state.premovable.current) {
        state.premovable.current = undefined;
        callUserFunction(state.premovable.events.unset);
    }
}
exports.unsetPremove = unsetPremove;
function setPredrop(state, role, key) {
    unsetPremove(state);
    state.predroppable.current = { role, key };
    callUserFunction(state.predroppable.events.set, role, key);
}
function unsetPredrop(state) {
    const pd = state.predroppable;
    if (pd.current) {
        pd.current = undefined;
        callUserFunction(pd.events.unset);
    }
}
exports.unsetPredrop = unsetPredrop;
function tryAutoCastle(state, orig, dest) {
    if (!state.autoCastle)
        return false;
    const king = state.pieces.get(orig);
    if (!king || king.role !== 'king')
        return false;
    const origPos = util_1.key2pos(orig);
    const destPos = util_1.key2pos(dest);
    if ((origPos[1] !== 0 && origPos[1] !== 7) || origPos[1] !== destPos[1])
        return false;
    if (origPos[0] === 4 && !state.pieces.has(dest)) {
        if (destPos[0] === 6)
            dest = util_1.pos2key([7, destPos[1]]);
        else if (destPos[0] === 2)
            dest = util_1.pos2key([0, destPos[1]]);
    }
    const rook = state.pieces.get(dest);
    if (!rook || rook.color !== king.color || rook.role !== 'rook')
        return false;
    state.pieces.delete(orig);
    state.pieces.delete(dest);
    if (origPos[0] < destPos[0]) {
        state.pieces.set(util_1.pos2key([6, destPos[1]]), king);
        state.pieces.set(util_1.pos2key([5, destPos[1]]), rook);
    }
    else {
        state.pieces.set(util_1.pos2key([2, destPos[1]]), king);
        state.pieces.set(util_1.pos2key([3, destPos[1]]), rook);
    }
    return true;
}
function baseMove(state, orig, dest) {
    const origPiece = state.pieces.get(orig), destPiece = state.pieces.get(dest);
    if (orig === dest || !origPiece)
        return false;
    const captured = (destPiece && destPiece.color !== origPiece.color) ? destPiece : undefined;
    if (dest === state.selected)
        unselect(state);
    callUserFunction(state.events.move, orig, dest, captured);
    if (!tryAutoCastle(state, orig, dest)) {
        state.pieces.set(dest, origPiece);
        state.pieces.delete(orig);
    }
    state.lastMove = [orig, dest];
    state.check = undefined;
    callUserFunction(state.events.change);
    return captured || true;
}
exports.baseMove = baseMove;
function baseNewPiece(state, piece, key, force) {
    if (state.pieces.has(key)) {
        if (force)
            state.pieces.delete(key);
        else
            return false;
    }
    callUserFunction(state.events.dropNewPiece, piece, key);
    state.pieces.set(key, piece);
    state.lastMove = [key];
    state.check = undefined;
    callUserFunction(state.events.change);
    state.movable.dests = undefined;
    state.turnColor = util_1.opposite(state.turnColor);
    return true;
}
exports.baseNewPiece = baseNewPiece;
function baseUserMove(state, orig, dest) {
    const result = baseMove(state, orig, dest);
    if (result) {
        state.movable.dests = undefined;
        state.turnColor = util_1.opposite(state.turnColor);
        state.animation.current = undefined;
    }
    return result;
}
function userMove(state, orig, dest) {
    if (canMove(state, orig, dest)) {
        const result = baseUserMove(state, orig, dest);
        if (result) {
            const holdTime = state.hold.stop();
            unselect(state);
            const metadata = {
                premove: false,
                ctrlKey: state.stats.ctrlKey,
                holdTime
            };
            if (result !== true)
                metadata.captured = result;
            callUserFunction(state.movable.events.after, orig, dest, metadata);
            return true;
        }
    }
    else if (canPremove(state, orig, dest)) {
        setPremove(state, orig, dest, {
            ctrlKey: state.stats.ctrlKey
        });
        unselect(state);
        return true;
    }
    unselect(state);
    return false;
}
exports.userMove = userMove;
function dropNewPiece(state, orig, dest, force) {
    const piece = state.pieces.get(orig);
    if (piece && (canDrop(state, orig, dest) || force)) {
        state.pieces.delete(orig);
        baseNewPiece(state, piece, dest, force);
        callUserFunction(state.movable.events.afterNewPiece, piece.role, dest, {
            predrop: false
        });
    }
    else if (piece && canPredrop(state, orig, dest)) {
        setPredrop(state, piece.role, dest);
    }
    else {
        unsetPremove(state);
        unsetPredrop(state);
    }
    state.pieces.delete(orig);
    unselect(state);
}
exports.dropNewPiece = dropNewPiece;
function selectSquare(state, key, force) {
    callUserFunction(state.events.select, key);
    if (state.selected) {
        if (state.selected === key && !state.draggable.enabled) {
            unselect(state);
            state.hold.cancel();
            return;
        }
        else if ((state.selectable.enabled || force) && state.selected !== key) {
            if (userMove(state, state.selected, key)) {
                state.stats.dragged = false;
                return;
            }
        }
    }
    if (isMovable(state, key) || isPremovable(state, key)) {
        setSelected(state, key);
        state.hold.start();
    }
}
exports.selectSquare = selectSquare;
function setSelected(state, key) {
    state.selected = key;
    if (isPremovable(state, key)) {
        state.premovable.dests = premove_1.premove(state.pieces, key, state.premovable.castle);
    }
    else
        state.premovable.dests = undefined;
}
exports.setSelected = setSelected;
function unselect(state) {
    state.selected = undefined;
    state.premovable.dests = undefined;
    state.hold.cancel();
}
exports.unselect = unselect;
function isMovable(state, orig) {
    const piece = state.pieces.get(orig);
    return !!piece && (state.movable.color === 'both' || (state.movable.color === piece.color &&
        state.turnColor === piece.color));
}
function canMove(state, orig, dest) {
    var _a, _b;
    return orig !== dest && isMovable(state, orig) && (state.movable.free || !!((_b = (_a = state.movable.dests) === null || _a === void 0 ? void 0 : _a.get(orig)) === null || _b === void 0 ? void 0 : _b.includes(dest)));
}
exports.canMove = canMove;
function canDrop(state, orig, dest) {
    const piece = state.pieces.get(orig);
    return !!piece && (orig === dest || !state.pieces.has(dest)) && (state.movable.color === 'both' || (state.movable.color === piece.color &&
        state.turnColor === piece.color));
}
function isPremovable(state, orig) {
    const piece = state.pieces.get(orig);
    return !!piece && state.premovable.enabled &&
        state.movable.color === piece.color &&
        state.turnColor !== piece.color;
}
function canPremove(state, orig, dest) {
    return orig !== dest &&
        isPremovable(state, orig) &&
        premove_1.premove(state.pieces, orig, state.premovable.castle).includes(dest);
}
function canPredrop(state, orig, dest) {
    const piece = state.pieces.get(orig);
    const destPiece = state.pieces.get(dest);
    return !!piece &&
        (!destPiece || destPiece.color !== state.movable.color) &&
        state.predroppable.enabled &&
        (piece.role !== 'pawn' || (dest[1] !== '1' && dest[1] !== '8')) &&
        state.movable.color === piece.color &&
        state.turnColor !== piece.color;
}
function isDraggable(state, orig) {
    const piece = state.pieces.get(orig);
    return !!piece && state.draggable.enabled && (state.movable.color === 'both' || (state.movable.color === piece.color && (state.turnColor === piece.color || state.premovable.enabled)));
}
exports.isDraggable = isDraggable;
function playPremove(state) {
    const move = state.premovable.current;
    if (!move)
        return false;
    const orig = move[0], dest = move[1];
    let success = false;
    if (canMove(state, orig, dest)) {
        const result = baseUserMove(state, orig, dest);
        if (result) {
            const metadata = { premove: true };
            if (result !== true)
                metadata.captured = result;
            callUserFunction(state.movable.events.after, orig, dest, metadata);
            success = true;
        }
    }
    unsetPremove(state);
    return success;
}
exports.playPremove = playPremove;
function playPredrop(state, validate) {
    const drop = state.predroppable.current;
    let success = false;
    if (!drop)
        return false;
    if (validate(drop)) {
        const piece = {
            role: drop.role,
            color: state.movable.color
        };
        if (baseNewPiece(state, piece, drop.key)) {
            callUserFunction(state.movable.events.afterNewPiece, drop.role, drop.key, {
                predrop: true
            });
            success = true;
        }
    }
    unsetPredrop(state);
    return success;
}
exports.playPredrop = playPredrop;
function cancelMove(state) {
    unsetPremove(state);
    unsetPredrop(state);
    unselect(state);
}
exports.cancelMove = cancelMove;
function stop(state) {
    state.movable.color =
        state.movable.dests =
            state.animation.current = undefined;
    cancelMove(state);
}
exports.stop = stop;
function getKeyAtDomPos(pos, asWhite, bounds) {
    let file = Math.floor(8 * (pos[0] - bounds.left) / bounds.width);
    if (!asWhite)
        file = 7 - file;
    let rank = 7 - Math.floor(8 * (pos[1] - bounds.top) / bounds.height);
    if (!asWhite)
        rank = 7 - rank;
    return (file >= 0 && file < 8 && rank >= 0 && rank < 8) ? util_1.pos2key([file, rank]) : undefined;
}
exports.getKeyAtDomPos = getKeyAtDomPos;
function getSnappedKeyAtDomPos(orig, pos, asWhite, bounds) {
    const origPos = util_1.key2pos(orig);
    const validSnapPos = util_1.allPos.filter(pos2 => {
        return premove_1.queen(origPos[0], origPos[1], pos2[0], pos2[1]) || premove_1.knight(origPos[0], origPos[1], pos2[0], pos2[1]);
    });
    const validSnapCenters = validSnapPos.map(pos2 => util_1.computeSquareCenter(util_1.pos2key(pos2), asWhite, bounds));
    const validSnapDistances = validSnapCenters.map(pos2 => util_1.distanceSq(pos, pos2));
    const [, closestSnapIndex] = validSnapDistances.reduce((a, b, index) => a[0] < b ? a : [b, index], [validSnapDistances[0], 0]);
    return util_1.pos2key(validSnapPos[closestSnapIndex]);
}
exports.getSnappedKeyAtDomPos = getSnappedKeyAtDomPos;
function whitePov(s) {
    return s.orientation === 'white';
}
exports.whitePov = whitePov;

},{"./premove":18,"./util":23}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chessground = void 0;
const api_1 = require("./api");
const config_1 = require("./config");
const state_1 = require("./state");
const wrap_1 = require("./wrap");
const events = require("./events");
const render_1 = require("./render");
const svg = require("./svg");
const util = require("./util");
function Chessground(element, config) {
    const maybeState = state_1.defaults();
    config_1.configure(maybeState, config || {});
    function redrawAll() {
        const prevUnbind = 'dom' in maybeState ? maybeState.dom.unbind : undefined;
        const relative = maybeState.viewOnly && !maybeState.drawable.visible, elements = wrap_1.renderWrap(element, maybeState, relative), bounds = util.memo(() => elements.board.getBoundingClientRect()), redrawNow = (skipSvg) => {
            render_1.render(state);
            if (!skipSvg && elements.svg)
                svg.renderSvg(state, elements.svg);
        }, boundsUpdated = () => {
            bounds.clear();
            render_1.updateBounds(state);
            if (elements.svg)
                svg.renderSvg(state, elements.svg);
        };
        const state = maybeState;
        state.dom = {
            elements,
            bounds,
            redraw: debounceRedraw(redrawNow),
            redrawNow,
            unbind: prevUnbind,
            relative
        };
        state.drawable.prevSvgHash = '';
        redrawNow(false);
        events.bindBoard(state, boundsUpdated);
        if (!prevUnbind)
            state.dom.unbind = events.bindDocument(state, boundsUpdated);
        state.events.insert && state.events.insert(elements);
        return state;
    }
    return api_1.start(redrawAll(), redrawAll);
}
exports.Chessground = Chessground;
function debounceRedraw(redrawNow) {
    let redrawing = false;
    return () => {
        if (redrawing)
            return;
        redrawing = true;
        requestAnimationFrame(() => {
            redrawNow();
            redrawing = false;
        });
    };
}

},{"./api":8,"./config":11,"./events":15,"./render":19,"./state":20,"./svg":21,"./util":23,"./wrap":24}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configure = void 0;
const board_1 = require("./board");
const fen_1 = require("./fen");
function configure(state, config) {
    var _a;
    if ((_a = config.movable) === null || _a === void 0 ? void 0 : _a.dests)
        state.movable.dests = undefined;
    merge(state, config);
    if (config.fen) {
        state.pieces = fen_1.read(config.fen);
        state.drawable.shapes = [];
    }
    if (config.hasOwnProperty('check'))
        board_1.setCheck(state, config.check || false);
    if (config.hasOwnProperty('lastMove') && !config.lastMove)
        state.lastMove = undefined;
    else if (config.lastMove)
        state.lastMove = config.lastMove;
    if (state.selected)
        board_1.setSelected(state, state.selected);
    if (!state.animation.duration || state.animation.duration < 100)
        state.animation.enabled = false;
    if (!state.movable.rookCastle && state.movable.dests) {
        const rank = state.movable.color === 'white' ? '1' : '8', kingStartPos = 'e' + rank, dests = state.movable.dests.get(kingStartPos), king = state.pieces.get(kingStartPos);
        if (!dests || !king || king.role !== 'king')
            return;
        state.movable.dests.set(kingStartPos, dests.filter(d => !((d === 'a' + rank) && dests.includes('c' + rank)) &&
            !((d === 'h' + rank) && dests.includes('g' + rank))));
    }
}
exports.configure = configure;
function merge(base, extend) {
    for (const key in extend) {
        if (isObject(base[key]) && isObject(extend[key]))
            merge(base[key], extend[key]);
        else
            base[key] = extend[key];
    }
}
function isObject(o) {
    return typeof o === 'object';
}

},{"./board":9,"./fen":17}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancel = exports.end = exports.move = exports.dragNewPiece = exports.start = void 0;
const board = require("./board");
const util = require("./util");
const draw_1 = require("./draw");
const anim_1 = require("./anim");
function start(s, e) {
    if (!e.isTrusted || e.button !== undefined && e.button !== 0)
        return;
    if (e.touches && e.touches.length > 1)
        return;
    const bounds = s.dom.bounds(), position = util.eventPosition(e), orig = board.getKeyAtDomPos(position, board.whitePov(s), bounds);
    if (!orig)
        return;
    const piece = s.pieces.get(orig);
    const previouslySelected = s.selected;
    if (!previouslySelected && s.drawable.enabled && (s.drawable.eraseOnClick || (!piece || piece.color !== s.turnColor)))
        draw_1.clear(s);
    if (e.cancelable !== false &&
        (!e.touches || !s.movable.color || piece || previouslySelected || pieceCloseTo(s, position)))
        e.preventDefault();
    const hadPremove = !!s.premovable.current;
    const hadPredrop = !!s.predroppable.current;
    s.stats.ctrlKey = e.ctrlKey;
    if (s.selected && board.canMove(s, s.selected, orig)) {
        anim_1.anim(state => board.selectSquare(state, orig), s);
    }
    else {
        board.selectSquare(s, orig);
    }
    const stillSelected = s.selected === orig;
    const element = pieceElementByKey(s, orig);
    if (piece && element && stillSelected && board.isDraggable(s, orig)) {
        s.draggable.current = {
            orig,
            piece,
            origPos: position,
            pos: position,
            started: s.draggable.autoDistance && s.stats.dragged,
            element,
            previouslySelected,
            originTarget: e.target
        };
        element.cgDragging = true;
        element.classList.add('dragging');
        const ghost = s.dom.elements.ghost;
        if (ghost) {
            ghost.className = `ghost ${piece.color} ${piece.role}`;
            util.translateAbs(ghost, util.posToTranslateAbs(bounds)(util.key2pos(orig), board.whitePov(s)));
            util.setVisible(ghost, true);
        }
        processDrag(s);
    }
    else {
        if (hadPremove)
            board.unsetPremove(s);
        if (hadPredrop)
            board.unsetPredrop(s);
    }
    s.dom.redraw();
}
exports.start = start;
function pieceCloseTo(s, pos) {
    const asWhite = board.whitePov(s), bounds = s.dom.bounds(), radiusSq = Math.pow(bounds.width / 8, 2);
    for (const key in s.pieces) {
        const center = util.computeSquareCenter(key, asWhite, bounds);
        if (util.distanceSq(center, pos) <= radiusSq)
            return true;
    }
    return false;
}
function dragNewPiece(s, piece, e, force) {
    const key = 'a0';
    s.pieces.set(key, piece);
    s.dom.redraw();
    const position = util.eventPosition(e);
    s.draggable.current = {
        orig: key,
        piece,
        origPos: position,
        pos: position,
        started: true,
        element: () => pieceElementByKey(s, key),
        originTarget: e.target,
        newPiece: true,
        force: !!force
    };
    processDrag(s);
}
exports.dragNewPiece = dragNewPiece;
function processDrag(s) {
    requestAnimationFrame(() => {
        var _a;
        const cur = s.draggable.current;
        if (!cur)
            return;
        if ((_a = s.animation.current) === null || _a === void 0 ? void 0 : _a.plan.anims.has(cur.orig))
            s.animation.current = undefined;
        const origPiece = s.pieces.get(cur.orig);
        if (!origPiece || !util.samePiece(origPiece, cur.piece))
            cancel(s);
        else {
            if (!cur.started && util.distanceSq(cur.pos, cur.origPos) >= Math.pow(s.draggable.distance, 2))
                cur.started = true;
            if (cur.started) {
                if (typeof cur.element === 'function') {
                    const found = cur.element();
                    if (!found)
                        return;
                    found.cgDragging = true;
                    found.classList.add('dragging');
                    cur.element = found;
                }
                const bounds = s.dom.bounds();
                util.translateAbs(cur.element, [
                    cur.pos[0] - bounds.left - bounds.width / 16,
                    cur.pos[1] - bounds.top - bounds.height / 16
                ]);
            }
        }
        processDrag(s);
    });
}
function move(s, e) {
    if (s.draggable.current && (!e.touches || e.touches.length < 2)) {
        s.draggable.current.pos = util.eventPosition(e);
    }
}
exports.move = move;
function end(s, e) {
    const cur = s.draggable.current;
    if (!cur)
        return;
    if (e.type === 'touchend' && e.cancelable !== false)
        e.preventDefault();
    if (e.type === 'touchend' && cur.originTarget !== e.target && !cur.newPiece) {
        s.draggable.current = undefined;
        return;
    }
    board.unsetPremove(s);
    board.unsetPredrop(s);
    const eventPos = util.eventPosition(e) || cur.pos;
    const dest = board.getKeyAtDomPos(eventPos, board.whitePov(s), s.dom.bounds());
    if (dest && cur.started && cur.orig !== dest) {
        if (cur.newPiece)
            board.dropNewPiece(s, cur.orig, dest, cur.force);
        else {
            s.stats.ctrlKey = e.ctrlKey;
            if (board.userMove(s, cur.orig, dest))
                s.stats.dragged = true;
        }
    }
    else if (cur.newPiece) {
        s.pieces.delete(cur.orig);
    }
    else if (s.draggable.deleteOnDropOff && !dest) {
        s.pieces.delete(cur.orig);
        board.callUserFunction(s.events.change);
    }
    if (cur.orig === cur.previouslySelected && (cur.orig === dest || !dest))
        board.unselect(s);
    else if (!s.selectable.enabled)
        board.unselect(s);
    removeDragElements(s);
    s.draggable.current = undefined;
    s.dom.redraw();
}
exports.end = end;
function cancel(s) {
    const cur = s.draggable.current;
    if (cur) {
        if (cur.newPiece)
            s.pieces.delete(cur.orig);
        s.draggable.current = undefined;
        board.unselect(s);
        removeDragElements(s);
        s.dom.redraw();
    }
}
exports.cancel = cancel;
function removeDragElements(s) {
    const e = s.dom.elements;
    if (e.ghost)
        util.setVisible(e.ghost, false);
}
function pieceElementByKey(s, key) {
    let el = s.dom.elements.board.firstChild;
    while (el) {
        if (el.cgKey === key && el.tagName === 'PIECE')
            return el;
        el = el.nextSibling;
    }
    return;
}

},{"./anim":7,"./board":9,"./draw":13,"./util":23}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clear = exports.cancel = exports.end = exports.move = exports.processDraw = exports.start = void 0;
const board_1 = require("./board");
const util_1 = require("./util");
const brushes = ['green', 'red', 'blue', 'yellow'];
function start(state, e) {
    if (e.touches && e.touches.length > 1)
        return;
    e.stopPropagation();
    e.preventDefault();
    e.ctrlKey ? board_1.unselect(state) : board_1.cancelMove(state);
    const pos = util_1.eventPosition(e), orig = board_1.getKeyAtDomPos(pos, board_1.whitePov(state), state.dom.bounds());
    if (!orig)
        return;
    state.drawable.current = {
        orig,
        pos,
        brush: eventBrush(e),
        snapToValidMove: state.drawable.defaultSnapToValidMove,
    };
    processDraw(state);
}
exports.start = start;
function processDraw(state) {
    requestAnimationFrame(() => {
        const cur = state.drawable.current;
        if (cur) {
            const keyAtDomPos = board_1.getKeyAtDomPos(cur.pos, board_1.whitePov(state), state.dom.bounds());
            if (!keyAtDomPos) {
                cur.snapToValidMove = false;
            }
            const mouseSq = cur.snapToValidMove ?
                board_1.getSnappedKeyAtDomPos(cur.orig, cur.pos, board_1.whitePov(state), state.dom.bounds()) :
                keyAtDomPos;
            if (mouseSq !== cur.mouseSq) {
                cur.mouseSq = mouseSq;
                cur.dest = mouseSq !== cur.orig ? mouseSq : undefined;
                state.dom.redrawNow();
            }
            processDraw(state);
        }
    });
}
exports.processDraw = processDraw;
function move(state, e) {
    if (state.drawable.current)
        state.drawable.current.pos = util_1.eventPosition(e);
}
exports.move = move;
function end(state) {
    const cur = state.drawable.current;
    if (cur) {
        if (cur.mouseSq)
            addShape(state.drawable, cur);
        cancel(state);
    }
}
exports.end = end;
function cancel(state) {
    if (state.drawable.current) {
        state.drawable.current = undefined;
        state.dom.redraw();
    }
}
exports.cancel = cancel;
function clear(state) {
    if (state.drawable.shapes.length) {
        state.drawable.shapes = [];
        state.dom.redraw();
        onChange(state.drawable);
    }
}
exports.clear = clear;
function eventBrush(e) {
    var _a;
    const modA = (e.shiftKey || e.ctrlKey) && util_1.isRightButton(e);
    const modB = e.altKey || e.metaKey || ((_a = e.getModifierState) === null || _a === void 0 ? void 0 : _a.call(e, 'AltGraph'));
    return brushes[(modA ? 1 : 0) + (modB ? 2 : 0)];
}
function addShape(drawable, cur) {
    const sameShape = (s) => s.orig === cur.orig && s.dest === cur.dest;
    const similar = drawable.shapes.find(sameShape);
    if (similar)
        drawable.shapes = drawable.shapes.filter(s => !sameShape(s));
    if (!similar || similar.brush !== cur.brush)
        drawable.shapes.push(cur);
    onChange(drawable);
}
function onChange(drawable) {
    if (drawable.onChange)
        drawable.onChange(drawable.shapes);
}

},{"./board":9,"./util":23}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drop = exports.cancelDropMode = exports.setDropMode = void 0;
const board = require("./board");
const util = require("./util");
const drag_1 = require("./drag");
function setDropMode(s, piece) {
    s.dropmode = {
        active: true,
        piece
    };
    drag_1.cancel(s);
}
exports.setDropMode = setDropMode;
function cancelDropMode(s) {
    s.dropmode = {
        active: false
    };
}
exports.cancelDropMode = cancelDropMode;
function drop(s, e) {
    if (!s.dropmode.active)
        return;
    board.unsetPremove(s);
    board.unsetPredrop(s);
    const piece = s.dropmode.piece;
    if (piece) {
        s.pieces.set('a0', piece);
        const position = util.eventPosition(e);
        const dest = position && board.getKeyAtDomPos(position, board.whitePov(s), s.dom.bounds());
        if (dest)
            board.dropNewPiece(s, 'a0', dest);
    }
    s.dom.redraw();
}
exports.drop = drop;

},{"./board":9,"./drag":12,"./util":23}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindDocument = exports.bindBoard = void 0;
const drag = require("./drag");
const draw = require("./draw");
const drop_1 = require("./drop");
const util_1 = require("./util");
function bindBoard(s, boundsUpdated) {
    const boardEl = s.dom.elements.board;
    if (!s.dom.relative && s.resizable && 'ResizeObserver' in window) {
        const observer = new window['ResizeObserver'](boundsUpdated);
        observer.observe(boardEl);
    }
    if (s.viewOnly)
        return;
    const onStart = startDragOrDraw(s);
    boardEl.addEventListener('touchstart', onStart, { passive: false });
    boardEl.addEventListener('mousedown', onStart, { passive: false });
    if (s.disableContextMenu || s.drawable.enabled) {
        boardEl.addEventListener('contextmenu', e => e.preventDefault());
    }
}
exports.bindBoard = bindBoard;
function bindDocument(s, boundsUpdated) {
    const unbinds = [];
    if (!s.dom.relative && s.resizable && !('ResizeObserver' in window)) {
        unbinds.push(unbindable(document.body, 'chessground.resize', boundsUpdated));
    }
    if (!s.viewOnly) {
        const onmove = dragOrDraw(s, drag.move, draw.move);
        const onend = dragOrDraw(s, drag.end, draw.end);
        for (const ev of ['touchmove', 'mousemove'])
            unbinds.push(unbindable(document, ev, onmove));
        for (const ev of ['touchend', 'mouseup'])
            unbinds.push(unbindable(document, ev, onend));
        const onScroll = () => s.dom.bounds.clear();
        unbinds.push(unbindable(document, 'scroll', onScroll, { capture: true, passive: true }));
        unbinds.push(unbindable(window, 'resize', onScroll, { passive: true }));
    }
    return () => unbinds.forEach(f => f());
}
exports.bindDocument = bindDocument;
function unbindable(el, eventName, callback, options) {
    el.addEventListener(eventName, callback, options);
    return () => el.removeEventListener(eventName, callback, options);
}
function startDragOrDraw(s) {
    return e => {
        if (s.draggable.current)
            drag.cancel(s);
        else if (s.drawable.current)
            draw.cancel(s);
        else if (e.shiftKey || util_1.isRightButton(e)) {
            if (s.drawable.enabled)
                draw.start(s, e);
        }
        else if (!s.viewOnly) {
            if (s.dropmode.active)
                drop_1.drop(s, e);
            else
                drag.start(s, e);
        }
    };
}
function dragOrDraw(s, withDrag, withDraw) {
    return e => {
        if (s.drawable.current) {
            if (s.drawable.enabled)
                withDraw(s, e);
        }
        else if (!s.viewOnly)
            withDrag(s, e);
    };
}

},{"./drag":12,"./draw":13,"./drop":14,"./util":23}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.explosion = void 0;
function explosion(state, keys) {
    state.exploding = { stage: 1, keys };
    state.dom.redraw();
    setTimeout(() => {
        setStage(state, 2);
        setTimeout(() => setStage(state, undefined), 120);
    }, 120);
}
exports.explosion = explosion;
function setStage(state, stage) {
    if (state.exploding) {
        if (stage)
            state.exploding.stage = stage;
        else
            state.exploding = undefined;
        state.dom.redraw();
    }
}

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.write = exports.read = exports.initial = void 0;
const util_1 = require("./util");
const cg = require("./types");
exports.initial = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
const roles = { p: 'pawn', r: 'rook', n: 'knight', b: 'bishop', q: 'queen', k: 'king' };
const letters = { pawn: 'p', rook: 'r', knight: 'n', bishop: 'b', queen: 'q', king: 'k' };
function read(fen) {
    if (fen === 'start')
        fen = exports.initial;
    const pieces = new Map();
    let row = 7, col = 0;
    for (const c of fen) {
        switch (c) {
            case ' ': return pieces;
            case '/':
                --row;
                if (row < 0)
                    return pieces;
                col = 0;
                break;
            case '~':
                const piece = pieces.get(util_1.pos2key([col, row]));
                if (piece)
                    piece.promoted = true;
                break;
            default:
                const nb = c.charCodeAt(0);
                if (nb < 57)
                    col += nb - 48;
                else {
                    const role = c.toLowerCase();
                    pieces.set(util_1.pos2key([col, row]), {
                        role: roles[role],
                        color: c === role ? 'black' : 'white',
                    });
                    ++col;
                }
        }
    }
    return pieces;
}
exports.read = read;
function write(pieces) {
    return util_1.invRanks.map(y => cg.files.map(x => {
        const piece = pieces.get(x + y);
        if (piece) {
            const letter = letters[piece.role];
            return piece.color === 'white' ? letter.toUpperCase() : letter;
        }
        else
            return '1';
    }).join('')).join('/').replace(/1{2,}/g, s => s.length.toString());
}
exports.write = write;

},{"./types":22,"./util":23}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.premove = exports.queen = exports.knight = void 0;
const util = require("./util");
function diff(a, b) {
    return Math.abs(a - b);
}
function pawn(color) {
    return (x1, y1, x2, y2) => diff(x1, x2) < 2 && (color === 'white' ? (y2 === y1 + 1 || (y1 <= 1 && y2 === (y1 + 2) && x1 === x2)) : (y2 === y1 - 1 || (y1 >= 6 && y2 === (y1 - 2) && x1 === x2)));
}
exports.knight = (x1, y1, x2, y2) => {
    const xd = diff(x1, x2);
    const yd = diff(y1, y2);
    return (xd === 1 && yd === 2) || (xd === 2 && yd === 1);
};
const bishop = (x1, y1, x2, y2) => {
    return diff(x1, x2) === diff(y1, y2);
};
const rook = (x1, y1, x2, y2) => {
    return x1 === x2 || y1 === y2;
};
exports.queen = (x1, y1, x2, y2) => {
    return bishop(x1, y1, x2, y2) || rook(x1, y1, x2, y2);
};
function king(color, rookFiles, canCastle) {
    return (x1, y1, x2, y2) => (diff(x1, x2) < 2 && diff(y1, y2) < 2) || (canCastle && y1 === y2 && y1 === (color === 'white' ? 0 : 7) && ((x1 === 4 && ((x2 === 2 && rookFiles.includes(0)) || (x2 === 6 && rookFiles.includes(7)))) ||
        rookFiles.includes(x2)));
}
function rookFilesOf(pieces, color) {
    const backrank = color === 'white' ? '1' : '8';
    const files = [];
    for (const [key, piece] of pieces) {
        if (key[1] === backrank && piece.color === color && piece.role === 'rook') {
            files.push(util.key2pos(key)[0]);
        }
    }
    return files;
}
function premove(pieces, key, canCastle) {
    const piece = pieces.get(key);
    if (!piece)
        return [];
    const pos = util.key2pos(key), r = piece.role, mobility = r === 'pawn' ? pawn(piece.color) : (r === 'knight' ? exports.knight : (r === 'bishop' ? bishop : (r === 'rook' ? rook : (r === 'queen' ? exports.queen : king(piece.color, rookFilesOf(pieces, piece.color), canCastle)))));
    return util.allPos.filter(pos2 => (pos[0] !== pos2[0] || pos[1] !== pos2[1]) && mobility(pos[0], pos[1], pos2[0], pos2[1])).map(util.pos2key);
}
exports.premove = premove;

},{"./util":23}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBounds = exports.render = void 0;
const util_1 = require("./util");
const board_1 = require("./board");
const util = require("./util");
function render(s) {
    const asWhite = board_1.whitePov(s), posToTranslate = s.dom.relative ? util.posToTranslateRel : util.posToTranslateAbs(s.dom.bounds()), translate = s.dom.relative ? util.translateRel : util.translateAbs, boardEl = s.dom.elements.board, pieces = s.pieces, curAnim = s.animation.current, anims = curAnim ? curAnim.plan.anims : new Map(), fadings = curAnim ? curAnim.plan.fadings : new Map(), curDrag = s.draggable.current, squares = computeSquareClasses(s), samePieces = new Set(), sameSquares = new Set(), movedPieces = new Map(), movedSquares = new Map();
    let k, el, pieceAtKey, elPieceName, anim, fading, pMvdset, pMvd, sMvdset, sMvd;
    el = boardEl.firstChild;
    while (el) {
        k = el.cgKey;
        if (isPieceNode(el)) {
            pieceAtKey = pieces.get(k);
            anim = anims.get(k);
            fading = fadings.get(k);
            elPieceName = el.cgPiece;
            if (el.cgDragging && (!curDrag || curDrag.orig !== k)) {
                el.classList.remove('dragging');
                translate(el, posToTranslate(util_1.key2pos(k), asWhite));
                el.cgDragging = false;
            }
            if (!fading && el.cgFading) {
                el.cgFading = false;
                el.classList.remove('fading');
            }
            if (pieceAtKey) {
                if (anim && el.cgAnimating && elPieceName === pieceNameOf(pieceAtKey)) {
                    const pos = util_1.key2pos(k);
                    pos[0] += anim[2];
                    pos[1] += anim[3];
                    el.classList.add('anim');
                    translate(el, posToTranslate(pos, asWhite));
                }
                else if (el.cgAnimating) {
                    el.cgAnimating = false;
                    el.classList.remove('anim');
                    translate(el, posToTranslate(util_1.key2pos(k), asWhite));
                    if (s.addPieceZIndex)
                        el.style.zIndex = posZIndex(util_1.key2pos(k), asWhite);
                }
                if (elPieceName === pieceNameOf(pieceAtKey) && (!fading || !el.cgFading)) {
                    samePieces.add(k);
                }
                else {
                    if (fading && elPieceName === pieceNameOf(fading)) {
                        el.classList.add('fading');
                        el.cgFading = true;
                    }
                    else {
                        appendValue(movedPieces, elPieceName, el);
                    }
                }
            }
            else {
                appendValue(movedPieces, elPieceName, el);
            }
        }
        else if (isSquareNode(el)) {
            const cn = el.className;
            if (squares.get(k) === cn)
                sameSquares.add(k);
            else
                appendValue(movedSquares, cn, el);
        }
        el = el.nextSibling;
    }
    for (const [sk, className] of squares) {
        if (!sameSquares.has(sk)) {
            sMvdset = movedSquares.get(className);
            sMvd = sMvdset && sMvdset.pop();
            const translation = posToTranslate(util_1.key2pos(sk), asWhite);
            if (sMvd) {
                sMvd.cgKey = sk;
                translate(sMvd, translation);
            }
            else {
                const squareNode = util_1.createEl('square', className);
                squareNode.cgKey = sk;
                translate(squareNode, translation);
                boardEl.insertBefore(squareNode, boardEl.firstChild);
            }
        }
    }
    for (const [k, p] of pieces) {
        anim = anims.get(k);
        if (!samePieces.has(k)) {
            pMvdset = movedPieces.get(pieceNameOf(p));
            pMvd = pMvdset && pMvdset.pop();
            if (pMvd) {
                pMvd.cgKey = k;
                if (pMvd.cgFading) {
                    pMvd.classList.remove('fading');
                    pMvd.cgFading = false;
                }
                const pos = util_1.key2pos(k);
                if (s.addPieceZIndex)
                    pMvd.style.zIndex = posZIndex(pos, asWhite);
                if (anim) {
                    pMvd.cgAnimating = true;
                    pMvd.classList.add('anim');
                    pos[0] += anim[2];
                    pos[1] += anim[3];
                }
                translate(pMvd, posToTranslate(pos, asWhite));
            }
            else {
                const pieceName = pieceNameOf(p), pieceNode = util_1.createEl('piece', pieceName), pos = util_1.key2pos(k);
                pieceNode.cgPiece = pieceName;
                pieceNode.cgKey = k;
                if (anim) {
                    pieceNode.cgAnimating = true;
                    pos[0] += anim[2];
                    pos[1] += anim[3];
                }
                translate(pieceNode, posToTranslate(pos, asWhite));
                if (s.addPieceZIndex)
                    pieceNode.style.zIndex = posZIndex(pos, asWhite);
                boardEl.appendChild(pieceNode);
            }
        }
    }
    for (const nodes of movedPieces.values())
        removeNodes(s, nodes);
    for (const nodes of movedSquares.values())
        removeNodes(s, nodes);
}
exports.render = render;
function updateBounds(s) {
    if (s.dom.relative)
        return;
    const asWhite = board_1.whitePov(s), posToTranslate = util.posToTranslateAbs(s.dom.bounds());
    let el = s.dom.elements.board.firstChild;
    while (el) {
        if ((isPieceNode(el) && !el.cgAnimating) || isSquareNode(el)) {
            util.translateAbs(el, posToTranslate(util_1.key2pos(el.cgKey), asWhite));
        }
        el = el.nextSibling;
    }
}
exports.updateBounds = updateBounds;
function isPieceNode(el) {
    return el.tagName === 'PIECE';
}
function isSquareNode(el) {
    return el.tagName === 'SQUARE';
}
function removeNodes(s, nodes) {
    for (const node of nodes)
        s.dom.elements.board.removeChild(node);
}
function posZIndex(pos, asWhite) {
    let z = 2 + pos[1] * 8 + (7 - pos[0]);
    if (asWhite)
        z = 67 - z;
    return z + '';
}
function pieceNameOf(piece) {
    return `${piece.color} ${piece.role}`;
}
function computeSquareClasses(s) {
    var _a;
    const squares = new Map();
    if (s.lastMove && s.highlight.lastMove)
        for (const k of s.lastMove) {
            addSquare(squares, k, 'last-move');
        }
    if (s.check && s.highlight.check)
        addSquare(squares, s.check, 'check');
    if (s.selected) {
        addSquare(squares, s.selected, 'selected');
        if (s.movable.showDests) {
            const dests = (_a = s.movable.dests) === null || _a === void 0 ? void 0 : _a.get(s.selected);
            if (dests)
                for (const k of dests) {
                    addSquare(squares, k, 'move-dest' + (s.pieces.has(k) ? ' oc' : ''));
                }
            const pDests = s.premovable.dests;
            if (pDests)
                for (const k of pDests) {
                    addSquare(squares, k, 'premove-dest' + (s.pieces.has(k) ? ' oc' : ''));
                }
        }
    }
    const premove = s.premovable.current;
    if (premove)
        for (const k of premove)
            addSquare(squares, k, 'current-premove');
    else if (s.predroppable.current)
        addSquare(squares, s.predroppable.current.key, 'current-premove');
    const o = s.exploding;
    if (o)
        for (const k of o.keys)
            addSquare(squares, k, 'exploding' + o.stage);
    return squares;
}
function addSquare(squares, key, klass) {
    const classes = squares.get(key);
    if (classes)
        squares.set(key, `${classes} ${klass}`);
    else
        squares.set(key, klass);
}
function appendValue(map, key, value) {
    const arr = map.get(key);
    if (arr)
        arr.push(value);
    else
        map.set(key, [value]);
}

},{"./board":9,"./util":23}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaults = void 0;
const fen = require("./fen");
const util_1 = require("./util");
function defaults() {
    return {
        pieces: fen.read(fen.initial),
        orientation: 'white',
        turnColor: 'white',
        coordinates: true,
        autoCastle: true,
        viewOnly: false,
        disableContextMenu: false,
        resizable: true,
        addPieceZIndex: false,
        pieceKey: false,
        highlight: {
            lastMove: true,
            check: true
        },
        animation: {
            enabled: true,
            duration: 200
        },
        movable: {
            free: true,
            color: 'both',
            showDests: true,
            events: {},
            rookCastle: true
        },
        premovable: {
            enabled: true,
            showDests: true,
            castle: true,
            events: {}
        },
        predroppable: {
            enabled: false,
            events: {}
        },
        draggable: {
            enabled: true,
            distance: 3,
            autoDistance: true,
            showGhost: true,
            deleteOnDropOff: false
        },
        dropmode: {
            active: false
        },
        selectable: {
            enabled: true
        },
        stats: {
            dragged: !('ontouchstart' in window)
        },
        events: {},
        drawable: {
            enabled: true,
            visible: true,
            defaultSnapToValidMove: true,
            eraseOnClick: true,
            shapes: [],
            autoShapes: [],
            brushes: {
                green: { key: 'g', color: '#15781B', opacity: 1, lineWidth: 10 },
                red: { key: 'r', color: '#882020', opacity: 1, lineWidth: 10 },
                blue: { key: 'b', color: '#003088', opacity: 1, lineWidth: 10 },
                yellow: { key: 'y', color: '#e68f00', opacity: 1, lineWidth: 10 },
                paleBlue: { key: 'pb', color: '#003088', opacity: 0.4, lineWidth: 15 },
                paleGreen: { key: 'pg', color: '#15781B', opacity: 0.4, lineWidth: 15 },
                paleRed: { key: 'pr', color: '#882020', opacity: 0.4, lineWidth: 15 },
                paleGrey: { key: 'pgr', color: '#4a4a4a', opacity: 0.35, lineWidth: 15 }
            },
            pieces: {
                baseUrl: 'https://lichess1.org/assets/piece/cburnett/'
            },
            prevSvgHash: ''
        },
        hold: util_1.timer()
    };
}
exports.defaults = defaults;

},{"./fen":17,"./util":23}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderSvg = exports.createElement = void 0;
const util_1 = require("./util");
function createElement(tagName) {
    return document.createElementNS('http://www.w3.org/2000/svg', tagName);
}
exports.createElement = createElement;
function renderSvg(state, root) {
    const d = state.drawable, curD = d.current, cur = curD && curD.mouseSq ? curD : undefined, arrowDests = new Map(), bounds = state.dom.bounds();
    for (const s of d.shapes.concat(d.autoShapes).concat(cur ? [cur] : [])) {
        if (s.dest)
            arrowDests.set(s.dest, (arrowDests.get(s.dest) || 0) + 1);
    }
    const shapes = d.shapes.concat(d.autoShapes).map((s) => {
        return {
            shape: s,
            current: false,
            hash: shapeHash(s, arrowDests, false, bounds)
        };
    });
    if (cur)
        shapes.push({
            shape: cur,
            current: true,
            hash: shapeHash(cur, arrowDests, true, bounds)
        });
    const fullHash = shapes.map(sc => sc.hash).join(';');
    if (fullHash === state.drawable.prevSvgHash)
        return;
    state.drawable.prevSvgHash = fullHash;
    const defsEl = root.firstChild;
    syncDefs(d, shapes, defsEl);
    syncShapes(state, shapes, d.brushes, arrowDests, root, defsEl);
}
exports.renderSvg = renderSvg;
function syncDefs(d, shapes, defsEl) {
    const brushes = new Map();
    let brush;
    for (const s of shapes) {
        if (s.shape.dest) {
            brush = d.brushes[s.shape.brush];
            if (s.shape.modifiers)
                brush = makeCustomBrush(brush, s.shape.modifiers);
            brushes.set(brush.key, brush);
        }
    }
    const keysInDom = new Set();
    let el = defsEl.firstChild;
    while (el) {
        keysInDom.add(el.getAttribute('cgKey'));
        el = el.nextSibling;
    }
    for (const [key, brush] of brushes.entries()) {
        if (!keysInDom.has(key))
            defsEl.appendChild(renderMarker(brush));
    }
}
function syncShapes(state, shapes, brushes, arrowDests, root, defsEl) {
    const bounds = state.dom.bounds(), hashesInDom = new Map(), toRemove = [];
    for (const sc of shapes)
        hashesInDom.set(sc.hash, false);
    let el = defsEl.nextSibling, elHash;
    while (el) {
        elHash = el.getAttribute('cgHash');
        if (hashesInDom.has(elHash))
            hashesInDom.set(elHash, true);
        else
            toRemove.push(el);
        el = el.nextSibling;
    }
    for (const el of toRemove)
        root.removeChild(el);
    for (const sc of shapes) {
        if (!hashesInDom.get(sc.hash))
            root.appendChild(renderShape(state, sc, brushes, arrowDests, bounds));
    }
}
function shapeHash({ orig, dest, brush, piece, modifiers }, arrowDests, current, bounds) {
    return [bounds.width, bounds.height, current, orig, dest, brush, dest && (arrowDests.get(dest) || 0) > 1,
        piece && pieceHash(piece),
        modifiers && modifiersHash(modifiers)
    ].filter(x => x).join(',');
}
function pieceHash(piece) {
    return [piece.color, piece.role, piece.scale].filter(x => x).join(',');
}
function modifiersHash(m) {
    return '' + (m.lineWidth || '');
}
function renderShape(state, { shape, current, hash }, brushes, arrowDests, bounds) {
    let el;
    if (shape.piece)
        el = renderPiece(state.drawable.pieces.baseUrl, orient(util_1.key2pos(shape.orig), state.orientation), shape.piece, bounds);
    else {
        const orig = orient(util_1.key2pos(shape.orig), state.orientation);
        if (shape.dest) {
            let brush = brushes[shape.brush];
            if (shape.modifiers)
                brush = makeCustomBrush(brush, shape.modifiers);
            el = renderArrow(brush, orig, orient(util_1.key2pos(shape.dest), state.orientation), current, (arrowDests.get(shape.dest) || 0) > 1, bounds);
        }
        else
            el = renderCircle(brushes[shape.brush], orig, current, bounds);
    }
    el.setAttribute('cgHash', hash);
    return el;
}
function renderCircle(brush, pos, current, bounds) {
    const o = pos2px(pos, bounds), widths = circleWidth(bounds), radius = (bounds.width + bounds.height) / 32;
    return setAttributes(createElement('circle'), {
        stroke: brush.color,
        'stroke-width': widths[current ? 0 : 1],
        fill: 'none',
        opacity: opacity(brush, current),
        cx: o[0],
        cy: o[1],
        r: radius - widths[1] / 2
    });
}
function renderArrow(brush, orig, dest, current, shorten, bounds) {
    const m = arrowMargin(bounds, shorten && !current), a = pos2px(orig, bounds), b = pos2px(dest, bounds), dx = b[0] - a[0], dy = b[1] - a[1], angle = Math.atan2(dy, dx), xo = Math.cos(angle) * m, yo = Math.sin(angle) * m;
    return setAttributes(createElement('line'), {
        stroke: brush.color,
        'stroke-width': lineWidth(brush, current, bounds),
        'stroke-linecap': 'round',
        'marker-end': 'url(#arrowhead-' + brush.key + ')',
        opacity: opacity(brush, current),
        x1: a[0],
        y1: a[1],
        x2: b[0] - xo,
        y2: b[1] - yo
    });
}
function renderPiece(baseUrl, pos, piece, bounds) {
    const o = pos2px(pos, bounds), size = bounds.width / 8 * (piece.scale || 1), name = piece.color[0] + (piece.role === 'knight' ? 'n' : piece.role[0]).toUpperCase();
    return setAttributes(createElement('image'), {
        className: `${piece.role} ${piece.color}`,
        x: o[0] - size / 2,
        y: o[1] - size / 2,
        width: size,
        height: size,
        href: baseUrl + name + '.svg'
    });
}
function renderMarker(brush) {
    const marker = setAttributes(createElement('marker'), {
        id: 'arrowhead-' + brush.key,
        orient: 'auto',
        markerWidth: 4,
        markerHeight: 8,
        refX: 2.05,
        refY: 2.01
    });
    marker.appendChild(setAttributes(createElement('path'), {
        d: 'M0,0 V4 L3,2 Z',
        fill: brush.color
    }));
    marker.setAttribute('cgKey', brush.key);
    return marker;
}
function setAttributes(el, attrs) {
    for (const key in attrs)
        el.setAttribute(key, attrs[key]);
    return el;
}
function orient(pos, color) {
    return color === 'white' ? pos : [7 - pos[0], 7 - pos[1]];
}
function makeCustomBrush(base, modifiers) {
    return {
        color: base.color,
        opacity: Math.round(base.opacity * 10) / 10,
        lineWidth: Math.round(modifiers.lineWidth || base.lineWidth),
        key: [base.key, modifiers.lineWidth].filter(x => x).join(''),
    };
}
function circleWidth(bounds) {
    const base = bounds.width / 512;
    return [3 * base, 4 * base];
}
function lineWidth(brush, current, bounds) {
    return (brush.lineWidth || 10) * (current ? 0.85 : 1) / 512 * bounds.width;
}
function opacity(brush, current) {
    return (brush.opacity || 1) * (current ? 0.9 : 1);
}
function arrowMargin(bounds, shorten) {
    return (shorten ? 20 : 10) / 512 * bounds.width;
}
function pos2px(pos, bounds) {
    return [(pos[0] + 0.5) * bounds.width / 8, (7.5 - pos[1]) * bounds.height / 8];
}

},{"./util":23}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ranks = exports.files = exports.colors = void 0;
exports.colors = ['white', 'black'];
exports.files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
exports.ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

},{}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeSquareCenter = exports.createEl = exports.isRightButton = exports.eventPosition = exports.setVisible = exports.translateRel = exports.translateAbs = exports.posToTranslateRel = exports.posToTranslateAbs = exports.samePiece = exports.distanceSq = exports.opposite = exports.timer = exports.memo = exports.allPos = exports.key2pos = exports.pos2key = exports.allKeys = exports.invRanks = void 0;
const cg = require("./types");
exports.invRanks = [...cg.ranks].reverse();
exports.allKeys = Array.prototype.concat(...cg.files.map(c => cg.ranks.map(r => c + r)));
exports.pos2key = (pos) => exports.allKeys[8 * pos[0] + pos[1]];
exports.key2pos = (k) => [k.charCodeAt(0) - 97, k.charCodeAt(1) - 49];
exports.allPos = exports.allKeys.map(exports.key2pos);
function memo(f) {
    let v;
    const ret = () => {
        if (v === undefined)
            v = f();
        return v;
    };
    ret.clear = () => { v = undefined; };
    return ret;
}
exports.memo = memo;
exports.timer = () => {
    let startAt;
    return {
        start() { startAt = performance.now(); },
        cancel() { startAt = undefined; },
        stop() {
            if (!startAt)
                return 0;
            const time = performance.now() - startAt;
            startAt = undefined;
            return time;
        }
    };
};
exports.opposite = (c) => c === 'white' ? 'black' : 'white';
exports.distanceSq = (pos1, pos2) => {
    const dx = pos1[0] - pos2[0], dy = pos1[1] - pos2[1];
    return dx * dx + dy * dy;
};
exports.samePiece = (p1, p2) => p1.role === p2.role && p1.color === p2.color;
const posToTranslateBase = (pos, asWhite, xFactor, yFactor) => [
    (asWhite ? pos[0] : 7 - pos[0]) * xFactor,
    (asWhite ? 7 - pos[1] : pos[1]) * yFactor
];
exports.posToTranslateAbs = (bounds) => {
    const xFactor = bounds.width / 8, yFactor = bounds.height / 8;
    return (pos, asWhite) => posToTranslateBase(pos, asWhite, xFactor, yFactor);
};
exports.posToTranslateRel = (pos, asWhite) => posToTranslateBase(pos, asWhite, 100, 100);
exports.translateAbs = (el, pos) => {
    el.style.transform = `translate(${pos[0]}px,${pos[1]}px)`;
};
exports.translateRel = (el, percents) => {
    el.style.transform = `translate(${percents[0]}%,${percents[1]}%)`;
};
exports.setVisible = (el, v) => {
    el.style.visibility = v ? 'visible' : 'hidden';
};
exports.eventPosition = (e) => {
    var _a;
    if (e.clientX || e.clientX === 0)
        return [e.clientX, e.clientY];
    if ((_a = e.targetTouches) === null || _a === void 0 ? void 0 : _a[0])
        return [e.targetTouches[0].clientX, e.targetTouches[0].clientY];
    return;
};
exports.isRightButton = (e) => e.buttons === 2 || e.button === 2;
exports.createEl = (tagName, className) => {
    const el = document.createElement(tagName);
    if (className)
        el.className = className;
    return el;
};
function computeSquareCenter(key, asWhite, bounds) {
    const pos = exports.key2pos(key);
    if (!asWhite) {
        pos[0] = 7 - pos[0];
        pos[1] = 7 - pos[1];
    }
    return [
        bounds.left + bounds.width * pos[0] / 8 + bounds.width / 16,
        bounds.top + bounds.height * (7 - pos[1]) / 8 + bounds.height / 16
    ];
}
exports.computeSquareCenter = computeSquareCenter;

},{"./types":22}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderWrap = void 0;
const util_1 = require("./util");
const types_1 = require("./types");
const svg_1 = require("./svg");
function renderWrap(element, s, relative) {
    element.innerHTML = '';
    element.classList.add('cg-wrap');
    for (const c of types_1.colors)
        element.classList.toggle('orientation-' + c, s.orientation === c);
    element.classList.toggle('manipulable', !s.viewOnly);
    const helper = util_1.createEl('cg-helper');
    element.appendChild(helper);
    const container = util_1.createEl('cg-container');
    helper.appendChild(container);
    const board = util_1.createEl('cg-board');
    container.appendChild(board);
    let svg;
    if (s.drawable.visible && !relative) {
        svg = svg_1.createElement('svg');
        svg.appendChild(svg_1.createElement('defs'));
        container.appendChild(svg);
    }
    if (s.coordinates) {
        const orientClass = s.orientation === 'black' ? ' black' : '';
        container.appendChild(renderCoords(types_1.ranks, 'ranks' + orientClass));
        container.appendChild(renderCoords(types_1.files, 'files' + orientClass));
    }
    let ghost;
    if (s.draggable.showGhost && !relative) {
        ghost = util_1.createEl('piece', 'ghost');
        util_1.setVisible(ghost, false);
        container.appendChild(ghost);
    }
    return {
        board,
        container,
        ghost,
        svg
    };
}
exports.renderWrap = renderWrap;
function renderCoords(elems, className) {
    const el = util_1.createEl('coords', className);
    let f;
    for (const elem of elems) {
        f = util_1.createEl('coord');
        f.textContent = elem;
        el.appendChild(f);
    }
    return el;
}

},{"./svg":21,"./types":22,"./util":23}]},{},[4,1,5,2,3,6]);
