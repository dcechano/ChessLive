package com.example.chess.db.repo.h2.impl;

import com.example.chess.db.repo.PlayerRepo;
import com.example.chess.model.entity.Player;
import org.jboss.logging.Logger;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.TypedQuery;

@Repository
@Transactional(transactionManager = "h2TransactionManager")
public class H2PlayerRepo extends H2AbstractRepoImpl<Player> implements PlayerRepo {
    Logger logger = Logger.getLogger(getClass().toString());


    public H2PlayerRepo() {
        super(Player.class);
    }

    @Override
    public Player findByUsername(String username) {
        TypedQuery<Player> query = this.entityManager.createQuery(
                "SELECT p FROM Player p WHERE p.username =: username", Player.class);
        query.setParameter("username", username);
        return query.getSingleResult();
    }

}
