package com.petconnect.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.petconnect.api.dto.LoginRequest;
import com.petconnect.api.model.User;
import com.petconnect.api.repository.UserRepository;
import com.petconnect.api.security.JwtUtils;

@Service
public class AuthService {
	
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtUtils jwtUtils;

	// Register a new user and return the saved user object
	public User register (User user) {
		if (userRepository.existsByEmail(user.getEmail())) {
			throw new RuntimeException("Email already in use");
		}
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepository.save(user);
	}

	// Authenticate the user and return a JWT token if successful
	public String authenticateUser(LoginRequest loginRequest) {
		Authentication authentication = authenticationManager.authenticate(
			new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password())
		);
		SecurityContextHolder.getContext().setAuthentication(authentication);
		return jwtUtils.generateJwtToken(authentication);
	}
}
