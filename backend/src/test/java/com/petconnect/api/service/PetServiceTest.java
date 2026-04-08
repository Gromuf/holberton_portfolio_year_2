package com.petconnect.api.service;

import com.petconnect.api.model.Pet;
import com.petconnect.api.repository.PetRepository;
import com.petconnect.api.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PetServiceTest {

	@Mock
	private PetRepository petRepository; // On simule la BDD

	@Mock
    private UserRepository userRepository;

	@InjectMocks
	private PetService petService; // On injecte le faux repo dans le vrai service

	@Test
	public void testSavePetWithEmail() {
		// 1. Préparation (Given)
		String email = "test@test.com";
		com.petconnect.api.model.User user = new com.petconnect.api.model.User();
		user.setEmail(email);

		Pet pet = new Pet();
		pet.setName("Koziz");

		// On simule la recherche de l'utilisateur
		when(userRepository.findByEmail(email)).thenReturn(java.util.Optional.of(user));

		// On simule la sauvegarde du pet
		when(petRepository.save(any(Pet.class))).thenAnswer(invocation -> {
			Pet p = invocation.getArgument(0);
			p.setId(1L);
			return p;
		});

		// 2. Exécution (When) - On appelle la méthode sécurisée
		Pet savedPet = petService.savePetWithCurrentEmail(pet, email);

		// 3. Vérification (Then)
		assertNotNull(savedPet);
		assertEquals(1L, savedPet.getId());
		assertEquals(email, savedPet.getOwner().getEmail()); // On vérifie que l'owner est bien lié
		verify(userRepository, times(1)).findByEmail(email);
		verify(petRepository, times(1)).save(pet);
	}
	@Test
	void testFindAllPets() {
		Pet p1 = new Pet();
		p1.setName("Koziz");
		Pet p2 = new Pet();
		p2.setName("Rex");

		when(petRepository.findAll()).thenReturn(java.util.List.of(p1, p2));

		java.util.List<Pet> result = petService.findAllPets();

		assertEquals(2, result.size());
		verify(petRepository, times(1)).findAll();
	}
}