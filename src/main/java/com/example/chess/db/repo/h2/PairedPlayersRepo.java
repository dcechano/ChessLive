package com.example.chess.db.repo.h2;

import com.example.chess.db.repo.AbstractRepo;
import com.example.chess.model.entity.PairedPlayer;
import com.example.chess.model.entity.Player;

public interface PairedPlayersRepo extends AbstractRepo<PairedPlayer> {

    void setPairedPlayers(Player white, Player black);

    Player getPairedPlayer(Player player);

    boolean isPaired(Player player);

}
