package com.example.chess.db.repo.impl;

import com.example.chess.db.repo.WaitListRepo;
import com.example.chess.model.entity.Player;
import com.example.chess.model.entity.TimeControl;
import com.example.chess.model.entity.WaitingPlayer;
import org.springframework.stereotype.Repository;

import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
@Transactional
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
        this.entityManager.persist(waitingPlayer);
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

    @Override
    public void setPairedPlayer(Player white, Player black) {
        UUID id1 = white.getId();
        String id2 = black.getId().toString();

        Query nativeQuery = this.entityManager.createNativeQuery(
                "INSERT INTO PAIRED_PLAYERS(WHITE, BLACK) VALUES ('" + id1 + "', '" + id2 + "')"
        );
        nativeQuery.executeUpdate();
    }

    @Override
    public boolean isPaired(Player player) {
        String id = player.getId().toString();

        Query nativeQuery = this.entityManager.createNativeQuery(
                "SELECT p.WHITE, p.BLACK FROM PAIRED_PLAYERS p WHERE p.WHITE =: wId OR p.BLACK =: bId");
        nativeQuery.setParameter("wId", id);
        nativeQuery.setParameter("bId", id);

        return nativeQuery.getResultList() == null;
    }

}
