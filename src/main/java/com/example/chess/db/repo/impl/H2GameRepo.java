package com.example.chess.db.repo.impl;

import com.example.chess.db.repo.GameRepo;
import com.example.chess.model.entity.Game;
import com.example.chess.model.entity.Player;
import org.springframework.stereotype.Repository;

import javax.persistence.NoResultException;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import java.util.logging.Logger;

@Repository
@Transactional
public class H2GameRepo extends H2AbstractRepoImpl<Game> implements GameRepo {

    public H2GameRepo() {
        super(Game.class);
    }

    @Override
    public Game getGameByPlayer(Player player) {

        TypedQuery<Game> query = this.entityManager.createQuery(
                "SELECT g FROM Game g WHERE g.black =: player OR g.white =: player", Game.class);
        query.setParameter("player", player);

        try {
            return query.getSingleResult();
        } catch (NoResultException e) {
            Logger logger = Logger.getLogger(getClass().toString());
            logger.warning("FindGame failed! Player Id is: " + player.getId());
            throw e;
        }
    }

}
