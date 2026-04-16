package com.petconnect.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.petconnect.api.model.Friendship;
import com.petconnect.api.model.Pet;
import com.petconnect.api.model.User;
import com.petconnect.api.repository.FriendshipRepository;
import com.petconnect.api.repository.PetRepository;
import com.petconnect.api.repository.UserRepository;

@Service
public class PetService {
	
	@Autowired // permet d'utiliser l'instance de PetRepository sans avoir à la créer manuellement
	private PetRepository petRepository;

	@Autowired
    private UserRepository userRepository;

	@Autowired
	private FriendshipRepository friendshipRepository;

	public List<Pet> findAllPets() {
		return petRepository.findAll();
	}

	// Méthode pour trouver les pets d'un utilisateur par son email
	public List<Pet> findPetsByOwnerEmail(String email) {
		return petRepository.findByOwner_Email(email);
	}

	// Méthode pour sauvegarder un pet en utilisant l'email de l'utilisateur actuel
	public Pet savePetWithCurrentEmail(Pet pet, String email) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        pet.setOwner(owner);
        return petRepository.save(pet);
    }

	// Méthode pour supprimer un pet en vérifiant que l'utilisateur actuel est le propriétaire
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
}
