package com.petconnect.api.controller;

import com.petconnect.api.model.User;
import com.petconnect.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@GetMapping
	public List<User> getAllUsers() {
		return userService.findAllUsers();
	}

	@PostMapping
	public User createUser(@Valid @RequestBody User user) {
		return userService.saveUser(user);
	}

	@GetMapping("/{id}")
	public ResponseEntity<User> getUserById(@PathVariable Long id) {
		User user = userService.findById(id);
		if (user == null) {
			return ResponseEntity.notFound().build(); // Return 404 if user not found
		}
		return ResponseEntity.ok(user); // Return 200 with user data if found
	}
}
