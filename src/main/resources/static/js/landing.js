let stompClient;
let sessionId;

(function () {
    let socket = new SockJS('/chess-lite');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        let urlArray = socket._transport.url.split('/');
        sessionId = urlArray[urlArray.length - 2];
        console.log(`Logging frame: ${frame}`);


        stompClient.subscribe('/secured/history', function (data) {
            console.log(data);
            let json = JSON.parse(data.body).pgn;
            console.log(`Printing data from secured endpoint: ${json}`);
        });

    });
})();

function newGame(time_control) {
    console.log('sending the new game request to the server');
    stompClient.send(`/app/new_game/${time_control}/${sessionId}`, {});
}

let links = document.getElementsByClassName('time-control');

for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function () {
        let time = links[i].dataset.time;
        // newGame(time);
    });
}

let test_button = document.getElementById('test_button');
test_button.addEventListener('click', function () {
    console.log("attempting to hit the secured endpoint");
    stompClient.send("/app/chess-lite", {});
});