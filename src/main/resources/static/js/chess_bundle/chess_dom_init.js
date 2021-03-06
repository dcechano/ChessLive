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

let prevScroll = window.pageYOffset;
window.onscroll = () => {
    let nav = document.getElementsByClassName('nav')[0];

    let currentScrollPos = window.pageYOffset;
    if (prevScroll > currentScrollPos) {
        nav.style.top = '0';
    } else {
        nav.style.top = '-50px';
    }
    prevScroll = currentScrollPos;
}

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

function closeWindow() {
    let btns = document.getElementsByClassName('end-buttons')[0];
    btns.style.display = 'none';
}

function afterDrawDecision() {
    let currActive = document.getElementsByClassName('active')[0];
    currActive.classList.toggle('active');
    let currSelected = document.getElementsByClassName('selected')[0]

    let dataSet = currSelected.dataset.for;
    let ref = document.getElementById(dataSet);
    ref.classList.toggle('active');
}