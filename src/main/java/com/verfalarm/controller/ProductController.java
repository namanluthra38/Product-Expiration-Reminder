package com.verfalarm.controller;

import com.verfalarm.entity.Product;
import com.verfalarm.entity.User;
import com.verfalarm.service.EmailService;
import com.verfalarm.service.ProductService;
import com.verfalarm.service.UserService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.Collections.*;
import com.verfalarm.entity.Product;
class ListComparator implements Comparator<Product> {


    public int compare(Product p1, Product p2) {
        boolean p1ExpiredOrFinished = (p1.getDaysToExpiry() <= 0 || p1.getPercentageLeft() == 0);
        boolean p2ExpiredOrFinished = (p2.getDaysToExpiry() <= 0 || p2.getPercentageLeft() == 0);

        if (p1ExpiredOrFinished && !p2ExpiredOrFinished) {
            return 1;
        } else if (!p1ExpiredOrFinished && p2ExpiredOrFinished) {
            return -1;
        } else if (p1ExpiredOrFinished) {
            return 0;
        }

        int expiryComparison = Long.compare(p1.getDaysToExpiry(), p2.getDaysToExpiry());
        if (expiryComparison != 0) {
            return expiryComparison;
        }

        return Double.compare(p2.getPercentageLeft(), p1.getPercentageLeft());
    }

}
@RestController
@RequestMapping("product")
public class ProductController {
    @Autowired
    UserService userService;
    @Autowired
    ProductService productService;
    @Autowired
    EmailService emailService;
    @GetMapping("products")
    public ResponseEntity<?> getAllProductsOfUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        User user = userService.findByName(userName);
        
        List<Product> all = user.getProductList();
        all.sort(new ListComparator());

        for(Product p : all){
            p.calculateTimeToExpiry();
            productService.saveOldEntry(p);
            p.getIdstr();
            System.out.println(p.getId());
        }
        return new ResponseEntity<>(all, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Product> createEntry(@RequestBody Product myEntry) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userName = authentication.getName();
            productService.saveEntry(myEntry, userName);

            return new ResponseEntity<>(myEntry, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @GetMapping("id/{_id}")
    public ResponseEntity<?> getProductById(@PathVariable String _id) {
        System.out.println("request received " + _id);
        ObjectId id = new ObjectId(_id);
        System.out.println(id);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        User user = userService.findByName(userName);
        List<Product> collect = user.getProductList().stream().filter(x -> x.getId().equals(id)).toList();
        if (!collect.isEmpty()) {
            
            Optional<Product> ProductEntry = productService.findById(id);
            if (ProductEntry.isPresent()) {
                System.out.println("found product " + ProductEntry.get().getName());
                return new ResponseEntity<>(ProductEntry.get(), HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @PutMapping("id/{_id}")
    public ResponseEntity<?> updateProductById(@PathVariable String _id, @RequestBody Product newEntry) {
        System.out.println("function reached here");
        ObjectId id = new ObjectId(_id);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        User user = userService.findByName(userName);
        List<Product> collect = user.getProductList().stream().filter(x -> x.getId().equals(id)).collect(Collectors.toList());
        if (!collect.isEmpty()) {
            Optional<Product> product = productService.findById(id);
            if (product.isPresent()) {
                Product existingProduct = product.get();
                existingProduct.setName(newEntry.getName());
                existingProduct.setQuantityBought(newEntry.getQuantityBought());
                existingProduct.setPercentageLeft(newEntry.getPercentageLeft());
                existingProduct.setUnit(newEntry.getUnit());
                existingProduct.setDisableAlerts(newEntry.getDisableAlerts());
                existingProduct.setCategory(newEntry.getCategory());
                existingProduct.setExpiryDate(newEntry.getExpiryDate());
                productService.saveOldEntry(existingProduct);
                return new ResponseEntity<>(existingProduct, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @DeleteMapping("id/{myId}")
    public ResponseEntity<?> deleteProductById(@PathVariable String myId) {
        ObjectId id = new ObjectId(myId);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        boolean removed = productService.deleteById(id, username);
        System.out.println(removed);
        if (removed) {
            return new ResponseEntity<>(HttpStatus.OK);
        } else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("search")
    public ResponseEntity<?> search(@RequestParam String query) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            String userName = authentication.getName();
            if (userName == null || userName.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            User user = userService.findByName(userName);

            // Check if user exists
            if (user == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            List<Product> filtered = productService.searchByName(query, user);
            return new ResponseEntity<>(filtered, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
