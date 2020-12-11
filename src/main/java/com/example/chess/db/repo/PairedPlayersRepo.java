package com.example.chess.db.repo;

import com.example.chess.model.entity.PairedPlayer;
import com.example.chess.model.entity.Player;

public interface PairedPlayersRepo extends AbstractRepo<PairedPlayer> {

    void setPairedPlayers(Player white, Player black);

    Player getPairedPlayer(Player player);

    boolean isPaired(Player player);

}
