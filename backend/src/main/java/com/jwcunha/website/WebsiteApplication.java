package com.jwcunha.website;

import java.util.Scanner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@ConfigurationPropertiesScan
@EnableAsync
@EnableScheduling
@EnableSpringDataWebSupport(pageSerializationMode = PageSerializationMode.VIA_DTO)
public class WebsiteApplication {

    public static void main(String[] args) {
        if (args.length > 0 && args[0].equals("hash-password")) {
            hashPassword(args);
            return;
        }
        SpringApplication.run(WebsiteApplication.class, args);
    }

    /** Utility: prints a bcrypt hash for ADMIN_PASSWORD_HASH. Reads stdin when no argument is given. */
    private static void hashPassword(String[] args) {
        String password;
        if (args.length > 1) {
            password = args[1];
        } else {
            try (Scanner in = new Scanner(System.in)) {
                password = in.hasNextLine() ? in.nextLine() : "";
            }
        }
        if (password.length() < 12) {
            System.err.println("Password must have at least 12 characters.");
            System.exit(1);
        }
        System.out.println(new BCryptPasswordEncoder(12).encode(password));
    }
}
