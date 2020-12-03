package com.example.chess.model;

import com.example.chess.websocket.PGN;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

@Component
public class ClientNotifier {

    private final SimpMessagingTemplate messagingTemplate;
    private final Logger logger;

    public ClientNotifier(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
        logger = Logger.getLogger(getClass().toString());
    }

    public void newGameNotifier(Game game) {
        logger.info("Notifying clients");

        String session1 = game.getWhite().getUsername();
        logger.info("White's sessionId: " + session1);
        String session2 = game.getBlack().getUsername();
        logger.info("Black's sessionId: " + session2);

//        messagingTemplate.convertAndSendToUser(session1, "/get/new_move", game, createHeaders(session1));
        messagingTemplate.convertAndSend("/topic/" + session1, game);
        messagingTemplate.convertAndSend("/topic/" + session2, game);
        logger.info("Clients notified");

    }

//    TODO remove if not necessary
    private MessageHeaders createHeaders(String sessionId) {
        SimpMessageHeaderAccessor header = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
        header.setSessionId(sessionId);
        header.setLeaveMutable(true);
        return header.getMessageHeaders();
    }

}
