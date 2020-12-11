package com.example.chess.db.repo;

import com.example.chess.model.entity.Game;
import com.example.chess.model.entity.Player;

public interface GameRepo extends AbstractRepo<Game> {

    Game getGameByPlayer(Player player);

}
