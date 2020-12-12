package com.example.chess.db.repo.h2;

import com.example.chess.db.repo.AbstractRepo;
import com.example.chess.model.entity.Game;
import com.example.chess.model.entity.Player;

public interface GameRepo extends AbstractRepo<Game> {

    Game getGameByPlayer(Player player);

}
