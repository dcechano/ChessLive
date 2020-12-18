let stompClient;
let sessionId;

(function () {
    let socket = new SockJS('/chess-lite');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log(frame);
        let url = stompClient.ws._transport.url;

        url = url.replace("ws://localhost:8080/chess-lite/", "");
        url = url.replace("/websocket", "");
        url = url.replace(/^[0-9]+\//, "");
        console.log(`The sessionId is: ${url}`);
        sessionId = url;

        stompClient.subscribe('/user/queue/private', function (data) {
            message = JSON.stringify(data.body);
            console.log("Printing message");
            console.log(message);
        });

        stompClient.subscribe("/topic/questions", function (data) {
            message = JSON.stringify(data.body);
            console.log("message from the /topic/questions subscription");
            console.log(message);
        });
    });

})();

setTimeout(function () {
    let msg = {
        from: sessionId,
        to: `user${sessionId}`,
        FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
    };
    console.log("Sending the message to the server!")
    stompClient.send('/app/message', {}, JSON.stringify(msg));
    console.log("Message sent");
}, 3000);

let sendButton = document.getElementById('sendButton');

sendButton.addEventListener('click', function () {
    let question = document.getElementById('question').value;
    stompClient.send('/app/questions', {}, JSON.stringify(question));
});

let sendToUser = document.getElementById("sendToUser");
sendToUser.addEventListener('click', function () {
    let msg = {
        from: 'dylan',
        to: 'jane',
        FEN: 'Hello, Jane!'
    };

    console.log("sending message to specific user")
    stompClient.send('/app/sendToUser', {}, JSON.stringify(msg));
});