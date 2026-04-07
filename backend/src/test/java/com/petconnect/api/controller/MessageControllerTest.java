package com.petconnect.api.controller;

import com.petconnect.api.model.Pet;
import com.petconnect.api.model.User;
import com.petconnect.api.repository.PetRepository;
import com.petconnect.api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.transaction.annotation.Transactional;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

@SpringBootTest
@Transactional // Ajoute ça pour garder ta base propre
public class MessageControllerTest {

	private MockMvc mockMvc;

	@Autowired
	private WebApplicationContext context;

	@Autowired
	private PetRepository petRepository;

	@Autowired
	private UserRepository userRepository;

	@BeforeEach
	public void setup() {
		// On construit MockMvc manuellement à partir du contexte de l'app
		// Cela remplace l'annotation @AutoConfigureMockMvc qui posait problème
		this.mockMvc = MockMvcBuilders
				.webAppContextSetup(context)
				.apply(springSecurity())
				.build();
	}

	@Test
	@WithMockUser
	void shouldReturnStatusOkForHistory() throws Exception {
		// Création des données de test
		User owner = new User();
		owner.setName("controllerUser");
		owner.setEmail("c@test.com");
		owner.setPassword("pass123");
		userRepository.save(owner);

		Pet rex = new Pet();
		rex.setName("Rex");
		rex.setSpecies("Dog");
		rex.setOwner(owner);
		petRepository.save(rex);

		Pet miaou = new Pet();
		miaou.setName("Miaou");
		miaou.setSpecies("Cat");
		miaou.setOwner(owner);
		petRepository.save(miaou);

		// Test de l'endpoint
		mockMvc.perform(get("/api/messages/history")
				.param("pet1Id", rex.getId().toString())
				.param("pet2Id", miaou.getId().toString()))
				.andExpect(status().isOk());
	}
}