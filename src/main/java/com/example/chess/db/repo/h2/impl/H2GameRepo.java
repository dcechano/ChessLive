package com.example.chess.db.repo.h2.impl;

import com.example.chess.db.repo.h2.GameRepo;
import com.example.chess.model.entity.Game;
import com.example.chess.model.entity.Player;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.TypedQuery;

@Repository
@Transactional(transactionManager = "h2TransactionManager")
public class H2GameRepo extends H2AbstractRepoImpl<Game> implements GameRepo {

    public H2GameRepo() {
        super(Game.class);
    }

    @Override
    public Game getGameByPlayer(Player player) {

        TypedQuery<Game> query = this.entityManager.createQuery(
                "SELECT g FROM Game g WHERE g.black =: player OR g.white =: player", Game.class);
        query.setParameter("player", player);
        return query.getSingleResult();
    }

}
