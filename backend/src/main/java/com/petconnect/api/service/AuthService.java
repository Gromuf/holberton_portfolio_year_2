package com.petconnect.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.petconnect.api.model.User;
import com.petconnect.api.repository.UserRepository;

@Service
public class AuthService {
	
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public User register (User user) {
		if (userRepository.existsByEmail(user.getEmail())) {
			throw new RuntimeException("Email already in use");
		}
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepository.save(user);
	}
}
