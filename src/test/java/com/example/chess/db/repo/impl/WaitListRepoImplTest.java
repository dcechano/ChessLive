package com.example.chess.db.repo.impl;

import com.example.chess.db.repo.PlayerRepo;
import com.example.chess.db.repo.h2.PairedPlayersRepo;
import com.example.chess.db.repo.h2.WaitListRepo;
import com.example.chess.model.entity.Player;
import com.example.chess.model.entity.TimeControl;
import com.example.chess.model.entity.WaitingPlayer;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
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
    @Autowired
    private PlayerRepo playerRepo;
    Logger logger = Logger.getLogger(getClass().toString());


    private final UUID dylanId = UUID.fromString("f6bdc92e-c77f-49be-9fd0-4ae783dd07ab");
    private final UUID donovanId = UUID.fromString("d22a6fe8-23e7-4984-8100-59621f35815e");
    private final UUID veronicaId = UUID.fromString("b88f1126-b5fa-436a-9794-93760c7f6009");
    private final UUID rachelId = UUID.fromString("6260ebf7-f09b-42a8-91f3-c30122f2964a");

    private final UUID waitId1 = UUID.fromString("6fb37b62-fed4-4df3-acd5-5269a3f25b83");
    private final UUID waitId2 = UUID.fromString("25439655-1aa2-49b6-b094-2b2e0bb0a3c0");

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
    void getWaitingPlayerByTimeControl() {
        List<WaitingPlayer> waitingPlayers = waitListRepo.getWaitingPlayersByTimeControl(TimeControl.TWO_PLUS_1);
        assertEquals(2, waitingPlayers.size());
    }

    @Test
    void getWaitingPlayersByTimeControl() {
    }

    @Test
    void setPairedPlayer() {
        logger.info(UUID.randomUUID().toString());
        logger.info(UUID.randomUUID().toString());
        logger.info(UUID.randomUUID().toString());
        logger.info(UUID.randomUUID().toString());
        logger.info(UUID.randomUUID().toString());
    }

    @Test
    void isPaired() {
        Player dylan = new Player();
        UUID dylanId = UUID.randomUUID();
        dylan.setId(dylanId);
        dylan.setUsername("dylan");
        playerRepo.save(dylan);

        Player donovan = new Player();
        UUID donovanId = UUID.randomUUID();
        donovan.setUsername("donovan");
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
        playerRepo.save(dylan);

        Player donovan = new Player();
        UUID donovanId = UUID.randomUUID();
        donovan.setId(donovanId);
        donovan.setUsername("donovan");
        playerRepo.save(donovan);

        pairedPlayersRepo.setPairedPlayers(dylan, donovan);

        Player dino = pairedPlayersRepo.getPairedPlayer(dylan);

        assertEquals(dino.getId(), donovanId);
    }
}