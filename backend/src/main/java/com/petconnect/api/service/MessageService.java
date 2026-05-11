package com.petconnect.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.petconnect.api.model.Message;
import com.petconnect.api.model.Pet;
import com.petconnect.api.repository.FriendshipRepository;
import com.petconnect.api.repository.MessageRepository;
import com.petconnect.api.repository.PetRepository;

@Service
public class MessageService {

	@Autowired
	private MessageRepository messageRepository;

	@Autowired
	private FriendshipRepository friendshipRepository;

	@Autowired
	private PetRepository petRepository;

	// Envoie un message d'un animal à un autre, en vérifiant qu'ils sont amis
	public Message sendMessage(Message message, String currentUserEmail) {
		// 1. Charger l'objet complet de l'expéditeur (sender)
        Pet sender = petRepository.findById(message.getSenderPet().getId())
                .orElseThrow(() -> new RuntimeException("Sender pet not found"));
        
        // 2. Charger l'objet complet du destinataire (receiver)
        Pet receiver = petRepository.findById(message.getReceiverPet().getId())
                .orElseThrow(() -> new RuntimeException("Receiver pet not found"));

        // 3. SÉCURITÉ : L'utilisateur connecté possède-t-il l'animal expéditeur ?
        if (!sender.getOwner().getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("Forbidden: You are not the owner of the sender pet");
        }

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

	// Vérifie si l'utilisateur a des messages non lus
	public boolean checkUnreadMessages(String email) {
		List<Pet> myPets = petRepository.findByOwner_Email(email);
		List<Long> petIds = myPets.stream().map(Pet::getId).toList();
		if (petIds.isEmpty()) return false;
		return messageRepository.hasUnreadMessages(petIds);
	}

	@Transactional
	public void markAsRead(Long senderId, Long receiverId) {
		// On récupère tous les messages envoyés par le contact (sender) à mon animal (receiver) qui sont non lus
		List<Message> unread = messageRepository.findBySenderPetIdAndReceiverPetIdAndIsReadFalse(senderId, receiverId);
		
		if (!unread.isEmpty()) {
			unread.forEach(m -> m.setIsRead(true));
			messageRepository.saveAll(unread);
		}
	}
}
