package com.petconnect.api.controller;

import com.petconnect.api.model.Pet;
import com.petconnect.api.model.User;
import com.petconnect.api.repository.FriendshipRepository;
import com.petconnect.api.repository.PetRepository;
import com.petconnect.api.repository.UserRepository;
import com.petconnect.api.service.ImageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
// NOUVEL IMPORT ICI
import org.springframework.test.context.bean.override.mockito.MockitoBean; 
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
public class PetImageIntegrationTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FriendshipRepository friendshipRepository;

    // CHANGEMENT D'ANNOTATION ICI
    @MockitoBean 
    private ImageService imageService;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity())
                .build();
        
        // Nettoyage complet
        friendshipRepository.deleteAllInBatch();
        petRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();
    }

    @Test
    @WithMockUser(username = "owner@test.com")
    void shouldUploadPetImageSuccessfully() throws Exception {
        User owner = new User();
        owner.setEmail("owner@test.com");
        owner.setName("Owner");
        owner.setPassword("password");
        userRepository.save(owner);

        Pet pet = new Pet();
        pet.setName("Rex");
        pet.setSpecies("Dog");
        pet.setOwner(owner);
        pet = petRepository.save(pet);

        MockMultipartFile file = new MockMultipartFile(
                "file", 
                "test.png", 
                "image/png", 
                "content".getBytes()
        );

        // Simulation du comportement du service
        Mockito.when(imageService.uploadImage(Mockito.any())).thenReturn("https://cloudinary.com/fake.jpg");

        mockMvc.perform(multipart("/api/pets/" + pet.getId() + "/upload-image")
                .file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.imageUrl").value("https://cloudinary.com/fake.jpg"));
    }

	@Test
    @WithMockUser(username = "hacker@test.com") // On simule un utilisateur différent
    void shouldFailWhenNotOwner() throws Exception {
        // 1. Créer le VRAI propriétaire et son animal
        User owner = new User();
        owner.setEmail("owner@test.com");
        owner.setName("Owner");
        owner.setPassword("password");
        userRepository.save(owner);

        Pet pet = new Pet();
        pet.setName("Rex");
        pet.setSpecies("Dog");
        pet.setOwner(owner);
        pet = petRepository.save(pet);

        // 2. Simuler un fichier
        MockMultipartFile file = new MockMultipartFile("file", "image.png", "image/png", "content".getBytes());

        // 3. Tenter l'upload avec le compte "hacker@test.com"
        mockMvc.perform(multipart("/api/pets/" + pet.getId() + "/upload-image")
                .file(file))
                .andExpect(status().isBadRequest());
    }
}