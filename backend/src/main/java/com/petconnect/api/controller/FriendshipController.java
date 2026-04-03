package com.petconnect.api.controller;

import com.petconnect.api.model.Friendship;
import com.petconnect.api.model.Pet;
import com.petconnect.api.service.FriendshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/friendships")
public class FriendshipController {

	@Autowired
	private FriendshipService friendshipService;

	// Post : create a friend request
	@PostMapping("/request")
	public Friendship createRequest(@RequestBody Friendship request) {
		return friendshipService.sendFriendRequest(request.getPet1(), request.getPet2());
	}
 
	// Put : accept a friend request
	@PutMapping("/{id}/accept")
	public Friendship acceptRequest(@PathVariable Long id) {
		return friendshipService.acceptFriendRequest(id);
	}

	@PutMapping("/{id}/reject")
	public Friendship rejectRequest(@PathVariable Long id) {
		return friendshipService.rejectFriendRequest(id);
	}

	@DeleteMapping("/{id}")
	public void deleteFriendship(@PathVariable Long id) {
		friendshipService.deleteFriendship(id);
	}

}