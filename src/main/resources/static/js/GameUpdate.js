class GameUpdate {

    constructor(from, to, newMove, newPosition) {
        this.from = from;
        this.to = to;
        this.newMove = newMove;
        this.newPosition = newPosition;
    }

    getObj() {
        return {
            from: this.from,
            to: this.to,
            newMove: this.newMove,
            newPosition: this.newPosition
        };
    }
}