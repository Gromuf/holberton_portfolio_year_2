package com.petconnect.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test") // Force l'utilisation de application-test.properties
class BackendApplicationTests {

    @Test
    void contextLoads() {
        // Si ce test passe, c'est que toute ta config (Security, JPA, Beans) est correcte
    }
}