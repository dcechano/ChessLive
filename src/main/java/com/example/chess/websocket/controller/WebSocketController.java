package com.example.chess.websocket.controller;

import com.example.chess.model.Game;
import com.example.chess.model.GameFactory;
import com.example.chess.model.GlobalManager;
import com.example.chess.websocket.PGN;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.logging.Logger;


@Controller
@CrossOrigin
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

    @MessageMapping("/challenge/{sessionId}")
    public void challenge(@DestinationVariable String sessionId) {
        logger.info("Challenge endpoint hit");

//        TODO remove this please
        globalManager.createChallenge(null, sessionId);
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
        globalManager.addSession(sessionId);
    }
}
