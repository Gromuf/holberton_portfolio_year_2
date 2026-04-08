package com.petconnect.api.controller;

import com.petconnect.api.model.Message;
import com.petconnect.api.model.Pet;
import com.petconnect.api.repository.PetRepository;
import com.petconnect.api.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

	@Autowired
	private MessageService messageService;

	@Autowired
	private PetRepository petRepository;

	@PostMapping("/send")
	public Message sendMessage(@RequestBody Message message) {
		String email = org.springframework.security.core.context.SecurityContextHolder
				.getContext().getAuthentication().getName();
		
		return messageService.sendMessage(message, email);
	}

	@GetMapping("/history")
	public List<Message> getChatHistory(@RequestParam Long pet1Id, @RequestParam Long pet2Id) {
		Pet pet1 = petRepository.findById(pet1Id)
				.orElseThrow(() -> new RuntimeException("Pet 1 non trouvé"));
		Pet pet2 = petRepository.findById(pet2Id)
				.orElseThrow(() -> new RuntimeException("Pet 2 non trouvé"));

		return messageService.getChatHistory(pet1, pet2);
	}

}
