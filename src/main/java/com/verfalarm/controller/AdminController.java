package com.verfalarm.controller;

import com.verfalarm.entity.Product;
import com.verfalarm.entity.User;
import com.verfalarm.repository.UserRepository;
import com.verfalarm.repository.UserRepositoryImpl;
import com.verfalarm.service.EmailService;
import com.verfalarm.service.ProductService;
import com.verfalarm.service.UserDetailsServiceImpl;
import com.verfalarm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private UserService userService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserRepositoryImpl userRepositoryImpl;
    @Autowired
    private ProductService productService;
    @GetMapping("/all-users")
    public ResponseEntity<?> getAllUsers() {
        List<User> all = userService.getAll();
        if (all != null && !all.isEmpty()) {
            return new ResponseEntity<>(all, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @GetMapping("/all-users-wanting-alerts")
    public ResponseEntity<?> getAllUsersWantingAlerts() {
        List<User> all = userRepositoryImpl.getUsersForAlert();
        if (all != null && !all.isEmpty()) {
            return new ResponseEntity<>(all, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @PostMapping("refresh-dates")
    public ResponseEntity<?> refresh(){
        List<User> all = userService.getAll();
        if (all != null && !all.isEmpty()) {
            for(User user : all){
                for(Product product : user.getProductList()){
                    product.calculateTimeToExpiry();
                    productService.saveOldEntry(product);
                }
            }
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/create-admin-user")
    public void createUser(@RequestBody User user) {
        userService.saveNewAdmin(user);
    }
}
