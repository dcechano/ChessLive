package com.example.chess.security.auth;

import com.example.chess.db.repo.PlayerRepo;
import com.example.chess.model.entity.Player;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final PlayerRepo userRepo;

    public UserDetailsServiceImpl(@Qualifier("mySqlPlayerRepo") PlayerRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Player player = userRepo.findByUsername(username);
        if (player == null) {
            throw new UsernameNotFoundException("Player with username: " + username + " could not be found!");
        }
        Collection<GrantedAuthority> grantedAuthorityRoles = List.of(new SimpleGrantedAuthority("USER"));

        return new User(player.getUsername(), player.getPassword(), grantedAuthorityRoles);
    }

}
