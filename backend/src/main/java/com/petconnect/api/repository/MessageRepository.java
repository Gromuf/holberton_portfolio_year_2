package com.petconnect.api.repository;

import com.petconnect.api.model.Message;
import com.petconnect.api.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

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
}