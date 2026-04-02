package com.petconnect.api.controller;

import com.petconnect.api.model.Pet;
import com.petconnect.api.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PetController {

	@Autowired
	private PetRepository petRepository;

	@GetMapping
	public List<Pet> getAllPets() {
		return petRepository.findAll();
	}

	@PostMapping
	public Pet createPet(@RequestBody Pet pet) {
		return petRepository.save(pet);
	}
}