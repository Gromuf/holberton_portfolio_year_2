package com.petconnect.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.petconnect.api.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
	// Method to find a user by email
	Optional<User> findByEmail(String email);
	boolean existsByEmail(String email);
}
