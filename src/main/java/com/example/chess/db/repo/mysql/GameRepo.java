package com.example.chess.db.repo.mysql;

import com.example.chess.db.repo.AbstractRepo;
import com.example.chess.model.entity.Game;
import com.example.chess.model.entity.Player;

import java.util.List;

public interface GameRepo extends AbstractRepo<Game>{

    List<Game> findGamesByPlayer(Player player);



}
