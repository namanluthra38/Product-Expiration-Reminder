package com.verfalarm.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.verfalarm.entity.Message;
import com.verfalarm.service.MessageService;
 // Allow frontend access
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping
    public Message receiveMessage(@RequestBody Message message) {
        return messageService.saveMessage(message);
    }
}

