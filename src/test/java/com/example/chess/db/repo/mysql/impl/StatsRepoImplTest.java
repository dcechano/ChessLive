package com.example.chess.db.repo.mysql.impl;

import com.example.chess.db.repo.mysql.StatsRepo;
import com.example.chess.model.entity.Statistics;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class StatsRepoImplTest {

    @Autowired
    StatsRepo statsRepo;

    @BeforeEach
    void setup() {
        assertNotNull(statsRepo);
    }

    @Test
    void getStatsByUsername() {
        Statistics stats = statsRepo.getStatsByUsername("test");
        assertNotNull(stats);
        assertEquals("test", stats.getPlayerUsername());

    }
}