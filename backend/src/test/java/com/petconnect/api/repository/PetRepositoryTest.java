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
@Transactional
public class PetRepositoryTest {

	@Autowired
	private PetRepository petRepository;

	@Autowired
	private UserRepository userRepository;

	@Test
	void shouldFindPetsBySpecies() {
		// 1. Setup : On a besoin d'un user pour la FK
		User owner = new User();
		owner.setName("Proprio");
		owner.setEmail("proprio@test.com");
		userRepository.save(owner);

		// 2. Création de deux chiens
		Pet dog1 = new Pet();
		dog1.setName("Koziz");
		dog1.setSpecies("Chien");
		dog1.setOwner(owner);

		Pet dog2 = new Pet();
		dog2.setName("Rex");
		dog2.setSpecies("Chien");
		dog2.setOwner(owner);

		petRepository.saveAll(List.of(dog1, dog2));

		// 3. Test de récupération
		List<Pet> dogs = petRepository.findAll();

		assertThat(dogs).hasSize(2);
		assertThat(dogs).extracting(Pet::getName).containsExactlyInAnyOrder("Koziz", "Rex");
	}
}