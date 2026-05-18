package com.petconnect.api.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.petconnect.api.model.Friendship;
import com.petconnect.api.model.Pet;
import com.petconnect.api.model.User;
import com.petconnect.api.model.WalkStatus;
import com.petconnect.api.model.InvitationStatus;
import com.petconnect.api.model.Walk;
import com.petconnect.api.model.WalkInvitation;
import com.petconnect.api.repository.FriendshipRepository;
import com.petconnect.api.repository.PetRepository;
import com.petconnect.api.repository.UserRepository;
import com.petconnect.api.repository.WalkRepository;
import com.petconnect.api.repository.WalkInvitationRepository;
import com.petconnect.api.repository.WalkMessageRepository;
import com.petconnect.api.repository.MessageRepository;

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

	@Autowired
	private WalkService walkService; // 👈 AJOUTÉ : On injecte WalkService pour profiter de son bouclier de sécurité

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

		// === 1. PURGE DE LA MESSAGERIE PRINCIPALE ===
		try {
			messageRepository.deleteBySenderPetIdOrReceiverPetId(petId, petId);
			messageRepository.flush();
		} catch (Exception e) {
			System.err.println("Erreur nettoyage messages principaux : " + e.getMessage());
		}

		// === 2. PURGE DES BALADES ET INVITATIONS ===
		try {
			List<WalkInvitation> allPetInvitations = walkInvitationRepository.findAll().stream()
					.filter(i -> i.getPet() != null && i.getPet().getId().equals(petId))
					.toList();
			if (!allPetInvitations.isEmpty()) {
				walkInvitationRepository.deleteAll(allPetInvitations);
				walkInvitationRepository.flush();
			}
		} catch (Exception e) {
			System.err.println("Aucune invitation à nettoyer.");
		}

		try {
			List<Walk> organizedWalks = walkRepository.findAll().stream()
					.filter(w -> w.getOrganizer() != null && w.getOrganizer().getId().equals(petId))
					.toList();

			for (Walk walk : organizedWalks) {
				walkMessageRepository.deleteByWalkId(walk.getId());
				
				List<WalkInvitation> walkInvits = walkInvitationRepository.findAll().stream()
						.filter(i -> i.getWalk() != null && i.getWalk().getId().equals(walk.getId()))
						.toList();
				walkInvitationRepository.deleteAll(walkInvits);
				walkInvitationRepository.flush();
				
				walkRepository.delete(walk);
			}
			walkRepository.flush();
		} catch (Exception e) {
			System.err.println("Aucune balade organisée à nettoyer.");
		}

		// === 3. PURGE DES RELATIONS D'AMITIÉ ===
		List<Friendship> friendships = friendshipRepository.findByPet1OrPet2(pet, pet);
		if (!friendships.isEmpty()) {
			friendshipRepository.deleteAll(friendships);
			friendshipRepository.flush(); 
		}

		// === 4. SUPPRESSION DE L'ANIMAL ===
		petRepository.delete(pet);
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
				// Requête native directe : si l'ami est organisateur d'une balade IN_PROGRESS, 
				// findActiveWalkByPetId le trouvera immédiatement, même s'il est tout seul !
				boolean inWalk = walkRepository.findActiveWalkByPetId(
					friend.getId(), 
					WalkStatus.IN_PROGRESS.name(),
					InvitationStatus.ACCEPTED.name()
				).isPresent();
				
				friend.setIsWalking(inWalk);
			}
			return friends;
		} catch (Exception e) {
			System.err.println("Erreur getFriends : " + e.getMessage());
			return List.of();
		}
	}
}