package com.example.chess.model.entity;

public enum TimeControl {
    TWO_PLUS_1("TWO_PLUS_1"),
    FIVE_PLUS_0("FIVE_PLUS_0"),
    FIVE_PLUS_5("FIVE_PLUS_5"),
    TEN_PLUS_10("TEN_PLUS_10");

    TimeControl(String s) {
    }

    public String prettyCode() {
        switch (this.name()){
            case "TWO_PLUS_1": return "2 + 1";

            case "FIVE_PLUS 0": return "5 + 0";

            case "FIVE_PLUS_5": return "5 + 5";

            default: return "10 + 10";
        }
    }
}