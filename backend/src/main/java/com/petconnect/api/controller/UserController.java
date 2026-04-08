package com.petconnect.api.controller;

import com.petconnect.api.dto.UserDTO;
import com.petconnect.api.model.User;
import com.petconnect.api.repository.UserRepository;
import com.petconnect.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;
	private final UserRepository userRepository;

	@GetMapping // Endpoint pour récupérer tous les utilisateurs
	public List<UserDTO> getAllUsers() {
		return userService.findAllUsers().stream()
                .map(user -> new UserDTO(user.getId(), user.getName(), user.getEmail()))
                .toList();
	}

	@GetMapping("/search") // Endpoint pour rechercher des utilisateurs par nom ou email
    public List<UserDTO> searchUsers(@RequestParam String query) {
        return userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query)
                .stream()
                .map(user -> new UserDTO(user.getId(), user.getName(), user.getEmail()))
                .toList();
    }

	@GetMapping("/{id}") // Endpoint pour récupérer un utilisateur par son ID
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        User user = userService.findById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        UserDTO dto = new UserDTO(user.getId(), user.getName(), user.getEmail());
        return ResponseEntity.ok(dto);
    }
}
