package com.example.chess.websocket;

public class PGN {

    private String pgn;

    public PGN() {
    }

    public PGN(String pgn) {
        this.pgn = pgn;
    }

    public String getPgn() {
        return pgn;
    }

    public void setPgn(String pgn) {
        this.pgn = pgn;
    }

    @Override
    public String toString() {
        return pgn;
    }
}
