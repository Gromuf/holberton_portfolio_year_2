package com.petconnect.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.petconnect.api.dto.LoginRequest;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import com.petconnect.api.model.User;
import com.petconnect.api.service.AuthService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	
	@Autowired
	private AuthService authService;

	// Endpoint for user registration
	@PostMapping("/register")
	public ResponseEntity<?> register(@Valid @RequestBody User user) {
		try {
			User newUser = authService.register(user);
			return ResponseEntity.ok("User registered successfully ! ID: " + newUser.getId());
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	// Endpoint for user login
	@PostMapping("/login")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
		try {
			String jwt = authService.authenticateUser(loginRequest);
			Map<String, String> response = new HashMap<>();
			response.put("token", jwt);
			response.put("type", "Bearer");
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
		}
	}
}
