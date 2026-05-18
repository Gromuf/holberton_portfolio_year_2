package com.petconnect.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.petconnect.api.model.Friendship;
import com.petconnect.api.model.InvitationStatus;
import com.petconnect.api.model.Pet;
import com.petconnect.api.model.User;
import com.petconnect.api.model.WalkStatus;
import com.petconnect.api.repository.FriendshipRepository;
import com.petconnect.api.repository.PetRepository;
import com.petconnect.api.repository.UserRepository;
import com.petconnect.api.repository.WalkRepository;

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
		List<Friendship> friendships = friendshipRepository.findByPet1OrPet2(pet, pet);
		if (!friendships.isEmpty()) {
			friendshipRepository.deleteAll(friendships);
			friendshipRepository.flush(); 
		}
		petRepository.delete(pet);
	}

	// --- LOGIQUE DE BALADE (WALK) ---

	/**
	 * TEMPORAIRE : Retourne une liste vide en attendant la nouvelle table Walks.
	 * (Remplace l'ancienne logique basée sur isWalking)
	 */
	public List<Pet> getFriendsInWalk(Long myPetId) {
		return List.of(); 
	}

	/**
	 * Logique interne pour récupérer la liste des objets Pet amis
	 */
	public List<Pet> getFriends(Long petId) {
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
			boolean inWalk = walkRepository.findActiveWalkByPetId(
				friend.getId(), 
				WalkStatus.IN_PROGRESS.name(),
				InvitationStatus.ACCEPTED.name()
			).isPresent();
			
			friend.setWalking(inWalk);
		}
		return friends;
	}
}