package com.petconnect.api.service;

import com.petconnect.api.model.Message;
import com.petconnect.api.model.Pet;
import com.petconnect.api.model.User;
import com.petconnect.api.repository.PetRepository;
import com.petconnect.api.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@Transactional
public class MessageServiceTest {

	@Autowired
	private MessageService messageService;

	@Autowired
	private PetRepository petRepository;

	@Autowired
	private UserRepository userRepository;

	@Test
	void shouldThrowExceptionWhenPetsAreNotFriends() {
		User owner = new User();
		owner.setName("owner1");
		owner.setEmail("owner1@test.com");
		owner.setPassword("pass123");
		userRepository.save(owner);

		Pet p1 = new Pet();
		p1.setName("P1");
		p1.setSpecies("Dog");
		p1.setOwner(owner);
		petRepository.save(p1);

		Pet p2 = new Pet();
		p2.setName("P2");
		p2.setSpecies("Cat");
		p2.setOwner(owner);
		petRepository.save(p2);

		Message msg = new Message();
		msg.setContent("Ceci va échouer");
		msg.setSenderPet(p1);
		msg.setReceiverPet(p2);

		// Doit lever une exception car aucune amitié n'a été créée
		assertThrows(RuntimeException.class, () -> {
			messageService.sendMessage(msg);
		});
	}
}