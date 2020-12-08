package com.example.chess.model.entity;


import com.example.chess.websocket.PGN;

import javax.persistence.*;

@Entity
@Table
public class Game extends AbstractEntity {

    @JoinColumn(name = "WHITE")
    @OneToOne
    private Player white;

    @JoinColumn(name = "BLACK")
    @OneToOne
    private Player black;

    @Column(name = "PGN")
    private PGN pgn;

    @Column(name = "RESULT")
    private String result;

    @Enumerated(EnumType.STRING)
    @Column(name = "TIME_CONTROL")
    private TimeControl timeControl;

    public Game() {
    }

    public Player getWhite() {
        return white;
    }

    public void setWhite(Player white) {
        this.white = white;
    }

    public Player getBlack() {
        return black;
    }

    public void setBlack(Player black) {
        this.black = black;
    }

    public PGN getPgn() {
        return pgn;
    }

    public void setPgn(PGN pgn) {
        this.pgn = pgn;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public TimeControl getTimeControl() {
        return timeControl;
    }

    public void setTimeControl(TimeControl timeControl) {
        this.timeControl = timeControl;
    }

    @Override
    public String toString() {
        return "Game{" +
                "id=" + id +
                ", white=" + white +
                ", black=" + black +
                ", pgn=" + pgn +
                ", result='" + result + '\'' +
                ", timeControl=" + timeControl +
                "} " + super.toString();
    }
}