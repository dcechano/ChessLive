package com.example.chess.model;

import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "WAIT_LIST")
public class WaitingPlayer extends AbstractEntity {

    @JoinColumn(name = "PLAYER")
    @OneToOne
    private Player player;

    @Column(name = "CREATED_AT")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "TIME_CONTROL")
    private TimeControl timeControl;

    public WaitingPlayer() {
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public TimeControl getTimeControl() {
        return timeControl;
    }

    public void setTimeControl(TimeControl timeControl) {
        this.timeControl = timeControl;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("WaitingPlayer{");
        sb.append("player=").append(player);
        sb.append(", createdAt=").append(createdAt);
        sb.append(", timeControl=").append(timeControl);
        sb.append('}');
        return sb.toString();
    }
}
