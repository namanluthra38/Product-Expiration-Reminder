package com.verfalarm.controller;

import com.verfalarm.entity.Product;
import com.verfalarm.entity.User;
import com.verfalarm.repository.ProductRepository;
import com.verfalarm.repository.UserRepository;
import com.verfalarm.service.UserDetailsServiceImpl;
import com.verfalarm.service.UserService;
import com.verfalarm.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/public")
public class PublicController {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;
    @PostMapping("/create")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            userService.saveNewUser(user);
            return new ResponseEntity<>(user, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Something went wrong. Please try again later."));
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String identifier = request.get("identifier"); // username or email
        String password = request.get("password");

        try {
            // Determine if identifier is email
            String usernameToAuth;
            if (identifier != null && identifier.contains("@")) {
                // Find user by email
                User userByEmail = userService.findByEmail(identifier);
                if (userByEmail == null) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("message", "Incorrect email or password"));
                }
                usernameToAuth = userByEmail.getUserName();
            } else {
                usernameToAuth = identifier;
            }

            // Authenticate with username
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(usernameToAuth, password));

            UserDetails userDetails = userDetailsService.loadUserByUsername(usernameToAuth);
            String jwt = jwtUtil.generateToken(userDetails.getUsername());

            User loggedInUser = userService.findByName(usernameToAuth);
            String userId = loggedInUser.getId().toString();

            return ResponseEntity.ok(Map.of(
                    "token", jwt,
                    "userId", userId
            ));

        } catch (Exception e) {
            logger.error("Exception occurred while authenticating", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Incorrect username/email or password"));
        }
    }

    @PutMapping("/forget-password")
    public ResponseEntity<?> forgetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");

        if (newPassword == null || newPassword.length() < 8) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Password must be at least 8 characters long"));
        }

        boolean success = userService.forgetPassword(email, newPassword);
        if (!success) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
        }

        String token = authHeader.substring(7);

        try{
            if (jwtUtil.validateToken(token)) {
                return ResponseEntity.ok("Token is valid");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
            }
        }catch (Exception e){
           return  ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }
    }
    @PostMapping("/request-reset")
    public ResponseEntity<?> requestReset(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        try {
            userService.generateAndSendResetCode(email);
            return ResponseEntity.ok(Map.of("message", "Verification code sent to email."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/verify-reset")
    public ResponseEntity<?> verifyReset(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        String newPassword = request.get("newPassword");

        if (newPassword.length() < 8) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Password must be at least 8 characters."));
        }

        boolean success = userService.resetPasswordWithCode(email, code, newPassword);
        if (!success)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid code or email"));
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @PutMapping("/refreshList")
    public ResponseEntity<?> refreshList() {
        List<User> allUsers = userRepository.findAll();
        for(User user : allUsers){
            for(Product product : user.getProductList()){
                if(productRepository.findById(product.getId()).isEmpty()){
                    user.getProductList().remove(product);
                }
            }
            userRepository.save(user);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }



    @GetMapping("/health")
    public String health(){
        return "ok";
    }
}
