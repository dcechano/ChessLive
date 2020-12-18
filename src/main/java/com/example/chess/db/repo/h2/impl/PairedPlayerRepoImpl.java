package com.example.chess.db.repo.h2.impl;

import com.example.chess.db.repo.h2.PairedPlayersRepo;
import com.example.chess.model.entity.PairedPlayer;
import com.example.chess.model.entity.Player;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.TypedQuery;
import java.util.UUID;

@Repository
@Transactional(transactionManager = "h2TransactionManager")
public class PairedPlayerRepoImpl extends H2AbstractRepoImpl<PairedPlayer> implements PairedPlayersRepo {

    public PairedPlayerRepoImpl() {
        super(PairedPlayer.class);
    }

    @Override
    public void setPairedPlayers(Player white, Player black) {
        PairedPlayer pairedPlayer = new PairedPlayer(white, black);
        pairedPlayer.setId(UUID.randomUUID());

        this.entityManager.persist(pairedPlayer);
    }

    @Override
    public Player getPairedPlayer(Player player) {
        TypedQuery<PairedPlayer> query = this.entityManager.createQuery(
                "SELECT p FROM PairedPlayer p WHERE p.white =: player OR p.black =: player", PairedPlayer.class);
        query.setParameter("player", player);
        PairedPlayer pairedPlayer = query.getResultList().get(0);
        Player white = pairedPlayer.getWhite();
        Player black = pairedPlayer.getBlack();

        return white.getId().equals(player.getId()) ? black : white;
    }

    @Override
    public boolean isPaired(Player player) {

        TypedQuery<Long> query = this.entityManager.createQuery(
                "SELECT COUNT (s) FROM PairedPlayer s WHERE s.black =: player OR s.white =: player", Long.class);
        query.setParameter("player", player);
        return query.getSingleResult() > 0;
    }
}