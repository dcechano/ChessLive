package com.example.chess.db.repo.impl.h2;

import com.example.chess.db.repo.PlayerRepo;
import com.example.chess.model.entity.Player;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class H2PlayerRepoTest {

    Logger logger = Logger.getLogger(getClass().toString());

    @Qualifier("h2PlayerRepo")
    @Autowired
    PlayerRepo playerRepo;

    @BeforeEach
    void setup() {
        assertNotNull(playerRepo);
    }

    @Test
    void findByUsername() {
        Player player = new Player();
        UUID id = UUID.randomUUID();
        player.setId(id);
        player.setUsername("dylan");
        player.setPassword("password");
        player.setJoinDate(LocalDate.now());
        playerRepo.save(player);

        Player dylan = playerRepo.findByUsername("dylan");
        assertNotNull(dylan);
        assertEquals("dylan", dylan.getUsername());

    }

    @Test
//    @Transactional
    void findById() {
        logger.info("Doing the test");
        Player player = new Player();
        UUID id = UUID.randomUUID();
        player.setId(id);
        player.setUsername("john");
        player.setPassword("password");
        player.setJoinDate(LocalDate.now());
        playerRepo.save(player);

        Optional<Player> dylanOpt = playerRepo.findById(id);
        if (dylanOpt.isEmpty()) {
            fail();
        } else Assertions.assertTrue(true);

    }
}