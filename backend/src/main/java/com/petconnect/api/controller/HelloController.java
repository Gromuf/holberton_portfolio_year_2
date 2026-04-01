package com.petconnect.api.controller;

import com.petconnect.api.model.Pet;
import com.petconnect.api.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class HelloController {

	@Autowired
	private PetRepository petRepository;

	@GetMapping("/api/hello")
	public String sayHello() {
		return "L'API PetConnect est en ligne ! 🐾";
	}

	@GetMapping("/pets")
	public List<Pet> getAllPets() {
		return petRepository.findAll();
	}
}