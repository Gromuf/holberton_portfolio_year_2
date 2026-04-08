package com.petconnect.api.controller;

import com.petconnect.api.model.User;
import com.petconnect.api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
public class PetControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    public void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();
        userRepository.deleteAll();
    }

    @Test
    @WithMockUser // AJOUT : Nécessaire pour éviter la 403
    void testGetAllPets() throws Exception {
        mockMvc.perform(get("/api/pets"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "louis@test.com")
    void testCreatePetWithExistingUser() throws Exception {
        User tempUser = new User();
        tempUser.setName("Louis");
        tempUser.setEmail("louis@test.com");
        tempUser.setPassword("pass123");
        userRepository.save(tempUser);

        String jsonRequest = """
                {
                  "name": "Koziz",
                  "species": "Chien",
                  "isWalking": true
                }
                """;

        mockMvc.perform(post("/api/pets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
                .andExpect(status().isOk());
    }
}