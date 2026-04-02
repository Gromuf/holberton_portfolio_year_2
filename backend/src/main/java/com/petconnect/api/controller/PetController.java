package com.petconnect.api.controller;

import com.petconnect.api.model.Pet;
import com.petconnect.api.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
public class PetController {

	@Autowired
	private PetService petService;

	@GetMapping
	public List<Pet> getAllPets() {
		return petService.findAllPets();
	}

	@PostMapping
	public Pet createPet(@RequestBody Pet pet) {
		return petService.savePet(pet);
	}
}