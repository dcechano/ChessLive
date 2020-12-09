package com.example.chess.webcontroller;

import com.example.chess.db.repo.GameRepo;
import com.example.chess.model.GlobalManager;
import com.example.chess.model.entity.Game;
import com.example.chess.model.entity.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;

import javax.servlet.http.HttpSession;
import java.util.UUID;
import java.util.logging.Logger;

@Controller
public class BaseController {

//    TODO remove unnecessary fields
    Logger logger = Logger.getLogger(getClass().toString());

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final GlobalManager globalManager;

    private final GameRepo gameRepo;

    public BaseController(GlobalManager globalManager, GameRepo gameRepo) {
        logger.info("creating BaseController. Hash is: " + this.hashCode());
        this.globalManager = globalManager;
        this.gameRepo = gameRepo;
    }


    @GetMapping
    public String landing(HttpSession session) {
        logger.info("Creating player! Session ID is: " + session.getId());
        Player player = new Player();
        player.setId(UUID.randomUUID());
        logger.info("UUID is: " + player.getId().toString());
        player.setUsername(session.getId());
        session.setAttribute("user", player);

        return "landing";
    }

    @GetMapping("/{gameId}")
    public String game(Model model, @SessionAttribute("currentGame") Game game, @SessionAttribute("user") Player player) {
        model.addAttribute("user", player);
        model.addAttribute("game", game);
        return "chess";
    }

    @GetMapping("/new_game")
    public String newGame(@RequestParam("time_control") String timeControl, HttpSession httpSession) {

        String sessionId = httpSession.getId();

        Player player = (Player) httpSession.getAttribute("user");
        Game game = globalManager.createChallenge(timeControl, sessionId, player);
        if (game == null) {
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
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