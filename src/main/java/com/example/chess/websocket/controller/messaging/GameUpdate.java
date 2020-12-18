package com.example.chess.websocket.controller.messaging;

import com.example.chess.websocket.FEN;
import org.springframework.stereotype.Component;

@Component
public class GameUpdate {

    private String from;

    private String to;

    private FEN newPosition;

    public GameUpdate() {
    }

    public GameUpdate(String from, String to, FEN newPosition) {
        this.from = from;
        this.to = to;
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

    public FEN getNewPosition() {
        return newPosition;
    }

    public void setNewPosition(FEN newPosition) {
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
