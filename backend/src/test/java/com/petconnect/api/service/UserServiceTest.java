package com.petconnect.api.service;

import com.petconnect.api.model.User;
import com.petconnect.api.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

	@Mock
	private UserRepository userRepository;

	@InjectMocks
	private UserService userService;

	@Test
	void testFindUserById_Success() {
		User user = new User();
		user.setId(1L);
		user.setName("Louis");

		when(userRepository.findById(1L)).thenReturn(Optional.of(user));

		User found = userService.findById(1L);

		assertNotNull(found);
		assertEquals("Louis", found.getName());
	}

	@Test
	void testFindUserById_NotFound() {
		when(userRepository.findById(99L)).thenReturn(Optional.empty());

		User found = userService.findById(99L);

		assertNull(found);
	}
}