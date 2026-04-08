package com.petconnect.api.service;

import com.petconnect.api.model.Friendship;
import com.petconnect.api.model.Pet;
import com.petconnect.api.model.User;
import com.petconnect.api.repository.FriendshipRepository;
import com.petconnect.api.repository.PetRepository;
import com.petconnect.api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class FriendshipServiceTest {

    @Autowired
    private FriendshipService friendshipService;

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        // deleteAllInBatch() est plus agressif et ignore le cycle de vie Hibernate
        friendshipRepository.deleteAllInBatch();
        petRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();
        
        // On force la synchronisation avec la base de données immédiatement
        userRepository.flush();
    }

    @Test
    void testSendAndAcceptFriendRequest() {
        // Utilisons un email unique pour ce test pour éviter tout conflit résiduel
        String uniqueEmail = "service_test_" + System.currentTimeMillis() + "@test.com";

        User owner = new User();
        owner.setName("serviceUser");
        owner.setEmail(uniqueEmail); // Email dynamique
        owner.setPassword("password123");
        owner = userRepository.saveAndFlush(owner); // Sauvegarde et flush immédiat

        Pet p1 = new Pet();
        p1.setName("Rex");
        p1.setSpecies("Dog");
        p1.setOwner(owner);
        p1 = petRepository.saveAndFlush(p1);

        Pet p2 = new Pet();
        p2.setName("Koziz");
        p2.setSpecies("Cat");
        p2.setOwner(owner);
        p2 = petRepository.saveAndFlush(p2);

        // Test du service
        Friendship request = friendshipService.sendFriendRequest(p1.getId(), p2.getId(), owner.getEmail());
        assertNotNull(request.getId());
        assertEquals("PENDING", request.getStatus());

        Friendship accepted = friendshipService.acceptFriendRequest(request.getId(), owner.getEmail());
        assertEquals("ACCEPTED", accepted.getStatus());
    }
}