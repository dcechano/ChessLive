package com.example.chess.websocket.controller;

import com.example.chess.db.repo.PlayerRepo;
import com.example.chess.db.repo.h2.PairedPlayersRepo;
import com.example.chess.db.repo.mysql.GameRepo;
import com.example.chess.model.dto.GameDTO;
import com.example.chess.model.entity.Game;
import com.example.chess.model.entity.Player;
import com.example.chess.websocket.messaging.GameUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.logging.Logger;


// TODO clean this shit up
@Controller
public class WebSocketController {

    private final Logger logger;

    private final SimpMessagingTemplate messagingTemplate;

    private GameRepo mySqlGameRepo;

    private com.example.chess.db.repo.h2.GameRepo h2GameRepo;

    private PlayerRepo playerRepo;

    private PairedPlayersRepo pairedPlayersRepo;

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

    @MessageMapping("/gameOver")
    public void gameOver(GameDTO gameDto) {
        Optional<Game> gameOp = h2GameRepo.findById(gameDto.getGameId());
        if (gameOp.isEmpty()) {
            return;
        }
        Game game = gameOp.get();
        Player white = playerRepo.findByUsername(gameDto.getWhite());
        pairedPlayersRepo.removePairing(white);
        game.setPgn(gameDto.getPgn());
        game.setResult(gameDto.getResult());
        game.setDate(LocalDate.now());
        game.setWhite(playerRepo.findByUsername(gameDto.getWhite()));
        game.setBlack(playerRepo.findByUsername(gameDto.getBlack()));
        mySqlGameRepo.save(game);
        h2GameRepo.delete(game);

    }

    @MessageMapping("/message")
    @SendTo("/topic")
    public GameUpdate send(@Payload GameUpdate gameUpdate) {
        return gameUpdate;
    }

    @Autowired
    public void setMySqlGameRepo(@Qualifier("mySqlGameRepo") GameRepo gameRepo) {
        this.mySqlGameRepo = gameRepo;
    }

    @Autowired
    public void setH2GameRepo(@Qualifier("h2GameRepo") com.example.chess.db.repo.h2.GameRepo gameRepo) {
        this.h2GameRepo = gameRepo;
    }

    @Autowired
    public void setPlayerRepo(@Qualifier("mySqlPlayerRepo") PlayerRepo playerRepo) {
        this.playerRepo = playerRepo;
    }

    @Autowired
    public void setPairedPlayersRepo(PairedPlayersRepo pairedPlayersRepo) {
        this.pairedPlayersRepo = pairedPlayersRepo;
    }
}
