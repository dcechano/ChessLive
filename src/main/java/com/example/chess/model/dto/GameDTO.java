package com.example.chess.model.dto;


import com.example.chess.model.entity.Game;
import com.example.chess.model.entity.TimeControl;


public class GameDTO {

    private String white;

    private String black;

    private String gameId;

    private String pgn;

    private TimeControl timeControl;

    private String result;

    public GameDTO() {
    }

    public GameDTO(Game game) {
        this.white = game.getWhite().getUsername();
        this.black = game.getBlack().getUsername();
        this.gameId = game.getId();
        this.pgn = game.getPgn();
        this.timeControl = game.getTimeControl();
        this.result = game.getResult();
    }


    public String getWhite() {
        return white;
    }

    public void setWhite(String white) {
        this.white = white;
    }

    public String getBlack() {
        return black;
    }

    public void setBlack(String black) {
        this.black = black;
    }

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public String getPgn() {
        return pgn;
    }

    public void setPgn(String pgn) {
        this.pgn = pgn;
    }

    public TimeControl getTimeControl() {
        return timeControl;
    }

    public void setTimeControl(TimeControl timeControl) {
        this.timeControl = timeControl;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    @Override
    public String toString() {
        return "GameDTO{" +
                "white='" + white + '\'' +
                ", black='" + black + '\'' +
                ", gameId='" + gameId + '\'' +
                ", pgn='" + pgn + '\'' +
                ", timeControl=" + timeControl +
                ", result='" + result + '\'' +
                '}';
    }
}
