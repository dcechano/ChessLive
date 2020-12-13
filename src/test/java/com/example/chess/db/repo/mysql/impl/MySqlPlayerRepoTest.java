package com.example.chess.db.repo.mysql.impl;

import com.example.chess.db.repo.PlayerRepo;
import com.example.chess.model.entity.Player;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.fail;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class MySqlPlayerRepoTest {


    @Qualifier("mySqlPlayerRepo")
    @Autowired
    PlayerRepo playerRepo;

    private UUID uuid = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        assertNotNull(playerRepo);
    }

    @Order(1)
    @Test
    @Transactional
    void save() {
        Player patrick = new Player();
        patrick.setId(uuid);
        patrick.setUsername("meow");
        patrick.setPassword("password");
        patrick.setJoinDate(LocalDate.now());
        playerRepo.save(patrick);

    }

    @Order(2)
    @Test
    @Transactional
    void findById() {
        Optional<Player> result = playerRepo.findById(uuid);
        if (result.isEmpty()) {
            fail();
        }
    }
}