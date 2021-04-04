package com.example.chess.security.auth;


import com.example.chess.db.repo.PlayerRepo;
import com.example.chess.model.entity.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Component
public class AuthenticationHandler implements AuthenticationSuccessHandler {

    private PlayerRepo mySqlPlayerRepo;

    private PlayerRepo h2PlayerRepo;

    public AuthenticationHandler() {
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest httpServletRequest,
                                        HttpServletResponse httpServletResponse,
                                        Authentication authentication) throws IOException, ServletException {

        String username = authentication.getName();
        Player player = mySqlPlayerRepo.findByUsername(username);
        h2PlayerRepo.findById(player.getId()).ifPresentOrElse(player1 -> {
        }, () -> {
            h2PlayerRepo.save(player);
        });

        HttpSession session = httpServletRequest.getSession();
        session.setAttribute("user", player);

        httpServletResponse.sendRedirect(httpServletRequest.getContextPath() + "/");
    }

    @Autowired
    public void setMySqlPlayerRepo(@Qualifier("mySqlPlayerRepo") PlayerRepo mySqlPlayerRepo) {
        this.mySqlPlayerRepo = mySqlPlayerRepo;
    }

    @Autowired
    public void setH2PlayerRepo(@Qualifier("h2PlayerRepo") PlayerRepo h2PlayerRepo) {
        this.h2PlayerRepo = h2PlayerRepo;
    }
}
