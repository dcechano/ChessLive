package com.example.chess.config.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;

@Configuration
public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {

    @Override
    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
        messages.simpDestMatchers("/secured/**", "/user/**")
                .authenticated()
                .anyMessage().authenticated()
                .simpSubscribeDestMatchers("/topic/**").authenticated();

        messages.simpTypeMatchers(SimpMessageType.CONNECT, SimpMessageType.SUBSCRIBE,
                SimpMessageType.UNSUBSCRIBE, SimpMessageType.DISCONNECT,
                SimpMessageType.MESSAGE).permitAll();
    }

    @Override
    protected boolean sameOriginDisabled() {
        return true;
    }
}
