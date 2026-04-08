package com.petconnect.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

// DTO for login request
public record LoginRequest(
	@NotBlank @Email String email,
	@NotBlank String password
){}