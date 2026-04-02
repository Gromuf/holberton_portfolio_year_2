package com.petconnect.api.controller;

import com.petconnect.api.model.User;
import com.petconnect.api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

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
	private UserRepository userRepository; // Injecté pour créer l'owner avant le test

	@BeforeEach
	public void setup() {
		// Configuration manuelle de MockMvc
		this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
		// On nettoie la base avant chaque test pour éviter les conflits d'ID
		userRepository.deleteAll();
	}

	@Test
	void testGetAllPets() throws Exception {
		mockMvc.perform(get("/api/pets"))
				.andExpect(status().isOk());
	}

	@Test
	void testCreatePetWithExistingUser() throws Exception {
		// 1. Créer un utilisateur réel dans la base H2 de test
		User tempUser = new User();
		tempUser.setName("Louis");
		tempUser.setEmail("louis@test.com");
		tempUser.setPassword("pass123");
		User savedUser = userRepository.save(tempUser);

		// On récupère l'ID généré (ce sera normalement 1, mais on utilise
		// savedUser.getId() par sécurité)
		Long userId = savedUser.getId();

		// 2. Préparer le JSON avec l'ID de l'utilisateur qu'on vient de créer
		String jsonRequest = """
				{
				  "name": "Koziz",
				  "species": "Chien",
				  "isWalking": true,
				  "owner": { "id": %d }
				}
				""".formatted(userId);

		// 3. Envoyer la requête POST
		mockMvc.perform(post("/api/pets")
				.contentType(MediaType.APPLICATION_JSON)
				.content(jsonRequest))
				.andExpect(status().isOk());
	}
}