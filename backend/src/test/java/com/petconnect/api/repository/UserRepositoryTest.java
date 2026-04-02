package com.petconnect.api.repository;

import com.petconnect.api.model.Pet;
import com.petconnect.api.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional // Nettoie la base de données après chaque test automatiquement
public class UserRepositoryTest {

	@Autowired
	private UserRepository userRepository;

	@Test
	void shouldSaveUserWithPets() {
		// 1. Créer un utilisateur
		User louis = new User();
		louis.setEmail("louis@test.com");
		louis.setName("Louis");
		louis.setPassword("secure123");

		// 2. Créer un Pet et le lier à l'User
		Pet dog = new Pet();
		dog.setName("Rex");
		dog.setSpecies("Chien");
		dog.setOwner(louis);

		louis.setPets(List.of(dog));

		// 3. Sauvegarder
		User savedUser = userRepository.save(louis);

		// 4. Vérifications
		assertThat(savedUser.getId()).isNotNull();
		assertThat(savedUser.getPets()).hasSize(1);
		assertThat(savedUser.getPets().get(0).getName()).isEqualTo("Rex");
	}
}