package com.petconnect.api.service;

import com.petconnect.api.model.Pet;
import com.petconnect.api.repository.PetRepository;
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

	@InjectMocks
	private PetService petService; // On injecte le faux repo dans le vrai service

	@Test
	public void testSavePet() {
		// 1. Préparation (Given)
		Pet pet = new Pet();
		pet.setName("Koziz");

		// On dit à Mockito : "Quand on appelle save, renvoie le chien avec l'ID 1"
		when(petRepository.save(any(Pet.class))).thenAnswer(invocation -> {
			Pet p = invocation.getArgument(0);
			p.setId(1L);
			return p;
		});

		// 2. Exécution (When)
		Pet savedPet = petService.savePet(pet);

		// 3. Vérification (Then)
		assertNotNull(savedPet);
		assertEquals(1L, savedPet.getId());
		assertEquals("Koziz", savedPet.getName());
		verify(petRepository, times(1)).save(pet); // On vérifie que la BDD a bien été appelée 1 fois
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