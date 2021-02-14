const app = require('./app_chess');
const stompClient = app.stompClient,
    chess = app.chess,
    board = app.board,
    me = app.me,
    opponent = app.opponent,
    stopClocks = app.stopClocks,
    displayResult = app.displayResult;



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

let chatButton = document.getElementById('chat-button');
chatButton.addEventListener('click', () => {

    let input = document.getElementById('chat-input');
    let chatLog = document.getElementById('chat-messages');
    chatLog.innerHTML += `<li class="user-message">${input.value}</li>`;
    input.value = null;
});

let noteButton = document.getElementById('notes-button');
noteButton.addEventListener('click', () => {
    let input = document.getElementById('notes-input');
    let notesLog = document.getElementById('notes');
    notesLog.innerHTML += `<li class="note">${input.value}</li> `
    input.value = null;
});

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
    stompClient.send('/app/updateOpponent', {}, JSON.stringify(gameUpdate.getObj()));
    displayResult('Resignation');

});

let draw = document.getElementById('offer_draw');
draw.addEventListener('click', (e) => {
    e.stopPropagation();
    closeWindow();
    let gameUpdate = new GameUpdate(me.textContent, opponent.textContent);
    gameUpdate.offerDraw();
    stompClient.send('/app/updateOpponent', {}, JSON.stringify(gameUpdate.getObj()));
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
    stompClient.send('/app/updateOpponent', {}, JSON.stringify(gameUpdate.getObj()));
});

let decline = document.getElementById('decline');
decline.addEventListener('click', () => {
    afterDrawDecision();
    let gameUpdate = new GameUpdate(me.textContent, opponent.textContent);
    gameUpdate.declineDraw();
    stompClient.send('/app/updateOpponent', {}, JSON.stringify(gameUpdate.getObj()));

});

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