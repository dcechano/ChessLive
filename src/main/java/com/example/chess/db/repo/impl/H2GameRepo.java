package com.example.chess.db.repo.impl;

import com.example.chess.model.Game;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
@Transactional
public class H2GameRepo extends H2AbstractRepoImpl<Game> {

    public H2GameRepo() {
        super(Game.class);
    }
}
