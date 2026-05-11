package com.petconnect.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.petconnect.api.model.Pet;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {

	// Method to find pets by owner ID
	List<Pet> findByOwnerId(Long ownerId);

	// Method to find pets by owner email
	List<Pet> findByOwner_Email(String email);

	// Method to find pets that are currently walking
	List<Pet> findByIsWalkingTrue();
}
