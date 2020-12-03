package com.example.chess.db.repo.impl;

import com.example.chess.model.Game;
import org.springframework.stereotype.Repository;

@Repository
public class H2GameRepo extends H2AbstractRepoImpl<Game> {

    public H2GameRepo() {
        super(Game.class);
    }
}
