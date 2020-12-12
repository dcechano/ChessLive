package com.example.chess.db.repo.impl.h2;

import com.example.chess.db.repo.WaitListRepo;
import com.example.chess.model.entity.Player;
import com.example.chess.model.entity.TimeControl;
import com.example.chess.model.entity.WaitingPlayer;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.TypedQuery;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
@Transactional(transactionManager = "h2TransactionManager")
public class WaitListRepoImpl extends H2AbstractRepoImpl<WaitingPlayer> implements WaitListRepo {

    public WaitListRepoImpl() {
        super(WaitingPlayer.class);
    }

    @Override
    public UUID addPlayerToWaitList(Player player, TimeControl timeControl) {
        WaitingPlayer waitingPlayer = new WaitingPlayer();
        waitingPlayer.setPlayer(player);
        UUID id = UUID.randomUUID();
        waitingPlayer.setId(id);
        waitingPlayer.setTimeControl(timeControl);
        waitingPlayer.setCreatedAt(LocalDateTime.now());
        this.save(waitingPlayer);
        return id;
    }

    @Override
    public WaitingPlayer getWaitingPlayerByTimeControl(TimeControl timeControl, UUID exclusionId) {
        TypedQuery<WaitingPlayer> query = this.entityManager.createQuery(
                "SELECT w FROM WaitingPlayer w WHERE w.timeControl =: time_control AND w.player.id !=: exclusionId", WaitingPlayer.class);
        query.setParameter("time_control", timeControl);
        query.setParameter("exclusionId", exclusionId);
        List<WaitingPlayer> list = query.getResultList();
        return list.size() == 0 ? null : list.get(0);
    }

    @Override
    public List<WaitingPlayer> getWaitingPlayersByTimeControl(TimeControl timeControl) {
        TypedQuery<WaitingPlayer> query = this.entityManager.createQuery(
                "SELECT w FROM WaitingPlayer w WHERE w.timeControl =: time_control", WaitingPlayer.class);
        query.setParameter("time_control", timeControl);
        return query.getResultList();
    }

}
