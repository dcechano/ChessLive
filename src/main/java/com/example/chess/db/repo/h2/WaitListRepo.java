package com.example.chess.db.repo.h2;

import com.example.chess.db.repo.AbstractRepo;
import com.example.chess.model.entity.Player;
import com.example.chess.model.entity.TimeControl;
import com.example.chess.model.entity.WaitingPlayer;

import java.util.List;
import java.util.UUID;

public interface WaitListRepo extends AbstractRepo<WaitingPlayer> {
    UUID addPlayerToWaitList(Player player, TimeControl timeControl);

    WaitingPlayer getWaitingPlayerByTimeControl(TimeControl timeControl, UUID exclusionId);

    List<WaitingPlayer> getWaitingPlayersByTimeControl(TimeControl timeControl);

}
