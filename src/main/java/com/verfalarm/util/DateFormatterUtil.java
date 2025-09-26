package com.verfalarm.util;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoField;

@Component
public class DateFormatterUtil {

    public static String formatDate(LocalDate date) {
        if (date == null) {
            return "Invalid Date";
        }

        // Get day of the month with suffix (1st, 2nd, 3rd, 4th...)
        int day = date.getDayOfMonth();
        String daySuffix = getDaySuffix(day);

        // Format the month and year
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM yyyy");
        String formattedDate = date.format(formatter);

        return day + daySuffix + " " + formattedDate;
    }

    private static String getDaySuffix(int day) {
        if (day >= 11 && day <= 13) {
            return "th"; // Special case for 11th, 12th, 13th
        }
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    }

}

