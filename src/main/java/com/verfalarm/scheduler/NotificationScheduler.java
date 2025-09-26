package com.verfalarm.scheduler;

import com.verfalarm.entity.Product;
import com.verfalarm.entity.User;
import com.verfalarm.repository.UserRepositoryImpl;
import com.verfalarm.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Predicate;

class DailyFilter implements Predicate<Product> {
    @Override
    public boolean test(Product product) {
        return !product.getDisableAlerts() && product.getAlertDuration().equals("daily");
    }
}

class WeeklyFilter implements Predicate<Product> {
    @Override
    public boolean test(Product product) {
        return !product.getDisableAlerts() && product.getAlertDuration().equals("weekly");
    }
}

class MonthlyFilter implements Predicate<Product> {
    @Override
    public boolean test(Product product) {
        return !product.getDisableAlerts() && product.getAlertDuration().equals("monthly");
    }
}

@Service
public class NotificationScheduler {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepositoryImpl userRepository;


    @Scheduled(cron = "0 35 17 1/1 * ?")
    public void dailyAlert() {
        sendAlerts(new DailyFilter(), "Daily");
    }

    
    @Scheduled(cron = "0 42 17 ? * SUN")
    public void weeklyAlert() {
        sendAlerts(new WeeklyFilter(), "Weekly");
    }

   
    @Scheduled(cron = "0 0 10 1 * *")
    public void monthlyAlert() {
        sendAlerts(new MonthlyFilter(), "Monthly");
    }
    @Scheduled(cron = "0 * * ? * *") // Runs every minute
    public void sayHi() {
        System.out.println("hii");
    }
    private void sendAlerts(Predicate<Product> filter, String type) {
        try {
            List<User> userList = userRepository.getUsersForAlert();
            for (User user : userList) {
                List<Product> products = user.getProductList().stream().filter(filter).toList();

                if (!products.isEmpty()) {
                    emailService.sendProductAlert(user.getEmail(), products,type);
                }
            }
        } catch (Exception e) {
            System.err.println("Error sending " + type + " alerts: " + e.getMessage());
        }
    }



}
