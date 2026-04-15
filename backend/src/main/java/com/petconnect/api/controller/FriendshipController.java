package com.petconnect.api.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petconnect.api.model.Friendship;
import com.petconnect.api.service.FriendshipService;

@RestController
@RequestMapping("/api/friendships")
public class FriendshipController {

    @Autowired
    private FriendshipService friendshipService;

    // Post : create a friend request
    @PostMapping("/request")
    public Friendship createRequest(@RequestBody Friendship request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return friendshipService.sendFriendRequest(
            request.getPet1().getId(), 
            request.getPet2().getId(), 
            email
        );
    }

    // Put : accept a friend request
    @PutMapping("/{id}/accept")
    public Friendship acceptRequest(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        return friendshipService.acceptFriendRequest(id, email);
    }

    @PutMapping("/{id}/reject")
    public Friendship rejectRequest(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return friendshipService.rejectFriendRequest(id, email);
    }

    @DeleteMapping("/{id}")
    public void deleteFriendship(@PathVariable Long id) {
        // sécuriser la suppression (ex: seul pet1 ou pet2 peut supprimer)
        friendshipService.deleteFriendship(id);
    }

    // Get pending friend requests for the current user
    @GetMapping("/pending")
    public List<Friendship> getPendingRequests() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return friendshipService.getPendingRequestForUser(email);
    }

    // Get friends of a pet
    @GetMapping("/pet/{petId}/friends")
    public List<Map<String, Object>> getPetFriends(@PathVariable Long petId) {
        return friendshipService.getFriendsForPet(petId);
    }
}