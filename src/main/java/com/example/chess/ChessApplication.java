package com.example.chess;

import com.example.chess.db.repo.WaitListRepo;
import com.example.chess.db.repo.impl.H2GameRepo;
import com.example.chess.db.repo.impl.H2PlayerRepo;
import com.example.chess.model.*;
import com.example.chess.websocket.PGN;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

@SpringBootApplication
public class ChessApplication {
    Logger logger = Logger.getLogger(getClass().toString());


    public static void main(String[] args) {
        SpringApplication.run(ChessApplication.class, args);
    }

    @Bean
    public CommandLineRunner run(H2PlayerRepo playerRepo, WaitListRepo waitListRepo, H2GameRepo gameRepo) throws Exception {

        return (String[] args) -> {
            Player player1 = new Player();
            UUID uuid = UUID.randomUUID();
            logger.info("UUID length is: " + uuid.toString().length());

            player1.setId(uuid);
            player1.setUsername("Dylan");
            player1.setJoinDate(LocalDate.now());
            playerRepo.save(player1);

            Optional<Player> player = playerRepo.findById(player1.getId());
            assert (player.isPresent());
            assert (player.get().getUsername().equals("Dylan"));
            logger.info("Printing Player1");
            logger.info(player1.toString());

            WaitingPlayer waitingPlayer = new WaitingPlayer();
            waitingPlayer.setId(UUID.randomUUID());
            waitingPlayer.setPlayer(player1);
            waitListRepo.save(waitingPlayer);

            Optional<WaitingPlayer> waitingPlayer1 = waitListRepo.findById(waitingPlayer.getId());
            assert (waitingPlayer1.isPresent());
            assert (waitingPlayer1.get().getPlayer().getUsername().equals(player1.getUsername()));
            logger.info("Printing the WaitingPlayer object");
            logger.info(waitingPlayer1.toString());

            Player player2 = new Player();
            UUID uuid2 = UUID.randomUUID();
            player2.setId(uuid2);
            logger.info("UUID length is: " + uuid2.toString().length());

            player2.setUsername("Donovan");
            player2.setJoinDate(LocalDate.now());
            playerRepo.save(player2);
            logger.info("Printing the player 2 object");
            logger.info(player2.toString());

            Game game = GameFactory.createGame(player1, player2);
            game.setPgn(new PGN());
            game.setTimeControl(TimeControl.TWO_PLUS_1);
            gameRepo.save(game);

            Optional<Game> game1 = gameRepo.findById(game.getId());
            assert (game1.isPresent());
            logger.info("Printing the game object");
            logger.info(game1.toString());

        };
    }

}
