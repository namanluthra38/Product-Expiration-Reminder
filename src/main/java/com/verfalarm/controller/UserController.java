package com.verfalarm.controller;

import com.verfalarm.entity.User;
import com.verfalarm.repository.UserRepository;
import com.verfalarm.service.UserDetailsServiceImpl;
import com.verfalarm.service.UserService;
import com.verfalarm.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService userService;
    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    JwtUtil jwtUtil;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        Optional<User> userOptional = userService.findById(id);

        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        }
        return ResponseEntity.notFound().build();
    }
    @PutMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable String id, @RequestBody Map<String, String> passwords) {
        try {
            String oldPassword = passwords.get("oldPassword");
            String newPassword = passwords.get("newPassword");

            if (oldPassword == null || newPassword == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Old and new password are required"));
            }

            boolean isUpdated = userService.changePassword(id, oldPassword, newPassword);
            if (isUpdated) {
                return ResponseEntity.ok(Map.of("message", "Password updated successfully!"));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Incorrect old password"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Error updating password"));
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody User updatedUser) {
        Optional<User> userOptional = userService.findById(id);

        if (userOptional.isPresent()) {
            User existingUser = userOptional.get();
            existingUser.setUserName(updatedUser.getUserName());
            existingUser.setEmail(updatedUser.getEmail());

            userService.saveUser(existingUser);

            // Generate new JWT with updated username
            UserDetails userDetails = userDetailsService.loadUserByUsername(existingUser.getUserName());
            String newToken = jwtUtil.generateToken(userDetails.getUsername());

            Map<String, Object> response = new HashMap<>();
            response.put("user", existingUser);
            response.put("token", newToken);

            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }
    @PutMapping("/update")
    public ResponseEntity<Map<String, String>> updateUser(@RequestBody User user) {
        System.out.println("Inside update user");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User userInDb = userService.findByName(username);

        if (userInDb != null) {
            userInDb.setUserName(user.getUserName());
            userInDb.setPassword(user.getPassword());
            userInDb.setEmail(user.getEmail());
            userService.saveUserWithPassword(userInDb);
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "User updated successfully");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/noAlerts")
    public ResponseEntity<?> noAlerts(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User userInDb = userService.findByName(username);
        if(userInDb!=null){
            userInDb.setWantsAlert(false);
            userService.saveUser(userInDb);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @DeleteMapping()
    public ResponseEntity<?> deleteUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User userInDb = userService.findByName(username);
        if(userInDb==null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        userService.deleteUser(username);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
