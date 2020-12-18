package com.example.chess.websocket;

import javax.persistence.Embeddable;

@Embeddable
public class FEN {

    private String fen;

    public FEN() {
        fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }

    public FEN(String fen) {
        this.fen = fen;
    }

    public String getPgn() {
        return fen;
    }

    public void setPgn(String fen) {
        this.fen = fen;
    }

    @Override
    public String toString() {
        return fen;
    }
}
