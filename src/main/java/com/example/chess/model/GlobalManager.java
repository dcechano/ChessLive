package com.example.chess.model;

import com.example.chess.db.repo.GameRepo;
import com.example.chess.db.repo.PairedPlayersRepo;
import com.example.chess.db.repo.PlayerRepo;
import com.example.chess.db.repo.WaitListRepo;
import com.example.chess.model.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Logger;

@Component
public class GlobalManager {

    private final Map<String, Player> activeSessions;

    private final ClientNotifier clientNotifier;

    private final Logger logger;

    private PlayerRepo playerRepo;

    private WaitListRepo waitListRepo;

    private PairedPlayersRepo pairedPlayersRepo;

    private GameRepo gameRepo;

    public GlobalManager(ClientNotifier clientNotifier) {
        activeSessions = new HashMap<>();
        logger = Logger.getLogger(getClass().toString());
        this.clientNotifier = clientNotifier;
    }


    //    TODO clean up the if else logic... checking if the set contains the session
    //    May be unnecessary
    private Game awaitChallenge(Player player, TimeControl timeControl) {

//        TODO remove when not necessary anymore
        if (waitListRepo == null || pairedPlayersRepo == null || playerRepo == null || gameRepo == null) {
            throw new RuntimeException("Stuff was null");
        }

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

    public Game createChallenge(String timeControl, String sessionId, Player player) {
        TimeControl time = TimeControl.valueOf(timeControl);

        activeSessions.put(sessionId, player);
        playerRepo.save(player);
        return awaitChallenge(player, time);
    }

    public Player getActivePlayer(String sessionId) {
        return activeSessions.get(sessionId);
    }

    @Autowired
    public void setPlayerRepo(PlayerRepo playerRepo) {
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
    public void setGameRepo(GameRepo gameRepo) {
        this.gameRepo = gameRepo;
    }
}
