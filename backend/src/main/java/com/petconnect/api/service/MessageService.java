package com.petconnect.api.service;

import java.time.LocalDateTime;
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

    /**
     * Envoie un message d'un animal à un autre.
     * Correction : On charge les entités complètes pour éviter les conflits de session Hibernate.
     */
    @Transactional
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

        // 4. Vérifier si les deux animaux sont amis (statut ACCEPTED)
        boolean areFriends = friendshipRepository.existsByPet1AndPet2AndStatus(sender, receiver, "ACCEPTED") ||
                friendshipRepository.existsByPet1AndPet2AndStatus(receiver, sender, "ACCEPTED");

        if (!areFriends) {
            throw new RuntimeException("Forbidden: Pets must be friends to send messages");
        }

        // 5. PRÉPARATION DE L'OBJET : On réinjecte les entités gérées par JPA
        message.setSenderPet(sender);
        message.setReceiverPet(receiver);
        
        // Initialisation des champs obligatoires si absents
        if (message.getSentAt() == null) {
            message.setSentAt(LocalDateTime.now());
        }
        if (message.getIsRead() == null) {
            message.setIsRead(false);
        }

        // 6. Sauvegarde
        return messageRepository.save(message);
    }

    // Récupère l'historique complet des messages entre deux animaux
    public List<Message> getChatHistory(Pet pet1, Pet pet2) {
        return messageRepository.findBySenderPetAndReceiverPetOrSenderPetAndReceiverPetOrderBySentAtAsc(
                pet1, pet2, pet2, pet1);
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
        Pet sender = petRepository.findById(senderId).orElse(null);
        Pet receiver = petRepository.findById(receiverId).orElse(null);
        
        if (sender != null && receiver != null) {
            List<Message> unreadMessages = messageRepository.findBySenderPetAndReceiverPetOrderBySentAtAsc(sender, receiver)
                    .stream()
                    .filter(m -> !m.getIsRead())
                    .toList();
            
            for (Message m : unreadMessages) {
                m.setIsRead(true);
            }
            messageRepository.saveAll(unreadMessages);
        }
    }
}