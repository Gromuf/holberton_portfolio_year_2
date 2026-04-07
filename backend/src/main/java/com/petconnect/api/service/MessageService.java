package com.petconnect.api.service;

import com.petconnect.api.model.Message;
import com.petconnect.api.model.Pet;
import com.petconnect.api.repository.MessageRepository;
import com.petconnect.api.repository.FriendshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MessageService {

	@Autowired
	private MessageRepository messageRepository;

	@Autowired
	private FriendshipRepository friendshipRepository;

	// Envoie un message d'un animal à un autre, en vérifiant qu'ils sont amis
	public Message sendMessage(Message message) {
		Pet sender = message.getSenderPet();
		Pet receiver = message.getReceiverPet();

		// Vérifie si les deux animaux sont amis
		boolean areFriends = friendshipRepository.existsByPet1AndPet2AndStatus(sender, receiver, "ACCEPTED") ||
				friendshipRepository.existsByPet1AndPet2AndStatus(receiver, sender, "ACCEPTED");

		if (!areFriends) {
			throw new RuntimeException("Forbidden: Pets must be friends to send messages");
		}

		return messageRepository.save(message);
	}

	// Récupère l'historique complet des messages entre deux animaux
	public List<Message> getChatHistory(Pet pet1, Pet pet2) {
		return messageRepository.findBySenderPetAndReceiverPetOrSenderPetAndReceiverPetOrderBySentAtAsc(pet1, pet2,
				pet2, pet1);
	}
}
