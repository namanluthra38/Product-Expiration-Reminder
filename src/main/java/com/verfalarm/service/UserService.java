package com.verfalarm.service;

import com.verfalarm.entity.Product;
import com.verfalarm.repository.ProductRepository;
import com.verfalarm.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.*;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.verfalarm.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
public class UserService {
    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private EmailService emailService;
    public void saveNewUser(User user) {
        try {
            // Validate Email Format
            String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
            Pattern pattern = Pattern.compile(emailRegex);
            Matcher matcher = pattern.matcher(user.getEmail());

            if (!matcher.matches()) {
                throw new IllegalArgumentException("Invalid email format.");
            }

            // Check if username or email already exists
            if (userRepository.existsByUserName(user.getUserName())) {
                throw new IllegalArgumentException("Username is already taken.");
            }
            if (userRepository.existsByEmail(user.getEmail())) {
                throw new IllegalArgumentException("Email is already registered.");
            }
            if (user.getPassword().length()<8) {
                throw new IllegalArgumentException("Password is too short, Minimum 8 characters required");
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setRoles(List.of("user"));
            user.setWantsAlert(true);
            userRepository.save(user);
        } catch (IllegalArgumentException e) {
            throw e; 
        } catch (Exception e) {
            logger.error("Error while registering {}", user.getUserName(), e);
            throw new RuntimeException("An unexpected error occurred.");
        }
    }

    public void saveNewAdmin(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(List.of("user","admin"));
        userRepository.save(user);
    }
    public List<User> getAll(){
        return userRepository.findAll();
    }
    public Optional<User> getById(ObjectId id){
        return userRepository.findById(id);
    }
    public User findByName(String userName){
        return  userRepository.findByUserName(userName);
    }
    public void deleteUser(String username){
        User user = userRepository.findByUserName(username);
        if(user==null) return;
        for(Product p : user.getProductList()){
            productRepository.delete(p);
        }
        userRepository.deleteByUserName(username);
    }
    public boolean changePassword(String userId, String oldPassword, String newPassword) {
        Optional<User> optionalUser = userRepository.findById(new ObjectId(userId));

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            
            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                return false; 
            }

            
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return true;
        }

        return false; 
    }

    public void saveUser(User userInDb) {
        userRepository.save(userInDb);
    }
    public void saveUserWithPassword(User userInDb) {
        userInDb.setPassword(passwordEncoder.encode(userInDb.getPassword()));
        userRepository.save(userInDb);
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(new ObjectId(id));
    }

    public boolean forgetPassword(String email, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if(userOpt.isEmpty()) return false;
        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }
    private final Map<String, String> resetCodes = new ConcurrentHashMap<>();

    public String generateAndSendResetCode(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Email not registered.");
        }

        String code = String.valueOf((int)(Math.random() * 900000) + 100000); // 6-digit code
        resetCodes.put(email, code);

        
        String subject = "Password Reset Code";
        String body = "Your password reset code is: " + code;


        emailService.sendMail(email, subject, body);
        System.out.println("DEBUG: Sending code to " + email + ": " + code); // Log for now

        return code;
    }

    public boolean verifyResetCode(String email, String code) {
        return resetCodes.containsKey(email) && resetCodes.get(email).equals(code);
    }

    public boolean resetPasswordWithCode(String email, String code, String newPassword) {
        if (!verifyResetCode(email, code)) return false;
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return false;

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        resetCodes.remove(email);
        return true;
    }
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

}
