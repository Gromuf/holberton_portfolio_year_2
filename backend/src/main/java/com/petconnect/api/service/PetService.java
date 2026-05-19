package com.petconnect.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.petconnect.api.model.Friendship;
import com.petconnect.api.model.Pet;
import com.petconnect.api.model.User;
import com.petconnect.api.model.Walk;
import com.petconnect.api.repository.FriendshipRepository;
import com.petconnect.api.repository.MessageRepository;
import com.petconnect.api.repository.PetRepository;
import com.petconnect.api.repository.UserRepository;
import com.petconnect.api.repository.WalkInvitationRepository;
import com.petconnect.api.repository.WalkMessageRepository;
import com.petconnect.api.repository.WalkRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
public class PetService {
	
	@Autowired
	private PetRepository petRepository;

	@Autowired
    private UserRepository userRepository;

	@Autowired
	private FriendshipRepository friendshipRepository;

	@Autowired
	private WalkRepository walkRepository;

	@Autowired
	private WalkInvitationRepository walkInvitationRepository;

	@Autowired
	private WalkMessageRepository walkMessageRepository;

	@Autowired
	private MessageRepository messageRepository;

	@PersistenceContext
	private EntityManager entityManager;

	@Autowired
	private WalkService walkService;

	public List<Pet> findAllPets() {
		return petRepository.findAll();
	}

	public List<Pet> findPetsByOwnerEmail(String email) {
		return petRepository.findByOwner_Email(email);
	}

	public Pet savePetWithCurrentEmail(Pet pet, String email) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        pet.setOwner(owner);
        return petRepository.save(pet);
    }

	@Transactional
	public void deletePet(Long petId, String currentUserEmail) {
		Pet pet = petRepository.findById(petId)
				.orElseThrow(() -> new RuntimeException("Pet not found"));

		if (!pet.getOwner().getEmail().equals(currentUserEmail)) {
			throw new RuntimeException("Forbidden");
		}

		// =========================================================================
		// ETAPE 1 : PURGE DE LA MESSAGERIE COMPLÈTE (CHATS CLASSIQUES)
		// =========================================================================
		try {
			messageRepository.deleteBySenderPetIdOrReceiverPetId(petId, petId);
			messageRepository.flush();
		} catch (Exception e) {
			System.err.println("Aucun message classique nettoyé : " + e.getMessage());
		}

		// =========================================================================
		// ETAPE 2 : PURGE DU CYCLE DE VIE DES BALADES (EN COURS OU HISTORIQUE)
		// =========================================================================
		
		// A. On efface tous les messages éphémères envoyés par ce chien au cours de sa vie
		try {
			walkMessageRepository.deleteBySenderId(petId);
			walkMessageRepository.flush();
		} catch (Exception e) {
			System.err.println("Aucun message éphémère envoyé à nettoyer.");
		}

		// B. Si ce chien est l'organisateur de balades, on doit d'abord raser leurs dépendances internes
		try {
			List<Walk> organizedWalks = walkRepository.findAll().stream()
					.filter(w -> w.getOrganizer() != null && w.getOrganizer().getId().equals(petId))
					.toList();

			for (Walk walk : organizedWalks) {
				// 1. Supprime tout le chat éphémère de cette balade
				walkMessageRepository.deleteByWalkId(walk.getId());
				walkMessageRepository.flush();
				
				// 2. Supprime toutes les invitations destinées aux copains pour cette balade
				walkInvitationRepository.deleteByWalkId(walk.getId());
				walkInvitationRepository.flush();
			}

			// 3. Enfin, on supprime la coquille vide des balades qu'il a créées
			walkRepository.deleteByOrganizerId(petId);
			walkRepository.flush();
		} catch (Exception e) {
			System.err.println("Erreur nettoyage balades de l'organisateur : " + e.getMessage());
		}

		// C. On efface toutes les invitations que l'animal a reçues ou acceptées des autres
		try {
			walkInvitationRepository.deleteByPetId(petId);
			walkInvitationRepository.flush();
		} catch (Exception e) {
			System.err.println("Aucune invitation reçue à nettoyer.");
		}

		// =========================================================================
		// ETAPE 3 : PURGE DES RELATIONS D'AMITIÉ
		// =========================================================================
		try {
			friendshipRepository.deleteByPet1OrPet2(pet, pet);
			friendshipRepository.flush();
		} catch (Exception e) {
			System.err.println("Aucune relation d'amitié à nettoyer.");
		}

		// =========================================================================
		// ETAPE 4 : PURGE DE LA SESSION CACHE POUR CRÉER LA SUPPRESSION MAÎTRESSE
		// =========================================================================
		if (pet.getFriendshipsAsPet1() != null) pet.getFriendshipsAsPet1().clear();
		if (pet.getFriendshipsAsPet2() != null) pet.getFriendshipsAsPet2().clear();

		entityManager.flush();
		entityManager.clear(); // Supprime l'état fantôme gardé en mémoire Java

		// Extraction de l'instance finale isolée et désengagée de tout lien
		Pet managedPet = petRepository.findById(petId)
				.orElseThrow(() -> new RuntimeException("Pet introuvable lors de la suppression finale"));
		
		petRepository.delete(managedPet);
	}

	public List<Pet> getFriendsInWalk(Long myPetId) {
		return List.of(); 
	}

	public List<Pet> getFriends(Long petId) {
		if (petId == null || petId <= 0) {
			return List.of();
		}

		try {
			Pet pet = petRepository.findById(petId)
					.orElseThrow(() -> new RuntimeException("Pet not found"));
			
			List<Friendship> friendships = friendshipRepository.findByPet1OrPet2(pet, pet)
					.stream()
					.filter(f -> "ACCEPTED".equals(f.getStatus()))
					.toList();

			List<Pet> friends = friendships.stream()
					.map(f -> f.getPet1().getId().equals(petId) ? f.getPet2() : f.getPet1())
					.toList();
			
			for (Pet friend : friends) {
				boolean inWalk = walkService.getActiveWalk(friend.getId()).isPresent();
				friend.setIsWalking(inWalk);
			}
			return friends;
		} catch (Exception e) {
			return List.of();
		}
	}
}