package com.petconnect.api.controller;

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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
public class UserControllerTest {

	private MockMvc mockMvc;

	@Autowired
	private WebApplicationContext webApplicationContext;

	@BeforeEach
	public void setup() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
	}

	@Test
	void testCreateUser() throws Exception {
		String userJson = """
				{
				  "name": "Louis",
				  "email": "controller-test@test.com",
				  "password": "pass123"
				}
				""";

		mockMvc.perform(post("/api/users")
				.contentType(MediaType.APPLICATION_JSON)
				.content(userJson))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Louis"))
				.andExpect(jsonPath("$.email").value("controller-test@test.com"));
	}

	@Test
	void testGetAllUsers() throws Exception {
		mockMvc.perform(get("/api/users"))
				.andExpect(status().isOk());
	}

	@Test
	void testCreateUserWithInvalidData() throws Exception {
		String invalidUserJson = """
				{
				"name": "",
				"email": "pas-un-email",
				"password": "123"
				}
				""";

		mockMvc.perform(post("/api/users")
				.contentType(MediaType.APPLICATION_JSON)
				.content(invalidUserJson))
				.andExpect(status().isBadRequest()) // Vérifie le code 400
				.andExpect(jsonPath("$.name").value("Name is required"))
				.andExpect(jsonPath("$.password").value("Password must be at least 6 characters long"));
	}

	@Test
	void testCreateDuplicateUserEmail() throws Exception {
		String userJson = """
				{
				"name": "Louis",
				"email": "unique@test.com",
				"password": "password123"
				}
				""";

		// Premier enregistrement : OK
		mockMvc.perform(post("/api/users")
				.contentType(MediaType.APPLICATION_JSON)
				.content(userJson))
				.andExpect(status().isOk());

		// Deuxième enregistrement avec le même email : Doit échouer
		mockMvc.perform(post("/api/users")
				.contentType(MediaType.APPLICATION_JSON)
				.content(userJson))
				.andExpect(status().isBadRequest()); 
				// Note : Si tu n'as pas encore géré DataIntegrityViolationException 
				// dans ton ExceptionHandler, ce test pourrait renvoyer une 500. 
				// C'est un bon moyen de vérifier !
	}
}