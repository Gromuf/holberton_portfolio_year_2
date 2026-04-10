package com.petconnect.api.service;

import com.petconnect.api.model.Friendship;
import com.petconnect.api.model.Pet;
import com.petconnect.api.repository.FriendshipRepository;
import com.petconnect.api.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FriendshipService {

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private PetRepository petRepository;

    // Accept a friend request
    public Friendship acceptFriendRequest(Long friendshipId, String currentUserEmail) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new RuntimeException("Friendship not found"));

        // SÉCURITÉ : Seul le destinataire (pet2) peut accepter
        if (!friendship.getPet2().getOwner().getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("Forbidden: Only the receiver can accept this request");
        }

        friendship.setStatus("ACCEPTED");
        return friendshipRepository.save(friendship);
    }

    // Get all friends of a pet
    public List<Friendship> getAllFriends(Pet pet) {
        return friendshipRepository.findByPet1OrPet2(pet, pet);
    }

    // Reject a friend request
    public Friendship rejectFriendRequest(Long friendshipId, String currentUserEmail) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
            .orElseThrow(() -> new RuntimeException("Friendship not found"));

        // SÉCURITÉ : Seul le destinataire (pet2) peut rejeter
        if (!friendship.getPet2().getOwner().getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("Forbidden: Only the receiver can reject this request");
        }

        friendship.setStatus("REJECTED");
        return friendshipRepository.save(friendship);
    }

    // Delete a friendship
    public void deleteFriendship(Long friendshipId) {
        // Optionnel : Tu pourrais aussi ajouter une vérification d'email ici
        // pour que seul pet1 ou pet2 puisse supprimer la relation.
        friendshipRepository.deleteById(friendshipId);
    }

    // Check if two pets are already friends or have a pending request
    public Friendship sendFriendRequest(Long requesterId, Long receiverId, String currentUserEmail) {
        Pet requester = petRepository.findById(requesterId)
                .orElseThrow(() -> new RuntimeException("Requester pet not found"));
        Pet receiver = petRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver pet not found"));

        // SÉCURITÉ : Est-ce mon animal qui fait la demande ?
        if (!requester.getOwner().getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("Forbidden: You are not the owner of the requester pet");
        }

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

    // Get pending friend requests for a user
    public List<Friendship> getPendingRequestForUser(String email) {
        return friendshipRepository.findAll().stream().filter(f -> f.getStatus().equals("PENDING")).filter(f -> f.getPet2().getOwner().getEmail().equals(email)).toList();
    }
}