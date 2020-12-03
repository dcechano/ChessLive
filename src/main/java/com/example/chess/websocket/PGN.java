package com.example.chess.websocket;

import javax.persistence.Embeddable;

@Embeddable
public class PGN {

    private String pgn;

    public PGN() {
        pgn = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
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
