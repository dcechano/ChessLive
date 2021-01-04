package com.example.chess.db.repo.mysql.impl;

import com.example.chess.db.repo.PlayerRepo;
import com.example.chess.model.entity.Player;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.fail;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class MySqlPlayerRepoTest {

    Logger logger = Logger.getLogger(getClass().toString());


    @Qualifier("mySqlPlayerRepo")
    @Autowired
    PlayerRepo playerRepo;

    private final UUID uuid = UUID.randomUUID();
    int i = 0;

    @BeforeEach
    void setUp() {
        assertNotNull(playerRepo);
    }

    @Test
    void save() {

    }

    @Test
    void findById() {

        Player patrick = new Player();
        patrick.setId(uuid.toString());
        patrick.setUsername("patrick");
        patrick.setPassword("password");
        patrick.setJoinDate(LocalDate.now());
        playerRepo.save(patrick);

        Optional<Player> optional = playerRepo.findById(uuid.toString());
        if (optional.isEmpty()) {
            fail();
        }

    }
}