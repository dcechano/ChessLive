package com.example.chess.websocket.controller;

import com.example.chess.websocket.controller.messaging.GameUpdate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.logging.Logger;


// TODO clean this shit up
@Controller
public class WebSocketController {

    private final Logger logger;

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
        logger = Logger.getLogger(getClass().toString());
    }

    @MessageMapping("/updateOpponent")
    public void sendToUser(@Payload GameUpdate gameUpdate, Principal principal) {
        logger.info("/sendToUser endpoint hit by " + principal.getName());
        logger.info("Printing the GameUpdate object: " + gameUpdate.toString());
        messagingTemplate.convertAndSendToUser(gameUpdate.getTo(), "/queue/update", gameUpdate);
    }

    @MessageMapping("/message")
    @SendTo("/topic")
    public GameUpdate send(@Payload GameUpdate gameUpdate) {
        return gameUpdate;
    }

}
