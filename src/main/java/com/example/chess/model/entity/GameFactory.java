package com.example.chess.model.entity;

import java.util.UUID;

public class GameFactory {

    private GameFactory() {
    }

    public static Game createGame() {
        Game game = new Game();
        game.setId(UUID.randomUUID().toString());
        return game;
    }

    public static Game createGame(Player player1, Player player2) {
        Game game = new Game();
        game.setId(UUID.randomUUID().toString());
        if (System.currentTimeMillis() % 2 == 0) {
            game.setWhite(player1);
            game.setBlack(player2);
        } else {
            game.setBlack(player1);
            game.setWhite(player2);
        }

        return game;
    }
}
