package com.example.chess;

import com.example.chess.db.repo.PlayerRepo;
import com.example.chess.db.repo.mysql.GameRepo;
import com.example.chess.model.entity.Game;
import com.example.chess.model.entity.GameFactory;
import com.example.chess.model.entity.Player;
import com.example.chess.model.entity.TimeControl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.UUID;

@SpringBootApplication
public class ChessApplication {


    @Qualifier("mySqlPlayerRepo")
    @Autowired
    PlayerRepo playerRepo;

    @Qualifier("mySqlGameRepo")
    @Autowired
    GameRepo gameRepo;

    @Autowired
    PasswordEncoder encoder;

    public static void main(String[] args) {
        SpringApplication.run(ChessApplication.class, args);
    }

    @Bean
    CommandLineRunner runner() {
        return (String[] args) -> {
            Player dylan = new Player();
            dylan.setId(UUID.randomUUID().toString());
            dylan.setUsername("dylan");
            dylan.setPassword(encoder.encode("password"));
            dylan.setJoinDate(LocalDate.now());
            playerRepo.save(dylan);

            Player jane = new Player();
            jane.setId(UUID.randomUUID().toString());
            jane.setPassword(encoder.encode("password"));
            jane.setJoinDate(LocalDate.now());
            jane.setUsername("jane");
            playerRepo.save(jane);

            Game game = GameFactory.createGame(dylan, jane);
            game.setDate(LocalDate.now());
            game.setPgn("This is a test pgn");
            game.setResult("White");
            game.setTimeControl(TimeControl.TWO_PLUS_1);
            game.setId(UUID.randomUUID().toString());
            gameRepo.save(game);
        };
    }
}
