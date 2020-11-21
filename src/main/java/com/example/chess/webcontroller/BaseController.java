package com.example.chess.webcontroller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BaseController {

    @GetMapping
    public String chess() {
        return "chess";
    }

    @GetMapping("/websocket")
    public String socket() {
        return "websocket";
    }
}
