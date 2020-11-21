let stompClient = null;

(function () {
    let socket = new SockJS('/chess-lite');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log(`Logging frame: ${frame}`);
        stompClient.subscribe('/get-move/1', function (data) {
            console.log(data);
            let json = JSON.parse(data.body).pgn;
            console.log(`Printing parsed JSON: ${json}`);
            board.position(json);
        });

    });
})();
