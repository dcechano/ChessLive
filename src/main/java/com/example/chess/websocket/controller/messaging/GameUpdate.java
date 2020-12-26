package com.example.chess.websocket.controller.messaging;

import org.springframework.stereotype.Component;

@Component
public class GameUpdate {

    private String from;

    private String to;

    private String newMove;

    private String newPosition;

    private UpdateType updateType;


    public enum UpdateType {
        NEW_MOVE,
        RESIGNATION,
        DRAW_OFFER,
        ACCEPT_DRAW,
        DECLINE_DRAW
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

    @Override
    public String toString() {
        return "GameUpdate{" +
                "from='" + from + '\'' +
                ", to='" + to + '\'' +
                ", newMove='" + newMove + '\'' +
                ", newPosition='" + newPosition + '\'' +
                ", type=" + updateType +
                '}';
    }
}
