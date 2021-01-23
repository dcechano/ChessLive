package com.example.chess.db.repo.mysql;

import com.example.chess.db.repo.AbstractRepo;
import com.example.chess.model.entity.Statistics;

public interface StatsRepo extends AbstractRepo<Statistics> {

    Statistics getStatsByUsername(String username);

}
