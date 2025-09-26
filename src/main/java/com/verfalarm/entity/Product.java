package com.verfalarm.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import com.verfalarm.util.DateFormatterUtil;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;

import static com.verfalarm.util.DateFormatterUtil.formatDate;

@Document(collection = "product")
@Data
@Builder
@RequiredArgsConstructor
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    private ObjectId id;
    private String strid;

    @NonNull
    private String name;
    private String category;

    @NonNull
    private String unit;
    @NonNull
    private Double quantityBought;
    private Double quantityConsumed;
    private Double percentageLeft;

    private String alertDuration;
    private Boolean disableAlerts;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    @NonNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate expiryDate;

    private long daysToExpiry;
    private double weeksToExpiry;
    private double monthsToExpiry;





    public void setStartDate() {
        this.startDate = LocalDate.now(ZoneId.of("Asia/Kolkata"));
    }
    @JsonProperty("id")
    public String getIdstr() {
        this.strid = id != null ? id.toHexString() : null;
        return this.strid;
    }


    public void calculateInitialTimeToExpiry() {
        if (this.startDate != null) {
            // Calculate days
            this.daysToExpiry = ChronoUnit.DAYS.between(this.startDate, this.expiryDate);

            DecimalFormat df = new DecimalFormat("#.#");

            this.weeksToExpiry = Double.parseDouble(df.format(this.daysToExpiry / 7.0));

            this.monthsToExpiry = Double.parseDouble(df.format(this.daysToExpiry / 30.0)); // Approximate months
            if(this.monthsToExpiry>6) this.setAlertDuration("monthly");
            else if (this.monthsToExpiry>1) {
                this.setAlertDuration("weekly");
            } else if (this.weeksToExpiry>2) {
                this.setAlertDuration("twiceAWeek");
            }
            else this.setAlertDuration("daily");
        }
    }
    public void calculateTimeToExpiry(){
        this.daysToExpiry = ChronoUnit.DAYS.between(LocalDate.now(), this.expiryDate);
        DecimalFormat df = new DecimalFormat("#.#");

        this.weeksToExpiry = Double.parseDouble(df.format(this.daysToExpiry / 7.0));

        this.monthsToExpiry = Double.parseDouble(df.format(this.daysToExpiry / 30.0));
        if (this.weeksToExpiry < 1) {
            this.alertDuration = "daily";
        }
        if (this.daysToExpiry <= 0) {
            this.daysToExpiry = 0;
            this.weeksToExpiry = 0;
            this.monthsToExpiry = 0;
            this.alertDuration = "expired";
            this.setDisableAlerts(true);
        }

    }
    public String getStringDate(){

        return formatDate(this.getExpiryDate());
    }
}
