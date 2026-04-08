package com.petconnect.api.controller;

import com.petconnect.api.model.Pet;
import com.petconnect.api.repository.PetRepository;
import com.petconnect.api.service.PetService;
import com.petconnect.api.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/pets")
public class PetController {

	@Autowired
	private PetService petService;

	@Autowired
	private ImageService imageService;

	@Autowired
	private PetRepository petRepository;

	@GetMapping // Endpoint pour récupérer tous les animaux
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

	@PostMapping("/{id}/upload-image") // Endpoint pour uploader une image pour un animal spécifique
	public Pet uploadPetImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
		//Trouver l'animal
		Pet pet = petRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Pet not found"));
		// On récupère l'email de l'utilisateur actuellement connecté
		String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
		// On vérifie si l'utilisateur est bien le propriétaire
		if (!pet.getOwner().getEmail().equals(currentUserEmail)) {
			throw new RuntimeException("You are not authorized to update this pet's photo");
		}
		// Envoyer l'image à Cloudinary et récupérer l'URL
		String url = imageService.uploadImage(file);
		// Mettre à jour l'animal en base de données avec l'URL de l'image
		pet.setImageUrl(url);
		return petRepository.save(pet);
	}
}