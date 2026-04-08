package com.petconnect.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.petconnect.api.model.Friendship;
import com.petconnect.api.model.Pet;
import com.petconnect.api.model.User;
import com.petconnect.api.repository.FriendshipRepository; // AJOUTÉ
import com.petconnect.api.repository.PetRepository;
import com.petconnect.api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
public class FriendshipControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private FriendshipRepository friendshipRepository; // AJOUTÉ

    private ObjectMapper objectMapper; 

    @BeforeEach
    public void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();
        
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());

        // ORDRE CRITIQUE : D'abord les relations, puis les entités dépendantes
        friendshipRepository.deleteAll();
        petRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @WithMockUser(username = "service@test.com")
    void shouldReturnOkWhenRequestingFriendship() throws Exception {
        User owner = new User();
        owner.setEmail("service@test.com");
        owner.setName("User");
        owner.setPassword("pass123");
        userRepository.save(owner);

        Pet p1 = new Pet();
        p1.setName("Rex");
        p1.setSpecies("Dog");
        p1.setOwner(owner);
        p1 = petRepository.save(p1);

        Pet p2 = new Pet();
        p2.setName("Koziz");
        p2.setSpecies("Cat");
        p2.setOwner(owner);
        p2 = petRepository.save(p2);

        Pet reqPet1 = new Pet(); reqPet1.setId(p1.getId());
        Pet reqPet2 = new Pet(); reqPet2.setId(p2.getId());
        
        Friendship friendshipRequest = new Friendship();
        friendshipRequest.setPet1(reqPet1);
        friendshipRequest.setPet2(reqPet2);

        mockMvc.perform(post("/api/friendships/request")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(friendshipRequest)))
                .andExpect(status().isOk());
    }
}