package com.example.chess.db.repo;

import com.example.chess.model.entity.Player;
import com.example.chess.model.entity.Statistics;

public interface PlayerRepo extends AbstractRepo<Player> {

    Player findByUsername(String username);

    Statistics findStatsByUsername(String username);

}
