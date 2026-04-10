package com.petconnect.api.service;

import com.petconnect.api.model.User;
import com.petconnect.api.model.Pet;
import com.petconnect.api.repository.PetRepository;
import com.petconnect.api.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PetService {
	
	@Autowired // permet d'utiliser l'instance de PetRepository sans avoir à la créer manuellement
	private PetRepository petRepository;

	@Autowired
    private UserRepository userRepository;

	public List<Pet> findAllPets() {
		return petRepository.findAll();
	}

	// Méthode pour trouver les pets d'un utilisateur par son email
	public List<Pet> findPetsByOwnerEmail(String email) {
		return petRepository.findByOwner_Email(email);
	}

	public Pet savePetWithCurrentEmail(Pet pet, String email) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        pet.setOwner(owner); // On injecte l'utilisateur trouvé dans l'objet Pet
        return petRepository.save(pet);
    }
}
