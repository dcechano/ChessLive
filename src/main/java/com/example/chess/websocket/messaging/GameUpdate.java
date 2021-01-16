package com.example.chess.websocket.messaging;


public class GameUpdate {

    private String from;

    private String to;

    private String newMove;

    private String newPosition;

    private UpdateType updateType;

    private int seconds;

    public enum UpdateType {
        NEW_MOVE,
        RESIGNATION,
        DRAW_OFFER,
        ACCEPT_DRAW,
        DECLINE_DRAW;

        UpdateType() {
        }
    }

    public GameUpdate() {
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getNewMove() {
        return newMove;
    }

    public void setNewMove(String newMove) {
        this.newMove = newMove;
    }

    public String getNewPosition() {
        return newPosition;
    }

    public void setNewPosition(String newPosition) {
        this.newPosition = newPosition;
    }

    public UpdateType getUpdateType() {
        return updateType;
    }

    public void setUpdateType(UpdateType updateType) {
        this.updateType = updateType;
    }

    public int getSeconds() {
        return seconds;
    }

    public void setSeconds(int seconds) {
        this.seconds = seconds;
    }

    @Override
    public String toString() {
        return "GameUpdate{" +
                "from='" + from + '\'' +
                ", to='" + to + '\'' +
                ", newMove='" + newMove + '\'' +
                ", newPosition='" + newPosition + '\'' +
                ", updateType=" + updateType +
                ", seconds=" + seconds +
                '}';
    }
}
