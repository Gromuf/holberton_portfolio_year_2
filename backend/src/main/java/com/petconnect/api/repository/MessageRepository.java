package com.petconnect.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import com.petconnect.api.model.Message;
import com.petconnect.api.model.Pet;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

	// Find all messages between two pets, ordered by sentAt ascending
	List<Message> findBySenderPetAndReceiverPetOrderBySentAtAsc(Pet sender, Pet receiver);

	// Find all messages received by a pet, ordered by sentAt descending
	List<Message> findByReceiverPetOrderBySentAtDesc(Pet receiver);

	/**
     * Récupère l'historique complet (A -> B ET B -> A).
     * Spring génère une requête SQL avec un OR pour croiser les expéditeurs et destinataires.
     * Note : Pour l'utiliser, on passe souvent les mêmes animaux mais inversés :
     * repository.findBy...(rex, koziz, koziz, rex);
     */
	List<Message> findBySenderPetAndReceiverPetOrSenderPetAndReceiverPetOrderBySentAtAsc(Pet sender1, Pet receiver1, Pet sender2, Pet receiver2);

	// Marque tous les messages reçus par un pet comme lus
	@Query(value = "SELECT EXISTS(SELECT 1 FROM messages WHERE receiver_pet_id IN :petIds AND is_read = false)", nativeQuery = true)
	boolean hasUnreadMessages(@Param("petIds") List<Long> petIds);

	// Optionnel : Récupérer les messages non lus entre deux pets
	List<Message> findBySenderPetIdAndReceiverPetIdAndIsReadFalse(Long senderId, Long receiverId);

	// Supprimer tous les messages entre deux pets (pour la suppression d'amitié)
	@Modifying
	@Transactional
	void deleteBySenderPetIdOrReceiverPetId(Long senderPetId, Long receiverPetId);
}