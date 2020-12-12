package com.example.chess.db.repo.impl.h2;

import com.example.chess.db.repo.PlayerRepo;
import com.example.chess.model.entity.Player;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.fail;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class H2PlayerRepoTest {

    Logger logger = Logger.getLogger(getClass().toString());

    @Autowired
    PlayerRepo playerRepo;

    @BeforeEach
    void setup() {
        assertNotNull(playerRepo);
    }

    @Test
    void findById() {
        Player player = new Player();
        UUID id = UUID.randomUUID();
        player.setId(id);
        player.setUsername("dylan");
        playerRepo.save(player);

        Optional<Player> dylanOpt = playerRepo.findById(id);
        if (dylanOpt.isEmpty()) {
            fail();
        } else Assertions.assertTrue(true);

    }
}