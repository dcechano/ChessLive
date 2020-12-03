let stompClient = null;
let sessionId;

(function () {
    let socket = new SockJS('/chess-lite');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        let urlarray = socket._transport.url.split('/');
        sessionId = urlarray[urlarray.length - 2];
        register(sessionId);

        console.log(`Logging frame: ${frame}`);

        stompClient.subscribe(`/topic/${sessionId}`, function (data) {
            console.log(data);
            let json = JSON.parse(data.body);
            console.log(`Printing the game data: ${JSON.stringify(json)}`);
        });

        stompClient.subscribe('/topic/new_game', function (data) {
            console.log(data);
            let json = JSON.parse(data.body).id;
            console.log(`Printing parsed JSON: ${json}`);
            console.log("updating board position");
            board.position(json);
        });

        stompClient.subscribe("/get/new_move", function (data) {
            console.log(data);
            let json = JSON.parse(data.body);
            console.log(`Logging data directed at the session ${JSON.stringify(json)}`);
        });

    });

})();

function register(sessionId) {
    stompClient.send("/app/register", {}, JSON.stringify(sessionId));
}
