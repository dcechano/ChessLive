const connectBtn = document.getElementById('connect');
const disconnectBtn = document.getElementById('disconnect');
const input = document.getElementById('input');
const sendBtn = document.getElementById('send');
const output = document.getElementById('output');
var stompClient = null;
console.log('Connected!');

sendBtn.addEventListener('click', function () {
    console.log("inside send event listener");
    console.log(`The value being sent is ${input.value}`);
    sendMessage(input.value);
});

connectBtn.addEventListener('click', function () {
    connect();
});

function connect() {
    let socket = new SockJS('/chess-lite');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/get-move/1', function (greeting) {
            showMessage(JSON.parse(greeting.body).pgn);
        });
    });
}

function sendMessage(msg) {
    console.log(`Sending message ${msg}`);
    stompClient.send('/app/game/1', {}, JSON.stringify({'pgn': msg}))
    // stompClient.send("/app/game", {}, JSON.stringify({'pgn': 'hello world!'}))
}

function showMessage(msg) {
    console.log(msg);
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    let txt = document.createTextNode(msg);
    td.appendChild(txt);
    tr.appendChild(td);
    output.appendChild(tr);
}