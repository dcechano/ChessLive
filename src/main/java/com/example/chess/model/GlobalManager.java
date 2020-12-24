package com.example.chess.model;

import com.example.chess.db.repo.PlayerRepo;
import com.example.chess.db.repo.h2.GameRepo;
import com.example.chess.db.repo.h2.PairedPlayersRepo;
import com.example.chess.db.repo.h2.WaitListRepo;
import com.example.chess.model.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.logging.Logger;

@Component
public class GlobalManager {


    private final ClientNotifier clientNotifier;

    private final Logger logger;

    private PlayerRepo playerRepo;

    private WaitListRepo waitListRepo;

    private PairedPlayersRepo pairedPlayersRepo;

    private GameRepo gameRepo;

    public GlobalManager(ClientNotifier clientNotifier) {
        logger = Logger.getLogger(getClass().toString());
        this.clientNotifier = clientNotifier;
    }
    
    private Game awaitChallenge(Player player, TimeControl timeControl) {

        WaitingPlayer matchedPlayer = waitListRepo.getWaitingPlayerByTimeControl(timeControl, player.getId());
        if (matchedPlayer == null) {
            UUID waitId = waitListRepo.addPlayerToWaitList(player, timeControl);

            if (pairedPlayersRepo.isPaired(player)) {
                waitListRepo.deleteById(waitId);
                return null;

            } else {
                while (matchedPlayer == null) {
                    if (pairedPlayersRepo.isPaired(player)) {
                        return null;
                    }
                    matchedPlayer = waitListRepo.getWaitingPlayerByTimeControl(timeControl, player.getId());
                }
                waitListRepo.delete(matchedPlayer);
                waitListRepo.deleteById(waitId);
            }
        } else {
            waitListRepo.delete(matchedPlayer);
            return pair(player, matchedPlayer.getPlayer());
        }

        return pair(player, matchedPlayer.getPlayer());
    }

    private Game pair(Player player1, Player player2) {
        pairedPlayersRepo.setPairedPlayers(player1, player2);
        Game game = GameFactory.createGame(player1, player2);
        gameRepo.save(game);
        return game;
    }

    public Game createChallenge(String timeControl, Player player) {
        TimeControl time = TimeControl.valueOf(timeControl);
        return awaitChallenge(player, time);
    }


    @Autowired
    public void setPlayerRepo(@Qualifier("h2PlayerRepo") PlayerRepo playerRepo) {
        this.playerRepo = playerRepo;
    }

    @Autowired
    public void setWaitListRepo(WaitListRepo waitListRepo) {
        this.waitListRepo = waitListRepo;
    }

    @Autowired
    public void setPairedPlayersRepo(PairedPlayersRepo pairedPlayersRepo) {
        this.pairedPlayersRepo = pairedPlayersRepo;
    }

    @Autowired
    public void setGameRepo(@Qualifier("h2GameRepo") GameRepo gameRepo) {
        this.gameRepo = gameRepo;
    }
}
