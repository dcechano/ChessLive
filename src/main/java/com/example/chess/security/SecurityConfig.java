package com.example.chess.security;

import org.springframework.context.annotation.Configuration;

@Configuration
//@EnableWebSecurity
public class SecurityConfig{
//public class SecurityConfig extends WebSecurityConfigurerAdapter {

//    @Override
//    public void configure(WebSecurity web) throws Exception {
//        web.ignoring().mvcMatchers("/resources/**", "/images/**",
//                "/styles/**");
//    }
//
//    @Override
//    protected void configure(HttpSecurity http) throws Exception {
//        http.authorizeRequests()
//                .and().formLogin()
//                .defaultSuccessUrl("/")
//                .permitAll()
//                .and()
//                .logout()
//                .logoutSuccessUrl("/")
//                .invalidateHttpSession(true)
//                .clearAuthentication(true);
//    }
//
//    @Bean
//    @Override
//    protected UserDetailsService userDetailsService() {
//        UserDetails john = User.withUsername("john")
//                .password(encoder().encode("password"))
//                .roles("USER").build();
//
//        UserDetails jane = User.withUsername("jane")
//                .password(encoder().encode("password"))
//                .roles("USER").build();
//
//        return new InMemoryUserDetailsManager(john, jane);
//    }
//
//    @Bean
//    PasswordEncoder encoder() {
//        return new BCryptPasswordEncoder();
//    }
}
