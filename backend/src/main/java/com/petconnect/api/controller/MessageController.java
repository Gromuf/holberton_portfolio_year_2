package com.petconnect.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.petconnect.api.model.Message;
import com.petconnect.api.model.Pet;
import com.petconnect.api.repository.PetRepository;
import com.petconnect.api.service.MessageService;

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

	// Endpoint pour vérifier les messages non lus
	@GetMapping("/has-unread")
	public boolean hasUnread() {
		String email = org.springframework.security.core.context.SecurityContextHolder
				.getContext().getAuthentication().getName();
		return messageService.checkUnreadMessages(email);
	}

	@PutMapping("/read")
	public void markAsRead(@RequestParam Long senderId, @RequestParam Long receiverId) {
		messageService.markAsRead(senderId, receiverId);
	}

}
