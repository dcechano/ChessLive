package com.example.chess.db.repo.impl;

import com.example.chess.db.repo.PlayerRepo;
import com.example.chess.model.Player;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.logging.Logger;

@Repository
@Transactional
public class H2PlayerRepo extends H2AbstractRepoImpl<Player> implements PlayerRepo {


    Logger logger = Logger.getLogger(getClass().toString());

    public H2PlayerRepo() {
        super(Player.class);
    }
}
