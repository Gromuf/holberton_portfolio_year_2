package com.petconnect.api.controller;

import com.petconnect.api.model.Friendship;
import com.petconnect.api.service.FriendshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
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
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // On passe les IDs et l'email au service
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
}