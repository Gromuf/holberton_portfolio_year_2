package com.petconnect.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.petconnect.api.dto.UserDTO;
import com.petconnect.api.model.User;
import com.petconnect.api.repository.UserRepository;
import com.petconnect.api.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;
	private final UserRepository userRepository;

    @GetMapping("/profile/me")
	public ResponseEntity<UserDTO> getCurrentUser() {
		var authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 1. On vérifie que l'utilisateur est bien connecté avant d'aller plus loin
		if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		// 2. Maintenant on est sûr de pouvoir récupérer l'email sans faire planter le serveur
		String email = authentication.getName();
		
		return userRepository.findByEmail(email)
				.map(user -> new UserDTO(user.getId(), user.getName(), user.getEmail()))
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}
    
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
