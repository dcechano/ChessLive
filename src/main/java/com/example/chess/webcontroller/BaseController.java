package com.example.chess.webcontroller;

import com.example.chess.db.repo.h2.GameRepo;
import com.example.chess.model.GlobalManager;
import com.example.chess.model.entity.Game;
import com.example.chess.model.entity.Player;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;

import javax.servlet.http.HttpSession;
import java.util.logging.Logger;

@Controller
public class BaseController {

    Logger logger;

    private final GlobalManager globalManager;

    private final GameRepo gameRepo;


    public BaseController(GlobalManager globalManager, @Qualifier("h2GameRepo") GameRepo gameRepo) {
        this.globalManager = globalManager;
        this.gameRepo = gameRepo;
        logger = Logger.getLogger(getClass().toString());
    }


    @GetMapping
    public String landing() {
        return "landing";
    }

    @GetMapping("/new_game")
    public String newGame(@RequestParam("time_control") String timeControl, HttpSession httpSession) {


        Player player = (Player) httpSession.getAttribute("user");
        Game game = globalManager.createChallenge(timeControl, player);
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

        return "redirect:/game/" + gameId;
    }

    @GetMapping("/game/{gameId}")
    public String game(Model model, @SessionAttribute("currentGame") Game game,
                       @SessionAttribute("user") Player player) throws JsonProcessingException {

        model.addAttribute("user", player);
        model.addAttribute("game", game);
//        TODO refactor this so the client isn't receiving sensitive data about opponent
        model.addAttribute("gameAsJSON", new ObjectMapper().writeValueAsString(game));
        return "chess";
    }



    @GetMapping("/analysis")
    public String analysis() {
        return "analysis";
    }

    @GetMapping("/websocket")
    public String socket() {
        return "websocket";
    }
}