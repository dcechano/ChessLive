package com.example.chess.webcontroller;

import com.example.chess.db.repo.h2.GameRepo;
import com.example.chess.model.GlobalManager;
import com.example.chess.model.dto.GameDTO;
import com.example.chess.model.entity.Game;
import com.example.chess.model.entity.Player;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Controller
public class BaseController {

    private Logger logger;

    private final GlobalManager globalManager;

    private final com.example.chess.db.repo.mysql.GameRepo mySqlGameRepo;

    private final GameRepo h2GameRepo;


    public BaseController(GlobalManager globalManager, @Qualifier("h2GameRepo") GameRepo h2GameRepo,
                          com.example.chess.db.repo.mysql.GameRepo mySqlGameRepo) {
        this.globalManager = globalManager;
        this.h2GameRepo = h2GameRepo;
        this.mySqlGameRepo = mySqlGameRepo;
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
            game = h2GameRepo.getGameByPlayer(player);
        }

        String gameId = game.getId();
        httpSession.setAttribute("currentGame", game);

        return "redirect:/game/" + gameId;
    }

    @GetMapping("/game/{gameId}")
    public String game(Model model, @SessionAttribute("currentGame") Game game,
                       @SessionAttribute("user") Player player) throws JsonProcessingException {
        model.addAttribute("user", player);
        model.addAttribute("game", game);
        model.addAttribute("gameAsJSON", new ObjectMapper()
                .writeValueAsString(new GameDTO(game)));

        return "chess";
    }

    @GetMapping("/user/{username}")
    public String profile(@PathVariable String username, Model model) {
        List<Game> games = mySqlGameRepo.findGamesByUsername(username);
        model.addAttribute("games", games);
        model.addAttribute("username", username);
        return "profile";
    }

    @GetMapping("/archive/{gameId}")
    public String archivedGame(@PathVariable String gameId, Model model) throws JsonProcessingException {

        Optional<Game> optional = mySqlGameRepo.findById(gameId);
        if (optional.isEmpty()) {
            throw new RuntimeException("Server error. Game with id: " + gameId +
                    " could not be found");
        }
        Game game = optional.get();
        GameDTO dto = new GameDTO(game);
        model.addAttribute("gameAsJSON", new ObjectMapper().writeValueAsString(dto));
        model.addAttribute("game", game);
        return "analysis";
    }

    @GetMapping("/analysis")
    public String analysis() {
        return "analysis";
    }

//    TODO remove this mapping before publication
    @GetMapping("/websocket")
    public String socket() {
        return "websocket";
    }
}