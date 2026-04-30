package com.petconnect.api.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.petconnect.api.model.Pet;
import com.petconnect.api.repository.PetRepository;
import com.petconnect.api.service.ImageService;
import com.petconnect.api.service.PetService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pets")
public class PetController {

	@Autowired
	private PetService petService;

	@Autowired
	private ImageService imageService;

	@Autowired
	private PetRepository petRepository;

	// Endpoint pour récupérer les animaux de l'utilisateur actuellement connecté
	@GetMapping
	public List<Pet> getMyPets() {
		String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
		return petService.findPetsByOwnerEmail(currentUserEmail);
	}

	@GetMapping("/all") // Endpoint pour récupérer tous les animaux
	public List<Pet> getAllPets() {
		return petService.findAllPets();
	}

	@GetMapping("/owner/{ownerId}") // Endpoint pour récupérer les animaux d'un propriétaire spécifique
    public List<Pet> getPetsByOwner(@PathVariable Long ownerId) {
        return petRepository.findByOwnerId(ownerId);
    }

	@PostMapping // Endpoint pour créer un nouvel animal
	public Pet createPet(@Valid @RequestBody Pet pet) {

		String currrentUserEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
		return petService.savePetWithCurrentEmail(pet, currrentUserEmail);
	}

	@PutMapping("/{id}") 
	public Pet updatePet(@PathVariable Long id, @Valid @RequestBody Pet petDetails) {
		String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
		
        Pet existingPet = petRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Pet not found"));

		// Vérification de sécurité : seul le propriétaire peut modifier
		if (!existingPet.getOwner().getEmail().equals(currentUserEmail)) {
			throw new RuntimeException("You are not authorized to update this pet");
		}

		// Mise à jour des champs autorisés
		existingPet.setName(petDetails.getName());
		existingPet.setSpecies(petDetails.getSpecies());
		existingPet.setAge(petDetails.getAge());
		existingPet.setBio(petDetails.getBio());
		existingPet.setWalking(petDetails.isWalking());

		return petRepository.save(existingPet);
	}

	@PostMapping("/{id}/upload-image") // Endpoint pour uploader une image pour un animal spécifique
	public Pet uploadPetImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
		Pet pet = petRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Pet not found"));
		String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
		if (!pet.getOwner().getEmail().equals(currentUserEmail)) {
			throw new RuntimeException("You are not authorized to update this pet's photo");
		}
		String url = imageService.uploadImage(file);
		pet.setImageUrl(url);
		return petRepository.save(pet);
	}

	@DeleteMapping("/{id}") // Endpoint pour supprimer un animal
	public void deletePet(@PathVariable Long id) {
		String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
		Pet pet = petRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Pet not found"));
		
		if (!pet.getOwner().getEmail().equals(currentUserEmail)) {
			throw new RuntimeException("Not authorized to delete this pet");
		}
		petRepository.delete(pet);
	}
}