package com.example.chess.webcontroller;

import com.example.chess.db.repo.PlayerRepo;
import com.example.chess.db.repo.h2.GameRepo;
import com.example.chess.db.repo.mysql.StatsRepo;
import com.example.chess.model.GlobalManager;
import com.example.chess.model.dto.GameDTO;
import com.example.chess.model.entity.Game;
import com.example.chess.model.entity.Player;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

@Controller
public class BaseController {


    private final GlobalManager globalManager;

    private final com.example.chess.db.repo.mysql.GameRepo mySqlGameRepo;

    private final GameRepo h2GameRepo;

    private StatsRepo statsRepo;

    private final PlayerRepo playerRepo;

    private final PasswordEncoder passwordEncoder;


    public BaseController(GlobalManager globalManager, @Qualifier("h2GameRepo") GameRepo h2GameRepo,
                          com.example.chess.db.repo.mysql.GameRepo mySqlGameRepo,
                          @Qualifier("mySqlPlayerRepo") PlayerRepo playerRepo,
                          PasswordEncoder passwordEncoder) {
        this.globalManager = globalManager;
        this.h2GameRepo = h2GameRepo;
        this.mySqlGameRepo = mySqlGameRepo;
        this.playerRepo = playerRepo;
        this.passwordEncoder = passwordEncoder;
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

        model.addAttribute("games", mySqlGameRepo.findGamesByUsername(username));
        model.addAttribute("username", username);
        model.addAttribute("stats", statsRepo.getStatsByUsername(username));
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

    @GetMapping("/signup")
    public String signup(Model model, @RequestParam(value = "message", required = false) String message) {

        Player player = new Player();
        model.addAttribute("newUser", player);
        model.addAttribute("message", message);

        return "signup";
    }

    @PostMapping("/signup")
    public String signup(@ModelAttribute Player newUser) {

        try {
            newUser.setJoinDate(LocalDate.now());
            newUser.setId(UUID.randomUUID().toString());
            newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
            Logger.getLogger(getClass().toString()).info(newUser.toString());
            playerRepo.save(newUser);
        } catch (Exception e) {
            return "redirect:/signup?message=Username taken. Please choose another";
        }

        return "redirect:/login";
    }


    @Autowired
    public void setStatsRepo(StatsRepo statsRepo) {
        this.statsRepo = statsRepo;
    }
}