package com.petconnect.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

	@GetMapping("/api/hello")
	public String sayHello() {
		return "L'API PetConnect est en ligne ! 🐾";
	}
}