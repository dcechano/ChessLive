package com.example.chess;

import com.example.chess.db.repo.impl.H2PlayerRepo;
import com.example.chess.model.Player;
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

    public static void main(String[] args) {
        SpringApplication.run(ChessApplication.class, args);
    }

    @Bean
    public CommandLineRunner run(H2PlayerRepo repo) throws Exception {
        return (String[] args) -> {
            Player player1 = new Player();
            player1.setId(UUID.randomUUID());
            player1.setUsername("Dylan");
            player1.setJoinDate(LocalDate.now());
            repo.save(player1);
            Logger logger = Logger.getLogger(getClass().toString());

            Optional<Player> player = repo.findById(player1.getId());
            assert (player.isPresent());
            assert (player.get().getUsername().equals("Dylan"));
        };
    }

}
