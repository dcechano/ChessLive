const timeControl = JSON.parse(document.getElementById('gameAsJSON').value).timeControl;
const myClock = new Clock(timeControl, document.getElementById('clock2'));
const opponentClock = new Clock(timeControl, document.getElementById('clock1'));

setInterval(function () {
    myClock.run();
    opponentClock.run();
}, 1000);
