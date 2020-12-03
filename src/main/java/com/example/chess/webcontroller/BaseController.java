package com.example.chess.webcontroller;

import com.example.chess.model.Game;
import com.example.chess.model.GlobalManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpSession;
import java.util.logging.Logger;

@Controller
public class BaseController {

    Logger logger = Logger.getLogger(getClass().toString());

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private GlobalManager globalManager;

    public BaseController(GlobalManager globalManager) {
        this.globalManager = globalManager;
    }

    @GetMapping
    public String chess() {
        return "chess";
    }

    @GetMapping("/{gameId}")
    public String game() {
        return "chess";
    }

    @GetMapping("/landing")
    public String landing() {
        return "landing";
    }

    @GetMapping("/new_game")
    public String newGame(@RequestParam("time_control") String timeControl, Model model, HttpSession httpSession) {

        String sessionId = httpSession.getId();
        Game game = globalManager.createChallenge(timeControl, sessionId);
        String gameId = game.getId().toString();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Thread.sleep(3000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                messagingTemplate.convertAndSend("/topic/new-game", game);
            }
        }).start();

        return "redirect:/" + gameId;
    }


    @GetMapping("/websocket")
    public String socket() {
        return "websocket";
    }
}
