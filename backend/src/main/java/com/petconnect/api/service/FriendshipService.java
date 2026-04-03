package com.petconnect.api.service;

import com.petconnect.api.model.Friendship;
import com.petconnect.api.model.Pet;
import com.petconnect.api.repository.FriendshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FriendshipService {

	@Autowired
	private FriendshipRepository friendshipRepository;

	// Accept a friend request
	public Friendship acceptFriendRequest(Long friendshipId) {
		Friendship friendship = friendshipRepository.findById(friendshipId)
				.orElseThrow(() -> new RuntimeException("Friendship not found"));
		friendship.setStatus("ACCEPTED");
		return friendshipRepository.save(friendship);
	}

	// Get all friends of a pet
	public List<Friendship> getAllFriends(Pet pet) {
        return friendshipRepository.findByPet1OrPet2(pet, pet);
    }

	// Reject a friend request
	public Friendship rejectFriendRequest(Long friendshipId) {
		Friendship friendship = friendshipRepository.findById(friendshipId)
            .orElseThrow(() -> new RuntimeException("Friendship not found"));
		friendship.setStatus("REJECTED");
		return friendshipRepository.save(friendship);
	}

	// Delete a friendship
	public void deleteFriendship(Long friendshipId) {
		friendshipRepository.deleteById(friendshipId);
	}

	// Check if two pets are already friends or have a pending request
	public Friendship sendFriendRequest(Pet requester, Pet receiver) {
		if (requester.getId().equals(receiver.getId())) {
			throw new RuntimeException("An animal cannot be friends with itself");
		}
		boolean exists = friendshipRepository.existsByPet1AndPet2(requester, receiver) ||
				friendshipRepository.existsByPet1AndPet2(receiver, requester);
		if (exists) {
			throw new RuntimeException("Friend request already exists between these two pets");
		}
		Friendship friendship = new Friendship();
		friendship.setPet1(requester);
		friendship.setPet2(receiver);
		friendship.setStatus("PENDING");
		return friendshipRepository.save(friendship);
	}
}