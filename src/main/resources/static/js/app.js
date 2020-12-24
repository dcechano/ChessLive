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
    let btns = document.getElementsByClassName('end-buttons')[0];
    btns.style.display = 'none';
});

let resign = document.getElementById('resign');
resign.addEventListener('click', function () {
    let gameUpdate = new GameUpdate(me.textContent, opponent.textContent, null, null);
    gameUpdate.resign();
    stompClient.send('/app/updateOpponent', {}, JSON.stringify(gameUpdate.getObj()));
});

let draw = document.getElementById('offer_draw');
draw.addEventListener('click', function () {
    let gameUpdate = new GameUpdate(me.textContent, opponent.textContent, null, null);
    gameUpdate.draw();
    stompClient.send('/app/updateOpponent', {}, JSON.stringify(gameUpdate.getObj()));
});

