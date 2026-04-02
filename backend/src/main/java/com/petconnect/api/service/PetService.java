package com.petconnect.api.service;

import com.petconnect.api.model.Pet;
import com.petconnect.api.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PetService {
	
	@Autowired // permet d'utiliser l'instance de PetRepository sans avoir à la créer manuellement
	private PetRepository petRepository;

	public List<Pet> findAllPets() {
		return petRepository.findAll();
	}

	public Pet savePet(Pet pet) {
		// ajouter des conditions plus tard
		return petRepository.save(pet);
	}
}
