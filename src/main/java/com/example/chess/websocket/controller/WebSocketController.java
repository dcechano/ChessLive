package com.example.chess.websocket.controller;

import com.example.chess.websocket.PGN;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.logging.Logger;

@Controller
public class WebSocketController {

    private final Logger logger = Logger.getLogger(getClass().toString());

    @MessageMapping("/game/{id}")
    @SendTo("/get-move/{id}")
    public PGN sendMove(PGN pgn) {
        logger.info("Data received!");
        return pgn;
    }

}
