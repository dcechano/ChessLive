package com.example.chess.webcontroller;

import com.example.chess.db.repo.GameRepo;
import com.example.chess.model.entity.Game;
import com.example.chess.model.GlobalManager;
import com.example.chess.model.entity.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;

import javax.servlet.http.HttpSession;
import java.util.logging.Logger;

@Controller
public class BaseController {

    Logger logger = Logger.getLogger(getClass().toString());

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final GlobalManager globalManager;

    private GameRepo gameRepo;

    public BaseController(GlobalManager globalManager, GameRepo gameRepo) {
        this.globalManager = globalManager;
        this.gameRepo = gameRepo;
    }

    @GetMapping
    public String chess() {
        return "chess";
    }

    @GetMapping("/{gameId}")
    public String game(Model model, @SessionAttribute("currentGame") Game game) {
        model.addAttribute("game", game);
        return "chess";
    }

    @GetMapping("/landing")
    public String landing() {
        return "landing";
    }

    @GetMapping("/new_game")
    public String newGame(@RequestParam("time_control") String timeControl, HttpSession httpSession) {

        String sessionId = httpSession.getId();
        Game game = globalManager.createChallenge(timeControl, sessionId);
        if (game == null) {
            Player player = globalManager.getActivePlayer(sessionId);
            game = gameRepo.getGameByPlayer(player);
        }
        String gameId = game.getId().toString();
        httpSession.setAttribute("currentGame", game);

        return "redirect:/" + gameId;
    }

    @GetMapping("/websocket")
    public String socket() {
        return "websocket";
    }

}
