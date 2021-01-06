package com.example.chess.db.repo.mysql.impl;

import com.example.chess.db.repo.mysql.GameRepo;
import com.example.chess.model.entity.Game;
import com.example.chess.model.entity.Player;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.TypedQuery;
import java.util.List;

@Transactional(transactionManager = "h2TransactionManager")
@Repository
public class MySqlGameRepo extends MySqlAbstractRepo<Game> implements GameRepo {

    public MySqlGameRepo() {
        super(Game.class);
    }

    @Override
    public List<Game> findGamesByPlayer(Player player) {
        TypedQuery<Game> query = this.entityManager.createQuery(
                "SELECT g FROM Game g WHERE g.white =: player OR g.black =: player", Game.class);
        query.setParameter("player", player);
        return query.getResultList();
    }

    @Override
    public List<Game> findGamesByUsername(String username) {
//        TypedQuery<Game> query = this.entityManager.createQuery(
//                "SELECT g.id, g.timeControl, g.white.username, g.black.username, g.white.id, g.black.id " +
//                        "FROM Game g WHERE g.white.username =: username OR g.black.username =: username",
//                Game.class);
        TypedQuery<Game> query = this.entityManager.createQuery(
                "SELECT g FROM Game g WHERE g.white.username =: username OR g.black.username =: username",
                Game.class);
        query.setParameter("username", username);

        return query.getResultList();
    }

}
