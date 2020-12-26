class GameUpdate {

    constructor(from, to, newMove, newPosition) {
        this.from = from;
        this.to = to;
        this.newMove = newMove;
        this.newPosition = newPosition;
        this.updateType = 'NEW_MOVE';
    }

    getObj() {
        return {
            from: this.from,
            to: this.to,
            newMove: this.newMove,
            newPosition: this.newPosition,
            updateType: this.updateType
        };
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