package com.petconnect.api.controller;

import com.petconnect.api.model.*;
import com.petconnect.api.service.WalkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/walks")
public class WalkController {

    @Autowired private WalkService walkService;

    // Création
    @PostMapping("/create")
    public Walk create(@RequestParam Long organizerId, @RequestParam String description, @RequestBody List<Long> invitedIds) {
        return walkService.createWalk(organizerId, invitedIds, description);
    }

    // Récupérer la balade active d'un animal
    @GetMapping("/pet/{petId}/active")
    public ResponseEntity<Walk> getActiveWalk(@PathVariable Long petId) {
        return walkService.getActiveWalk(petId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    // Récupérer les invitations en attente pour un animal
    @GetMapping("/pet/{petId}/invitations")
    public List<WalkInvitation> getPendingInvitations(@PathVariable Long petId) {
        return walkService.getPendingInvitations(petId);
    }

    // Récupérer les participants qui ont accepté pour une balade précise
    @GetMapping("/{walkId}/participants")
    public List<WalkInvitation> getParticipants(@PathVariable Long walkId) {
        return walkService.getAcceptedParticipants(walkId);
    }

    // Actions
    @PutMapping("/invitations/{invitationId}")
    public void respond(@PathVariable Long invitationId, @RequestParam InvitationStatus status) {
        walkService.respondToInvitation(invitationId, status);
    }

    @PutMapping("/{walkId}/end")
    public void end(@PathVariable Long walkId) {
        walkService.endWalk(walkId);
    }
}