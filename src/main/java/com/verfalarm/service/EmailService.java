package com.verfalarm.service;

import com.verfalarm.entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendProductAlert(String to, List<Product> products,String type) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setFrom("verf@demomailtrap.co");
            helper.setSubject("🔔 " + type.toUpperCase() + "Expiration Reminder - Check Your Products");

            String htmlContent = buildHtmlEmail(products);
            helper.setText(htmlContent, true);  // Enable HTML format

            mailSender.send(message);
            System.out.println("Email sent to " + to);

        } catch (MessagingException e) {
            System.err.println("Error sending email: " + e.getMessage());
        }
    }

    private String buildHtmlEmail(List<Product> products) {
        StringBuilder emailContent = new StringBuilder();

        emailContent.append("<!DOCTYPE html>")
                .append("<html><head>")
                .append("<style>")
                .append("body { font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; }")
                .append(".container { background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px #ddd; }")
                .append(".title { font-size: 22px; font-weight: bold; color: #FF5733; text-align: center; }")
                .append(".product { font-size: 16px; color: #333; padding: 10px; border-bottom: 1px solid #eee; }")
                .append(".highlight { font-weight: bold; color: #FF5733; }")
                .append(".button-container { text-align: center; margin-top: 20px; }")
                .append(".button { background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block; }")
                .append(".footer { font-size: 12px; color: gray; text-align: center; margin-top: 20px; }")
                .append("</style>")
                .append("</head><body>")
                .append("<div class='container'>")
                .append("<p class='title'>🔔 Expiration Reminder</p>");

        for (Product product : products) {
            emailContent.append("<div class='product'>")
                    .append("<p><strong>").append(product.getName()).append("</strong></p>")
                    .append("<p>📅 Expires on: <span class='highlight'>").append(product.getStringDate()).append("</span></p>")
                    .append("<p>⚖️ Remaining: <span class='highlight'>").append(product.getPercentageLeft()).append("%</span></p>")
                    .append("<p>⏳ Days to Expiry: <span class='highlight'>").append(product.getDaysToExpiry()).append("</span> days</p>")
                    .append("</div>");
        }

        emailContent.append("<div class='button-container'>")
                .append("<a class='button' href='http://localhost:8080/dashboard.html'>Open Inventory</a>")
                .append("</div>");

        emailContent.append("<p class='footer'>Check your inventory now to avoid waste! ✅</p>")
                .append("</div></body></html>");

        return emailContent.toString();
    }

    public void sendMail(String email, String subject, String body) {
        try {
            // Enable HTML format
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("verf@demomailtrap.co");
            message.setText(body);
            message.setSubject(subject);
            message.setTo(email);
            mailSender.send(message);
            System.out.println("Email sent to " + email);

        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
        }
    }
    public void sendHtmlConfirmation(String to, Product product, String userName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("verf@demomailtrap.co");
            helper.setTo(to);
            helper.setSubject("✅ Product Successfully Added - Verfalarm");

            String htmlContent = "<!DOCTYPE html>"
                    + "<html><head><style>"
                    + "body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }"
                    + ".container { background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }"
                    + ".title { font-size: 20px; color: #28a745; font-weight: bold; text-align: center; }"
                    + ".details { margin-top: 15px; font-size: 16px; color: #333; }"
                    + ".label { font-weight: bold; color: #555; }"
                    + ".highlight { color: #007bff; }"
                    + ".footer { margin-top: 20px; font-size: 13px; color: gray; text-align: center; }"
                    + "</style></head><body>"
                    + "<div class='container'>"
                    + "<p class='title'>✅ Product Added Successfully</p>"
                    + "<p>Dear <strong>" + userName + "</strong>,</p>"
                    + "<p>Your product has been successfully added to your inventory. Here are the details:</p>"
                    + "<div class='details'>"
                    + "<p><span class='label'>Product Name:</span> <span class='highlight'>" + product.getName() + "</span></p>"
                    + "<p><span class='label'>Category:</span> " + product.getCategory() + "</p>"
                    + "<p><span class='label'>Quantity Bought:</span> " + product.getQuantityBought() + " " + product.getUnit() + "</p>"
                    + "<p><span class='label'>Quantity Consumed:</span> " + product.getQuantityConsumed() + " " + product.getUnit() + "</p>"
                    + "<p><span class='label'>Expiry Date:</span> " + product.getStringDate() + "</p>"
                    + "<p><span class='label'>Days Until Expiry:</span> " + product.getDaysToExpiry() + "</p>"
                    + "</div>"
                    + "<p>⏳ We’ll remind you as the expiry date approaches!<br>Stay on top of your inventory and reduce waste.</p>"
                    + "<div class='footer'>Thank you for using Verfalarm!<br>— Verfalarm Team</div>"
                    + "</div></body></html>";

            helper.setText(htmlContent, true); // true = HTML
            mailSender.send(message);
            System.out.println("Confirmation email sent to " + to);
        } catch (MessagingException e) {
            System.err.println("Error sending confirmation email: " + e.getMessage());
        }
    }

}
