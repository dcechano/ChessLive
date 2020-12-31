package com.example.chess.db.repo;

import com.example.chess.model.entity.Player;

import javax.persistence.EntityManager;

public interface PlayerRepo extends AbstractRepo<Player> {

    Player findByUsername(String username);

}
