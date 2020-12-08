package com.example.chess.websocket.controller;

import com.example.chess.model.entity.Game;
import com.example.chess.model.entity.GameFactory;
import com.example.chess.model.GlobalManager;
import com.example.chess.websocket.PGN;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.logging.Logger;


@Controller
@CrossOrigin // TODO remove?
public class WebSocketController {

    private final Logger logger;

    private final GlobalManager globalManager;


    public WebSocketController(GlobalManager globalManager) {
        logger = Logger.getLogger(getClass().toString());
        this.globalManager = globalManager;
    }

    @MessageMapping("/game/{id}")
    @SendTo("/topic/{id}")
    public PGN sendMove(PGN pgn) {
        logger.info("Returning to client");
        return pgn;
    }

    @MessageMapping("/game/new_game")
    @SendTo("/topic/new_game")
    public Game sendGame() {
        logger.info("Creating Game and sending to client");
        return GameFactory.createGame();
    }

    @MessageMapping("/new_game/{timeControl}/{sessionId}")
    public void newGame(@DestinationVariable("timeControl") String timeControl,
                        @DestinationVariable("sessionId") String sessionId) {
        logger.info("New game requested: ");
        logger.info("Time Control: " + timeControl);
        logger.info("Session Id: " + sessionId);

//        globalManager.createChallenge(timeControl, sessionId);
    }

    @MessageMapping("/register")
    public void register(String sessionId) {
        logger.info("registration endpoint hit");
//        globalManager.addSession(sessionId);
    }
}
