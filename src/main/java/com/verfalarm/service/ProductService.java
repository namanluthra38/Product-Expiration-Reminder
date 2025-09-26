package com.verfalarm.service;

import com.verfalarm.entity.Product;
import com.verfalarm.entity.User;
import com.verfalarm.repository.ProductRepository;
import com.verfalarm.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private EmailService emailService;
    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

public void saveEntry(Product product, String userName) {
    try {
        System.out.println("looking for " + userName);
        User user = userService.findByName(userName);
        if (user.getProductList() == null) user.setProductList(new ArrayList<>());
        product.setDisableAlerts(false);

        product.setStartDate();
        product.calculateInitialTimeToExpiry();

        if (product.getCategory() == null) product.setCategory("others");
        if (product.getQuantityConsumed() == null) product.setQuantityConsumed(0d);

        if (product.getExpiryDate().isBefore(product.getStartDate())) {
            throw new IllegalArgumentException("Expiry date must be later than today.");
        }

        Double quantityBought = product.getQuantityBought();
        Double QuantityConsumed = product.getQuantityConsumed();
        if (QuantityConsumed > quantityBought) throw new RuntimeException();


        Product saved = productRepository.save(product);
        if(user.getProductList().size()==20 && !user.getRoles().contains("premium"))  throw new Exception("Product limit exceeded");
        user.getProductList().add(saved);
        userService.saveUser(user);
        String subject = "✅ Product Added: " + product.getName() + " Successfully Registered!";

        String body = "Dear " + user.getUserName() + ",\n\n" +
                "Your product " + product.getName() + " has been successfully added to your inventory.\n\n" +
                "Here are the details:\n\n" +
                "- Product Name: " + product.getName() + "\n" +
                "- Category: " + product.getCategory() + "\n" +
                "- Quantity Bought: " + product.getQuantityBought() + product.getUnit() + "\n" +
                "- Quantity Consumed till now : " + product.getQuantityConsumed() + product.getUnit() + "\n" +
                "- Expiry Date: " + product.getExpiryDate() + "\n" +
                "- Days Until Expiry: " + product.getDaysToExpiry() + "\n\n" +
                "⏳ We’ll remind you as the expiry date approaches!\n" +
                "Stay on top of your inventory and reduce waste.\n\n" +
                "Thank you for using Verfalarm!\n\n" +
                "Best regards,\n" +
                "Verfalarm Team";

        //emailService.sendMail(user.getEmail(),subject,body);
        emailService.sendHtmlConfirmation(user.getEmail(),product,user.getUserName());
    } catch (Exception e) {
        logger.error("error while adding {}", product.getName(), e);

        
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
}

    public boolean deleteById(ObjectId id, String userName) {
        boolean removed = false;
        try {
            User user = userService.findByName(userName);
            removed = user.getProductList().removeIf(x -> x.getId().equals(id));
            if (removed) {
                userService.saveUser(user);
                productRepository.deleteById(id);
            }
        } catch (Exception e) {
            System.out.println("An error occurred while deleting the entry.");
            throw new RuntimeException("An error occurred while deleting the entry.", e);
        }
        return removed;
    }

    public void saveEntry(Product product) {
        productRepository.save(product);
    }

    public Optional<Product> findById(ObjectId id) {
        return productRepository.findById(id);
    }

    public void saveOldEntry(Product old) {
        productRepository.save(old);
    }
    public List<Product> searchByName(String query,User user) {

        List<Product> all = user.getProductList();
        return all.stream().filter(x -> x.getName().toLowerCase().contains(query.toLowerCase())).toList();
    }
}
