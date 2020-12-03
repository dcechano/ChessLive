package com.example.chess.model;

import org.springframework.stereotype.Component;

import java.util.*;
import java.util.logging.Logger;

@Component
public class GlobalManager {

    private final Set<String> activeSessions;

    private final Set<String> waiting;

    private final Set<String> twoP1;

    private final Set<String> fiveP0;

    private final Set<String> fiveP5;

    private final Set<String> tenP10;

    private final Map<String, Game> activeGames;
    private final ClientNotifier clientNotifier;

    private final Logger logger;


    public GlobalManager(ClientNotifier clientNotifier) {
        this.clientNotifier = clientNotifier;
        twoP1 = Collections.synchronizedSet(new HashSet<>());
        fiveP0 = Collections.synchronizedSet(new HashSet<>());
        fiveP5 = Collections.synchronizedSet(new HashSet<>());
        tenP10 = Collections.synchronizedSet(new HashSet<>());

        activeSessions = Collections.synchronizedSet(new HashSet<>());
        waiting = Collections.synchronizedSet(new HashSet<>());
        activeGames = Collections.synchronizedMap(new HashMap<>());
        this.logger = Logger.getLogger(getClass().toString());

    }

    //    TODO clean up the if else logic... checking if the set contains the session
    //    May be unnecessary
    private Game awaitChallenge(Set<String> set, String sessionId) {
        logger.info("inside awaitChallenge");
        if (set.size() < 1) {
            logger.info("adding session Id to waiting list");
            set.add(sessionId);
            while (true) {
                if (activeGames.containsKey(sessionId)) {
                    return activeGames.get(sessionId);
                }
            }

        } else if (!set.contains(sessionId)) {
            logger.info("There was a player to match with!");
            Player player1 = new Player();
            player1.setUsername(sessionId);

            String sessionId2 = set.iterator().next();
            set.remove(sessionId2);

            Player player2 = new Player();
            player2.setUsername(sessionId2);

            Game game = GameFactory.createGame(player1, player2);
            activeGames.put(sessionId, game);
            activeGames.put(sessionId2, game);
            return game;
        }
        //            TODO def dont leave this in the production code
        throw new RuntimeException("There was a random exception while pairing");
    }

    public Game createChallenge(String timeControl, String sessionId) {
        TimeControl time = TimeControl.valueOf(timeControl);
        Set<String> set = matchSet(time);
        return awaitChallenge(set, sessionId);
    }

    private Set<String> matchSet(TimeControl timeControl) {
        switch (timeControl) {
            case TWO_PLUS_1:
                return twoP1;
            case FIVE_PLUS_0:
                return fiveP0;
            case FIVE_PLUS_5:
                return fiveP5;
            default:
                return tenP10;
        }
    }

    public boolean addSession(String sessionId) {
        return activeSessions.add(sessionId);
    }

    public boolean removeSession(String sessionId) {
        return activeSessions.remove(sessionId);
    }
}
