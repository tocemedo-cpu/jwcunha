package com.jwcunha.website;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import com.jwcunha.website.contact.ProposalRequestRepository;

import org.junit.jupiter.api.BeforeEach;

/** Runs against a real PostgreSQL (TEST_DB_URL); Flyway builds the schema, Hibernate only validates it. */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
abstract class IntegrationTestBase {

    static final String ADMIN_USER = "admin";
    static final String ADMIN_PASSWORD = "correct-horse-battery";

    @DynamicPropertySource
    static void adminProps(DynamicPropertyRegistry r) {
        r.add("app.admin.username", () -> ADMIN_USER);
        r.add("app.admin.password-hash", () -> new BCryptPasswordEncoder(4).encode(ADMIN_PASSWORD));
    }

    @Autowired
    MockMvc mvc;
    @Autowired
    ProposalRequestRepository repository;

    @BeforeEach
    void clean() {
        repository.deleteAll();
    }

    static String validJson() {
        return """
            {"fullName":"Ana Silva","company":"Example Energy Ltd","email":"Ana@Example.com",
             "phone":"+244 900 000 000","serviceArea":"FACILITY_MANAGEMENT","projectLocation":"Luanda",
             "message":"We need integrated facility management for an onshore base.","consent":true,
             "language":"en","website":""}""";
    }
}
