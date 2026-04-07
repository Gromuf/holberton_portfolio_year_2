package com.petconnect.api.repository;

import com.petconnect.api.model.Message;
import com.petconnect.api.model.Pet;
import com.petconnect.api.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
public class MessageRepositoryTest {

	@Autowired
	private MessageRepository messageRepository;

	@Autowired
	private PetRepository petRepository;

	@Autowired
	private UserRepository userRepository;

	@Test
	void shouldFindFullConversationBetweenTwoPets() {
		// 1. Créer un Owner (obligatoire pour Pet)
		User owner = new User();
		owner.setName("testuser");
		owner.setEmail("test@petconnect.com");
		owner.setPassword("password");
		userRepository.save(owner);

		// 2. Créer les deux animaux
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

		// 3. Simuler un échange de messages
		Message m1 = new Message();
		m1.setContent("Salut Miaou");
		m1.setSenderPet(rex);
		m1.setReceiverPet(miaou);
		messageRepository.save(m1);

		Message m2 = new Message();
		m2.setContent("Coucou Rex");
		m2.setSenderPet(miaou);
		m2.setReceiverPet(rex);
		messageRepository.save(m2);

		// 4. Test de la méthode miroir
		List<Message> history = messageRepository
				.findBySenderPetAndReceiverPetOrSenderPetAndReceiverPetOrderBySentAtAsc(rex, miaou, miaou, rex);

		assertThat(history).hasSize(2);
		assertThat(history.get(0).getContent()).isEqualTo("Salut Miaou");
		assertThat(history.get(1).getContent()).isEqualTo("Coucou Rex");
	}
}