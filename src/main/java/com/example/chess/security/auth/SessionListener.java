package com.example.chess.security.auth;

import com.example.chess.db.repo.PlayerRepo;
import com.example.chess.model.entity.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

@Component
public class SessionListener implements HttpSessionListener {

    private PlayerRepo h2PlayerRepo;

    @Override
    public void sessionCreated(HttpSessionEvent event) {
        event.getSession().setMaxInactiveInterval(60);
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent event) {
        Player player = (Player) event.getSession().getAttribute("user");
        h2PlayerRepo.delete(player);
    }

    @Autowired
    public void setH2PlayerRepo(@Qualifier("h2PlayerRepo") PlayerRepo h2PlayerRepo) {
        this.h2PlayerRepo = h2PlayerRepo;
    }
}
