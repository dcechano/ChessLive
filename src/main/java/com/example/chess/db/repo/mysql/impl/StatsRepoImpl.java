package com.example.chess.db.repo.mysql.impl;

import com.example.chess.db.repo.mysql.StatsRepo;
import com.example.chess.model.entity.Statistics;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.TypedQuery;

@Transactional
@Repository
public class StatsRepoImpl extends MySqlAbstractRepo<Statistics> implements StatsRepo {

    public StatsRepoImpl() {
        super(Statistics.class);
    }

    @Override
    public Statistics getStatsByUsername(String username) {
        TypedQuery<Statistics> query = this.entityManager.createQuery(
                "SELECT s FROM Statistics s WHERE s.playerUsername =: username", Statistics.class);
        query.setParameter("username", username);
        return query.getSingleResult();
    }

}
