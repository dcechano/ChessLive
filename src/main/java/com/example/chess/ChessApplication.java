package com.example.chess;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.logging.Logger;

@SpringBootApplication
public class ChessApplication {
    Logger logger = Logger.getLogger(getClass().toString());


    public static void main(String[] args) {
        SpringApplication.run(ChessApplication.class, args);
    }

//    @Bean
//    public CommandLineRunner run(@Qualifier("H2PlayerRepo") PlayerRepo playerRepo,
//                                 WaitListRepo waitListRepo,
//                                 GameRepo gameRepo) throws Exception {
//
//        return (String[] args) -> {
//            Player dylan = new Player();
//            UUID uuid = UUID.randomUUID();
//
//            dylan.setId(uuid);
//            dylan.setUsername("Dylan");
//            dylan.setJoinDate(LocalDate.now());
//            playerRepo.save(dylan);
//
//            Optional<Player> dylanOp = playerRepo.findById(dylan.getId());
//            assert (dylanOp.isPresent());
//            assert (dylanOp.get().getUsername().equals("Dylan"));
//            logger.info("Printing Player1");
//            logger.info(dylanOp.get().toString());
//
//            WaitingPlayer waitingDylan = new WaitingPlayer();
//            waitingDylan.setId(UUID.randomUUID());
//            waitingDylan.setPlayer(dylan);
//            waitingDylan.setTimeControl(TimeControl.TWO_PLUS_1);
//            waitListRepo.save(waitingDylan);
//
//            Optional<WaitingPlayer> waitingPlayer1 = waitListRepo.findById(waitingDylan.getId());
//            assert (waitingPlayer1.isPresent());
//            assert (waitingPlayer1.get().getPlayer().getUsername().equals(dylan.getUsername()));
//            logger.info("Printing the WaitingPlayer object");
//            logger.info(waitingPlayer1.toString());
//
//            Player donovan = new Player();
//            donovan.setId(UUID.randomUUID());
//
//
//            donovan.setUsername("Donovan");
//            donovan.setJoinDate(LocalDate.now());
//            playerRepo.save(donovan);
//            logger.info("Printing Donovan");
//            logger.info(donovan.toString());
//            waitListRepo.addPlayerToWaitList(donovan, TimeControl.TWO_PLUS_1);
//
//
//            Player veronica = new Player();
//            veronica.setUsername("veronica");
//            veronica.setId(UUID.randomUUID());
//            playerRepo.save(veronica);
//            waitListRepo.addPlayerToWaitList(veronica, TimeControl.TWO_PLUS_1);
//
//            Game game = GameFactory.createGame(dylan, donovan);
//            game.setPgn(new PGN());
//            game.setTimeControl(TimeControl.TWO_PLUS_1);
//            gameRepo.save(game);
//
//            Optional<Game> game1 = gameRepo.findById(game.getId());
//            assert (game1.isPresent());
//            logger.info("Printing the game object");
//            logger.info(game1.toString());
//
//            logger.info("Testing the new Waiting player repo methods");
//            logger.info("Getting all waiting players");
//            Player newPlayer = new Player();
//            newPlayer.setUsername("TestPlayer");
//            newPlayer.setId(UUID.randomUUID());
//            playerRepo.save(newPlayer);
//            UUID exclusionId = waitListRepo.addPlayerToWaitList(newPlayer, TimeControl.TWO_PLUS_1);
//            List<WaitingPlayer> waitingPlayers = waitListRepo.getWaitingPlayersByTimeControl(TimeControl.TWO_PLUS_1);
//            logger.info("Printing off the currently waiting players");
//            waitingPlayers.forEach((obj) -> logger.info(obj.toString()));
//
//            logger.info("Now grabbing a waiting players that is not 'TestPlayer'");
//            logger.info("Will print several tries");
//
//            for (int i = 0; i < 10; i++) {
//                WaitingPlayer player3 = waitListRepo.getWaitingPlayerByTimeControl(TimeControl.TWO_PLUS_1, exclusionId);
//                assert (player3 != null);
//                assert (!player3.getPlayer().getUsername().equals(newPlayer.getUsername()));
//                logger.info(player3.toString());
//            }
//        };
//    }

}
