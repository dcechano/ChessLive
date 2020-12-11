package com.example.chess.security;

import org.springframework.context.annotation.Configuration;

@Configuration
public class WebSocketSecurityConfig{
//public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {

//    @Override
//    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
//        messages.simpDestMatchers("/secured/**")
//                .authenticated()
//                .anyMessage().authenticated()
//                .simpSubscribeDestMatchers("/topic/**").authenticated();
//
//        messages.simpTypeMatchers(SimpMessageType.CONNECT, SimpMessageType.SUBSCRIBE,
//                SimpMessageType.UNSUBSCRIBE, SimpMessageType.DISCONNECT,
//                SimpMessageType.MESSAGE).permitAll();
//    }
//
//    @Override
//    protected boolean sameOriginDisabled() {
//        return true;
//    }
}
