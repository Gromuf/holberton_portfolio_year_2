package com.petconnect.api.repository;

import com.petconnect.api.model.Friendship;
import com.petconnect.api.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
	// Find all friendships where either pet1 or pet2 is the given pet
	List<Friendship> findByPet1OrPet2(Pet pet1, Pet pet2);

	// Check if a friendship already exists between two pets
	boolean existsByPet1AndPet2(Pet pet1, Pet pet2);

	// Check if a friendship with a specific status already exists between two pets
	boolean existsByPet1AndPet2AndStatus(Pet pet1, Pet pet2, String status);
}