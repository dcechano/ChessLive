package com.example.chess.security.auth;

import com.example.chess.db.repo.PlayerRepo;
import com.example.chess.model.entity.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class LogoutHandler implements LogoutSuccessHandler {

    private PlayerRepo h2PlayerRepo;

    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        String username = authentication.getName();
        h2PlayerRepo.deleteByUsername(username);
        response.sendRedirect(request.getContextPath() + "/");
    }

    @Autowired
    public void setH2PlayerRepo(@Qualifier("h2PlayerRepo") PlayerRepo playerRepo) {
        this.h2PlayerRepo = playerRepo;
    }
}
