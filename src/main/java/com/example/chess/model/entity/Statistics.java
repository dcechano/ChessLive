package com.example.chess.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "STATISTICS")
public class Statistics extends AbstractEntity {

    @Column(name = "USERNAME")
    private String playerUsername;

    @Column(name = "TWO_PLUS_1_WINS")
    private int twoPlus1Wins;

    @Column(name = "FIVE_PLUS_0_WINS")
    private int fivePlus0Wins;

    @Column(name = "FIVE_PLUS_5_WINS")
    private int fivePlus5Wins;

    @Column(name = "TEN_PLUS_10_WINS")
    private int tenPlus10Wins;

    @Column(name = "TWO_PLUS_1_LOSSES")
    private int twoPlus1Losses;

    @Column(name = "FIVE_PLUS_0_LOSSES")
    private int fivePlus0Losses;

    @Column(name = "FIVE_PLUS_5_LOSSES")
    private int fivePlus5Losses;

    @Column(name = "TEN_PLUS_10_LOSSES")
    private int tenPlus10Losses;

    @Column(name = "TWO_PLUS_1_DRAWS")
    private int twoPlus1Draws;

    @Column(name = "FIVE_PLUS_0_DRAWS")
    private int fivePlus0Draws;

    @Column(name = "FIVE_PLUS_5_DRAWS")
    private int fivePlus5Draws;

    @Column(name = "TEN_PLUS_10_DRAWS")
    private int tenPlus10Draws;

    public Statistics() {
    }

    public String getPlayerUsername() {
        return playerUsername;
    }

    public void setPlayerUsername(String playerUsername) {
        this.playerUsername = playerUsername;
    }

    public int getTwoPlus1Wins() {
        return twoPlus1Wins;
    }

    public void setTwoPlus1Wins(int twoPlus1Wins) {
        this.twoPlus1Wins = twoPlus1Wins;
    }

    public int getFivePlus0Wins() {
        return fivePlus0Wins;
    }

    public void setFivePlus0Wins(int fivePlus0Wins) {
        this.fivePlus0Wins = fivePlus0Wins;
    }

    public int getFivePlus5Wins() {
        return fivePlus5Wins;
    }

    public void setFivePlus5Wins(int fivePlus5Wins) {
        this.fivePlus5Wins = fivePlus5Wins;
    }

    public int getTenPlus10Wins() {
        return tenPlus10Wins;
    }

    public void setTenPlus10Wins(int tenPlus10Wins) {
        this.tenPlus10Wins = tenPlus10Wins;
    }

    public int getTwoPlus1Losses() {
        return twoPlus1Losses;
    }

    public void setTwoPlus1Losses(int twoPlus1Losses) {
        this.twoPlus1Losses = twoPlus1Losses;
    }

    public int getFivePlus0Losses() {
        return fivePlus0Losses;
    }

    public void setFivePlus0Losses(int fivePlus0Losses) {
        this.fivePlus0Losses = fivePlus0Losses;
    }

    public int getFivePlus5Losses() {
        return fivePlus5Losses;
    }

    public void setFivePlus5Losses(int fivePlus5Losses) {
        this.fivePlus5Losses = fivePlus5Losses;
    }

    public int getTenPlus10Losses() {
        return tenPlus10Losses;
    }

    public void setTenPlus10Losses(int tenPlus10Losses) {
        this.tenPlus10Losses = tenPlus10Losses;
    }

    public int getTwoPlus1Draws() {
        return twoPlus1Draws;
    }

    public void setTwoPlus1Draws(int twoPlus1Draws) {
        this.twoPlus1Draws = twoPlus1Draws;
    }

    public int getFivePlus0Draws() {
        return fivePlus0Draws;
    }

    public void setFivePlus0Draws(int fivePlus0Draws) {
        this.fivePlus0Draws = fivePlus0Draws;
    }

    public int getFivePlus5Draws() {
        return fivePlus5Draws;
    }

    public void setFivePlus5Draws(int fivePlus5Draws) {
        this.fivePlus5Draws = fivePlus5Draws;
    }

    public int getTenPlus10Draws() {
        return tenPlus10Draws;
    }

    public void setTenPlus10Draws(int tenPlus10Draws) {
        this.tenPlus10Draws = tenPlus10Draws;
    }

    public int totalGames() {
        return twoPlus1Wins + twoPlus1Draws + twoPlus1Losses +
                fivePlus0Wins + fivePlus0Draws + fivePlus0Losses +
                fivePlus5Wins + fivePlus5Draws + fivePlus5Losses +
                tenPlus10Wins + tenPlus10Draws + tenPlus10Losses;
    }

    @Override
    public String toString() {
        return "Statistics{" +
                "id='" + id + '\'' +
                ", playerUsername='" + playerUsername + '\'' +
                ", twoPlus1Wins=" + twoPlus1Wins +
                ", fivePlus0Wins=" + fivePlus0Wins +
                ", fivePlus5Wins=" + fivePlus5Wins +
                ", tenPlus10Wins=" + tenPlus10Wins +
                ", twoPlus1Losses=" + twoPlus1Losses +
                ", fivePlus0Losses=" + fivePlus0Losses +
                ", fivePlus5Losses=" + fivePlus5Losses +
                ", tenPlus10Losses=" + tenPlus10Losses +
                ", twoPlus1Draws=" + twoPlus1Draws +
                ", fivePlus0Draws=" + fivePlus0Draws +
                ", fivePlus5Draws=" + fivePlus5Draws +
                ", tenPlus10Draws=" + tenPlus10Draws +
                "} " + super.toString();
    }
}
