package com.example.chess.model.entity;

import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.time.LocalDate;

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
    private String pgn;

    @Column(name = "RESULT")
    private String result;

    @Enumerated(EnumType.STRING)
    @Column(name = "TIME_CONTROL")
    private TimeControl timeControl;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @Column(name = "DATE")
    private LocalDate date;


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

    public String getPgn() {
        return pgn;
    }

    public void setPgn(String pgn) {
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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    @Override
    public String toString() {
        return "Game{" +
                "id=" + id +
                ", white=" + white +
                ", black=" + black +
                ", pgn='" + pgn + '\'' +
                ", result='" + result + '\'' +
                ", timeControl=" + timeControl +
                ", date=" + date +
                "} " + super.toString();
    }
}