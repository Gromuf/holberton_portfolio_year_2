package com.petconnect.api.security;

import com.petconnect.api.model.User;
import com.petconnect.api.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional // Nettoie la base après chaque test
public class UserDetailsServiceImplTest {

	@Autowired
	private UserDetailsServiceImpl userDetailsService;

	@Autowired
	private UserRepository userRepository;

	@Test
	void shouldLoadUserByUsernameWhenUserExists() {
		// 1. Arrange : On prépare un utilisateur en base
		User user = new User();
		user.setEmail("auth-test@example.com");
		user.setPassword("hashed_password");
		user.setName("Auth Tester");
		userRepository.save(user);

		// 2. Act : On demande au service de le charger
		UserDetails result = userDetailsService.loadUserByUsername("auth-test@example.com");

		// 3. Assert : On vérifie que c'est le bon
		assertNotNull(result);
		assertEquals("auth-test@example.com", result.getUsername());
	}

	@Test
	void shouldThrowExceptionWhenUserDoesNotExist() {
		// On vérifie que le service lance bien l'exception si l'email n'existe pas
		assertThrows(UsernameNotFoundException.class, () -> {
			userDetailsService.loadUserByUsername("non-existent@example.com");
		});
	}
}