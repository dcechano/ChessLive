class GameUpdate {

    constructor(from, to, newMove, newPosition, seconds) {
        this.from = from;
        this.to = to;
        this.newMove = newMove;
        this.updateType = 'NEW_MOVE';
        this.seconds = seconds;
    }

    resign() {
        this.updateType = 'RESIGNATION';
    }

    offerDraw() {
        this.updateType = 'DRAW_OFFER';
    }

    acceptDraw() {
        this.updateType = "ACCEPT_DRAW";
    }

    declineDraw() {
        this.updateType = "DECLINE_DRAW";
    }
}

module.exports = GameUpdate;