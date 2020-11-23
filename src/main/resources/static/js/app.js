console.log('connected to app.js');

let links = document.getElementsByClassName('widget-link');
for (let link of links) {
    link.addEventListener('click', () => {
        console.log(this);
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