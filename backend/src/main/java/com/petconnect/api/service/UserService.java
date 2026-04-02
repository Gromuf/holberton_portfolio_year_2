package com.petconnect.api.service;

import com.petconnect.api.model.User;
import com.petconnect.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;

	public List<User> findAllUsers() {
		return userRepository.findAll();
	}

	public User saveUser(User user) {
		return userRepository.save(user);
	}

	public User findById(Long id) { // Return null if user not found
		return userRepository.findById(id).orElse(null);
	}

}
