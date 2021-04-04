package com.example.chess.model.entity;

public enum TimeControl {
    TWO_PLUS_1("TWO_PLUS_1"),
    FIVE_PLUS_0("FIVE_PLUS_0"),
    FIVE_PLUS_5("FIVE_PLUS_5"),
    TEN_PLUS_10("TEN_PLUS_10");

    private final int minutes;

    private final int increment;

    TimeControl(String s) {
        switch (s) {
            case "TWO_PLUS_1":
                minutes = 2;
                increment = 1;
                break;

            case "FIVE_PLUS_0":
                minutes = 5;
                increment = 0;
                break;

            case "FIVE_PLUS_5":
                minutes = 5;
                increment = 5;
                break;

            default:
                minutes = 10;
                increment = 10;
        }
    }

    public int getMinutes() {
        return minutes;
    }

    public int getIncrement() {
        return increment;
    }

    public String prettyCode() {
        return minutes + " + " + increment;
    }

}