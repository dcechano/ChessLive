package com.example.chess.model.utils;

import com.example.chess.db.repo.mysql.StatsRepo;
import com.example.chess.model.dto.GameDTO;
import com.example.chess.model.entity.Statistics;
import com.example.chess.model.entity.TimeControl;

import java.lang.reflect.Field;

public class StatisticsUtils {

    private static final String LOSSES = "Losses";
    private static final String WINS = "Wins";
    private static final String DRAWS = "Draws";
    private static final String DRAWN_RESULT = "Game drawn";
    private static final String WHITE_WON = "white won";
    private static final String BLACK_WON = "black won";

    private static StatsRepo statsRepo;

    public static void updateStats(GameDTO gameDTO) {
        Statistics white = statsRepo.getStatsByUsername(gameDTO.getWhite());
        Statistics black = statsRepo.getStatsByUsername(gameDTO.getBlack());
        TimeControl timeControl = gameDTO.getTimeControl();

        try {
            Field whiteField;
            Field blackField;

            switch (gameDTO.getResult().split(" by")[0]) {
                case DRAWN_RESULT:
                    whiteField = Statistics.class.getDeclaredField(camelCase(timeControl) + DRAWS);
                    blackField = Statistics.class.getDeclaredField(camelCase(timeControl) + DRAWS);
                    break;

                case WHITE_WON:
                    whiteField = Statistics.class.getDeclaredField(camelCase(timeControl) + WINS);
                    blackField = Statistics.class.getDeclaredField(camelCase(timeControl) + LOSSES);
                    break;

                case BLACK_WON:
                    whiteField = Statistics.class.getDeclaredField(camelCase(timeControl) + LOSSES);
                    blackField = Statistics.class.getDeclaredField(camelCase(timeControl) + WINS);
                    break;

                default:
                    throw new IllegalArgumentException("This really shouldn't be possible!");

            }

            whiteField.setAccessible(true);
            Integer integer = (Integer) whiteField.get(white);
            integer = integer + 1;
            whiteField.set(white, integer);

            blackField.setAccessible(true);
            integer = (Integer) blackField.get(black);
            integer = integer + 1;
            blackField.set(black, integer);


        } catch (NoSuchFieldException | IllegalAccessException e) {
            e.printStackTrace();
        }

        statsRepo.merge(white);
        statsRepo.merge(black);
    }

    private static String camelCase(TimeControl timeControl) {
        String[] s = timeControl.toString().split("_");
        String first = s[0].toLowerCase();
        String second = s[1].charAt(0) + s[1].substring(1).toLowerCase();
        return first + second + s[2];
    }



    public static void setStatsRepo(StatsRepo repo) {
        statsRepo = repo;
    }

}
