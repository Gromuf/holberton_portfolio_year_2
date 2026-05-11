package com.petconnect.api.controller;

import com.petconnect.api.model.Pet;
import com.petconnect.api.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/walks")
public class WalkController {
    @Autowired private PetService petService;

    @PostMapping("/{petId}/start")
    public void startWalk(@PathVariable Long petId) { petService.startWalk(petId); }

    @PostMapping("/{petId}/stop")
    public void stopWalk(@PathVariable Long petId) { petService.stopWalk(petId); }

    @GetMapping("/check-friends/{myPetId}")
    public List<Pet> checkFriends(@PathVariable Long myPetId) {
        return petService.getFriendsInWalk(myPetId);
    }

    @PostMapping("/{myPetId}/mute/{friendId}")
    public void mute(@PathVariable Long myPetId, @PathVariable Long friendId) {
        petService.muteFriendForWalks(myPetId, friendId);
    }
}