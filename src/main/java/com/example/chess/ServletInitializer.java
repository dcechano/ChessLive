package com.example.chess;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.stereotype.Component;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpSessionListener;

@Component
public class ServletInitializer extends SpringBootServletInitializer {

    private HttpSessionListener sessionListener;

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(ChessApplication.class);
    }

    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        super.onStartup(servletContext);
        servletContext.addListener(sessionListener);
    }

    @Autowired
    public void setSessionListener(HttpSessionListener sessionListener) {
        this.sessionListener = sessionListener;
    }
}
