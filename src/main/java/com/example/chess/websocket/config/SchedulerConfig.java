package com.example.chess.websocket.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

@Component
@EnableScheduling
public class SchedulerConfig {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    Logger logger = Logger.getLogger(getClass().toString());

//    @Scheduled(fixedDelay = 3000)
//    public void scheduler() {
//        logger.info("Firing from the scheduler");
//        messagingTemplate.convertAndSend("/topic/1", new PGN("Sent from the scheduler"));
//    }

}
