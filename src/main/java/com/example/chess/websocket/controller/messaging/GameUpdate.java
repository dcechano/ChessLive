package com.example.chess.websocket.controller.messaging;

import org.springframework.stereotype.Component;

@Component
public class GameUpdate {

    private String from;

    private String to;

    private String newMove;

    private String newPosition;

    public GameUpdate() {
    }

    public GameUpdate(String from, String to, String newMove, String newPosition) {
        this.from = from;
        this.to = to;
        this.newMove = newMove;
        this.newPosition = newPosition;
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

    @Override
    public String toString() {
        return "GameUpdate{" +
                "from='" + from + '\'' +
                ", to='" + to + '\'' +
                ", newPosition=" + newPosition +
                '}';
    }
}
