package com.example.chess.db.repo.mysql.impl;

import com.example.chess.db.repo.PlayerRepo;
import com.example.chess.model.entity.Player;
import com.example.chess.model.entity.Statistics;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import javax.transaction.Transactional;

@Transactional
@Repository
public class MySqlPlayerRepo extends MySqlAbstractRepo<Player> implements PlayerRepo {

    public MySqlPlayerRepo() {
        super(Player.class);
    }

    @Override
    public Player findByUsername(String username) {
        TypedQuery<Player> query = this.entityManager.createQuery(
                "SELECT p FROM Player p WHERE p.username =: username", Player.class);
        query.setParameter("username", username);
        return query.getSingleResult();
    }

    @Override
    public Statistics findStatsByUsername(String username) {
        TypedQuery<Statistics> query = this.entityManager.createQuery(
                "SELECT s FROM Statistics s WHERE s.playerUsername =: username", Statistics.class);
        query.setParameter("username", username);
        return query.getSingleResult();
    }

}
