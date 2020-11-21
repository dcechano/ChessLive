package com.example.chess.websocket.config;

import com.example.chess.websocket.PGN;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

@Component
@EnableScheduling
public class SchedulerConfig {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    Logger logger = Logger.getLogger(getClass().toString());

//    @Scheduled(fixedDelay = 10000)
//    public void scheduler() {
//        messagingTemplate.convertAndSend("/get-move", new PGN("Sent from the Scheduler"));
//    }

}
