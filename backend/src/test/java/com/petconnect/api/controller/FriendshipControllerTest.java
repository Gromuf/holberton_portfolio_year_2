package com.petconnect.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule; // <--- Import nécessaire
import com.petconnect.api.model.Friendship;
import com.petconnect.api.model.Pet;
import com.petconnect.api.model.User;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

@SpringBootTest
@Transactional
public class FriendshipControllerTest {

	private MockMvc mockMvc;
	private ObjectMapper objectMapper;

	@Autowired
	private WebApplicationContext context;

	@Autowired
	private PetRepository petRepository;

	@Autowired
	private UserRepository userRepository;

	@BeforeEach
	public void setup() {
		// Initialisation avec le support des dates Java 8
		this.objectMapper = new ObjectMapper();
		this.objectMapper.registerModule(new JavaTimeModule()); // <--- C'est CETTE ligne qui manquait

		this.mockMvc = MockMvcBuilders
				.webAppContextSetup(context)
				.apply(springSecurity())
				.build();
	}

	@Test
	@WithMockUser
	void shouldReturnOkWhenRequestingFriendship() throws Exception {
		// 1. Setup des données
		User owner = new User();
		owner.setName("user_api");
		owner.setEmail("api@test.com");
		owner.setPassword("password123");
		userRepository.save(owner);

		Pet p1 = new Pet();
		p1.setName("Rex");
		p1.setSpecies("Dog");
		p1.setOwner(owner);
		petRepository.save(p1);

		Pet p2 = new Pet();
		p2.setName("Miaou");
		p2.setSpecies("Cat");
		p2.setOwner(owner);
		petRepository.save(p2);

		// 2. Préparation de la requête
		Friendship friendshipRequest = new Friendship();
		friendshipRequest.setPet1(p1);
		friendshipRequest.setPet2(p2);

		// 3. Exécution
		mockMvc.perform(post("/api/friendships/request")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(friendshipRequest)))
				.andExpect(status().isOk());
	}
}