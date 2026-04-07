package com.petconnect.api.service;

import com.petconnect.api.model.Friendship;
import com.petconnect.api.model.Pet;
import com.petconnect.api.model.User;
import com.petconnect.api.repository.PetRepository;
import com.petconnect.api.repository.UserRepository; // Import à ajouter
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class FriendshipServiceTest {

	@Autowired
	private FriendshipService friendshipService;

	@Autowired
	private PetRepository petRepository;

	@Autowired
	private UserRepository userRepository; // Indispensable pour créer l'owner

	@Test
	void testSendAndAcceptFriendRequest() {
		// 1. Création du propriétaire obligatoire
		User owner = new User();
		owner.setName("serviceUser");
		owner.setEmail("service@test.com");
		owner.setPassword("password123");
		userRepository.save(owner);

		// 2. Création des animaux avec l'owner
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

		// 3. Envoyer la demande
		Friendship request = friendshipService.sendFriendRequest(p1, p2);
		assertNotNull(request.getId());
		assertEquals("PENDING", request.getStatus());

		// 4. Accepter la demande
		Friendship accepted = friendshipService.acceptFriendRequest(request.getId());
		assertEquals("ACCEPTED", accepted.getStatus());
	}
}