package com.petconnect.api.repository;

import com.petconnect.api.model.Friendship;
import com.petconnect.api.model.Pet;
import com.petconnect.api.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
public class FriendshipRepositoryTest {

	@Autowired
	private FriendshipRepository friendshipRepository;

	@Autowired
	private PetRepository petRepository;

	@Autowired
	private UserRepository userRepository;

	@Test
	void shouldCheckIfFriendshipExistsByStatus() {
		// 1. Setup : Owner + 2 Pets
		User owner = new User();
		owner.setName("owner_friend");
		owner.setEmail("friend@test.com");
		owner.setPassword("pass123");
		userRepository.save(owner);

		Pet p1 = new Pet();
		p1.setName("Rex");
		p1.setSpecies("Dog");
		p1.setOwner(owner);
		petRepository.save(p1);

		Pet p2 = new Pet();
		p2.setName("Koziz");
		p2.setSpecies("Cat");
		p2.setOwner(owner);
		petRepository.save(p2);

		// 2. Créer une amitié ACCEPTED
		Friendship friendship = new Friendship();
		friendship.setPet1(p1);
		friendship.setPet2(p2);
		friendship.setStatus("ACCEPTED");
		friendshipRepository.save(friendship);

		// 3. Test de la méthode du repo
		boolean exists = friendshipRepository.existsByPet1AndPet2AndStatus(p1, p2, "ACCEPTED");

		assertThat(exists).isTrue();
	}
}