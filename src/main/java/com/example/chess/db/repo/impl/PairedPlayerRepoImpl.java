package com.example.chess.db.repo.impl;

import com.example.chess.db.repo.PairedPlayersRepo;
import com.example.chess.model.entity.PairedPlayer;
import com.example.chess.model.entity.Player;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import java.util.UUID;

@Repository
@Transactional
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
                "SELECT COUNT (s) FROM PairedPlayer s WHERE s.black =: black OR s.white =: white", Long.class);
        query.setParameter("black", player);
        query.setParameter("white", player);
        return query.getSingleResult() > 0;
    }


}
