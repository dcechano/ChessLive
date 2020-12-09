package com.example.chess.model.entity;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "PAIRED_PLAYERS")
public class PairedPlayer extends AbstractEntity {

    @OneToOne
    @JoinColumn(name = "WHITE")
    private Player white;

    @JoinColumn(name = "BLACK")
    @OneToOne
    private Player black;

    public PairedPlayer() {
    }

    public PairedPlayer(Player white, Player black) {
        this.white = white;
        this.black = black;
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

    @Override
    public String toString() {
        return "PairedPlayers{" +
                "white=" + white +
                ", black=" + black +
                "} " + super.toString();
    }
}
