package com.example.chess.db.repo.impl;

import com.example.chess.db.repo.H2AbstractRepo;
import com.example.chess.db.repo.WaitListRepo;
import com.example.chess.model.WaitingPlayer;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
@Transactional
public class WaitListRepoImpl extends H2AbstractRepoImpl<WaitingPlayer> implements WaitListRepo {

    public WaitListRepoImpl() {
        super(WaitingPlayer.class);
    }


}
