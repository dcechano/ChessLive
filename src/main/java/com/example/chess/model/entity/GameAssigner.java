package com.example.chess.model.entity;


import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Component
public class GameAssigner {

    private final List<Player> waiting;

    private final List<Game> gameList;

    public GameAssigner() {
        waiting = Collections.synchronizedList(new ArrayList<>());
        gameList = Collections.synchronizedList(new ArrayList<>());
    }

    public synchronized UUID awaitChallenge(Player player) {
        waiting.add(player);
        do {
            if (waiting.size() > 1) for (Player p : waiting) {
                if (p == player) continue;
                waiting.remove(player);
                waiting.remove(p);
                Game game = GameFactory.createGame(player, p);
                gameList.add(game);
                return (UUID) game.getId();
            }
        } while (true);
    }

}
