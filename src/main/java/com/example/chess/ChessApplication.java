package com.example.chess;

import com.example.chess.db.repo.mysql.StatsRepo;
import com.example.chess.model.utils.StatisticsUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.annotation.PostConstruct;

@SpringBootApplication
public class ChessApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChessApplication.class, args);
    }

    @Autowired
    private StatsRepo statsRepo;

    @PostConstruct
    void construct() {
        StatisticsUtils.setStatsRepo(statsRepo);
    }


}