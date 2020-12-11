package com.example.chess.security.auth;

import com.example.chess.model.entity.Player;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserAuthService extends UserDetailsService {

    Player findByUsername(String username);

    void save(Player user);
}
