let links = document.getElementsByClassName('widget-link');
for (let link of links) {
    link.addEventListener('click', function () {
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
chatButton.addEventListener('click', function () {

    let input = document.getElementById('chat-input');
    let chatLog = document.getElementById('chat-messages');
    chatLog.innerHTML += `<li class="user-message">${input.value}</li>`;
    input.value = null;
});

let noteButton = document.getElementById('notes-button');
noteButton.addEventListener('click', function () {
    let input = document.getElementById('notes-input');
    let notesLog = document.getElementById('notes');
    notesLog.innerHTML += `<li class="note">${input.value}</li> `
    input.value = null;
});

let endGame = document.getElementsByClassName('endgame')[0];
endGame.addEventListener('click', function () {
    let btns = document.getElementsByClassName('end-buttons')[0];
    btns.style.display = 'flex';
});

let close = document.getElementsByClassName('window-close')[0];
close.addEventListener('click', function(e){
    e.stopPropagation();
    closeWindow();
});

let resign = document.getElementById('resign');
resign.addEventListener('click', function (e) {
    e.stopPropagation();
    closeWindow();
    game.set_resign(true);
    let gameUpdate = new GameUpdate(me.textContent, opponent.textContent, null, null);
    gameUpdate.resign();
    stompClient.send('/app/updateOpponent', {}, JSON.stringify(gameUpdate.getObj()));
    displayResult('Resignation');

});

let draw = document.getElementById('offer_draw');
draw.addEventListener('click', function (e) {
    e.stopPropagation();
    closeWindow();
    let gameUpdate = new GameUpdate(me.textContent, opponent.textContent, null, null);
    gameUpdate.offerDraw();
    stompClient.send('/app/updateOpponent', {}, JSON.stringify(gameUpdate.getObj()));
});

let accept = document.getElementById('accept');
accept.addEventListener('click', function () {
    displayResult('draw agreement');
    afterDrawDecision();
    game.set_draw(true);
    let gameUpdate = new GameUpdate(me.textContent, opponent.textContent, null, null);
    gameUpdate.acceptDraw();
    stompClient.send('/app/updateOpponent', {}, JSON.stringify(gameUpdate.getObj()));
});

let decline = document.getElementById('decline');
decline.addEventListener('click', function () {
    afterDrawDecision();
    let gameUpdate = new GameUpdate(me.textContent, opponent.textContent, null, null);
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
    currSelected = document.getElementsByClassName('selected')[0]

    let dataSet = currSelected.dataset.for;
    let ref = document.getElementById(dataSet);
    ref.classList.toggle('active');
}

