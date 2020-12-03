package com.example.chess.model;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "PLAYER")
public class Player extends AbstractEntity{

    @Column(name = "USERNAME")
    private String username;

    @Transient
//    @OneToMany(mappedBy = "white")
    private List<Game> gameList;

    @Column(name = "JOIN_DATE")
    private LocalDate joinDate;

    public Player() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<Game> getGameList() {
        return gameList;
    }

    public void setGameList(List<Game> gameList) {
        this.gameList = gameList;
    }

    public LocalDate getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(LocalDate joinDate) {
        this.joinDate = joinDate;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("Player{");
        sb.append("username='").append(username).append('\'');
        sb.append(", joinDate=").append(joinDate);
        sb.append('}');
        return sb.toString();
    }
}
