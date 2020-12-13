package com.example.chess.db.repo.impl;

import com.example.chess.db.repo.PlayerRepo;
import com.example.chess.db.repo.h2.PairedPlayersRepo;
import com.example.chess.db.repo.h2.WaitListRepo;
import com.example.chess.model.entity.Player;
import com.example.chess.model.entity.TimeControl;
import com.example.chess.model.entity.WaitingPlayer;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class WaitListRepoImplTest {

    @Autowired
    private WaitListRepo waitListRepo;

    @Autowired
    private PairedPlayersRepo pairedPlayersRepo;
    @Qualifier("h2PlayerRepo")
    @Autowired
    private PlayerRepo playerRepo;
    Logger logger = Logger.getLogger(getClass().toString());


    @BeforeEach
    void setUp() {
        assertNotNull(waitListRepo);
        assertNotNull(playerRepo);
        assertNotNull(pairedPlayersRepo);

    }

    @Test
    void addPlayerToWaitList() {
        Player player = new Player();
        UUID uuid = UUID.randomUUID();
        player.setId(uuid);
        player.setUsername("this is a test username");
        player.setPassword("passowrd");
        player.setJoinDate(LocalDate.now());
        playerRepo.save(player);

        UUID waitingId = waitListRepo.addPlayerToWaitList(player, TimeControl.TWO_PLUS_1);
        Optional<WaitingPlayer> opt = waitListRepo.findById(waitingId);
        if (opt.isEmpty()) {
            fail("Optional was empty!");
        }
        opt.ifPresentOrElse(obj ->{
            assertEquals(waitingId, obj.getId());
        }, Assertions::fail);
    }

    @Test
    @Disabled
    void getWaitingPlayerByTimeControl() {
        List<WaitingPlayer> waitingPlayers = waitListRepo.getWaitingPlayersByTimeControl(TimeControl.TWO_PLUS_1);
        assertEquals(2, waitingPlayers.size());
    }

    @Disabled
    @Test
    void getWaitingPlayersByTimeControl() {
    }

    @Test
    @Disabled
    void setPairedPlayer() {
    }

    @Test
//    @Transactional
    void isPaired() {
        Player dylan = new Player();
        UUID dylanId = UUID.randomUUID();
        dylan.setId(dylanId);
        dylan.setUsername("dylan");
        dylan.setPassword("password");
        playerRepo.save(dylan);

        Player donovan = new Player();
        UUID donovanId = UUID.randomUUID();
        donovan.setUsername("donovan");
        donovan.setPassword("password");
        donovan.setId(donovanId);
        playerRepo.save(donovan);

        pairedPlayersRepo.setPairedPlayers(dylan, donovan);
        assertTrue(pairedPlayersRepo.isPaired(dylan));
    }

    @Test
    void getPairedPlayer() {
        Player dylan = new Player();
        UUID dylanId = UUID.randomUUID();
        dylan.setId(dylanId);
        dylan.setUsername("dylan");
        dylan.setPassword("password");
        playerRepo.save(dylan);

        Player donovan = new Player();
        UUID donovanId = UUID.randomUUID();
        donovan.setId(donovanId);
        donovan.setPassword("password");
        donovan.setUsername("donovan");
        playerRepo.save(donovan);

        pairedPlayersRepo.setPairedPlayers(dylan, donovan);

        Player dino = pairedPlayersRepo.getPairedPlayer(dylan);

        assertEquals(dino.getId(), donovanId);
    }
}