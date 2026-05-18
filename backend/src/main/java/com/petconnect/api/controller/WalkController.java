package com.petconnect.api.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.petconnect.api.model.Walk;
import com.petconnect.api.model.WalkInvitation;
import com.petconnect.api.model.WalkMessage;
import com.petconnect.api.model.InvitationStatus;
import com.petconnect.api.service.WalkService;

@RestController
@RequestMapping("/api/walks")
public class WalkController {

    @Autowired
    private WalkService walkService;

    // 1. 🛡️ OBTENIR LA BALADE ACTIVE D'UN ANIMAL
    @GetMapping("/pet/{petId}/active")
    public ResponseEntity<Walk> getActiveWalk(@PathVariable Long petId) {
        Optional<Walk> activeWalk = walkService.getActiveWalk(petId);
        if (activeWalk.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // Renvoie 204 si aucune balade
        }
        return ResponseEntity.ok(activeWalk.get());
    }

    // 2. 🛡️ OBTENIR LES INVITATIONS EN ATTENTE D'UN ANIMAL
    @GetMapping("/pet/{petId}/invitations")
    public ResponseEntity<List<WalkInvitation>> getPendingInvitations(@PathVariable Long petId) {
        return ResponseEntity.ok(walkService.getPendingInvitations(petId));
    }

    // 3. CRÉER UNE BALADE (Pris en charge par useWalk.js:createWalk)
    @PostMapping("/create")
    public ResponseEntity<Walk> createWalk(
            @RequestParam Long organizerId,
            @RequestParam(required = false) String description,
            @RequestBody List<Long> invitedPetIds) {
        return ResponseEntity.ok(walkService.createWalk(organizerId, invitedPetIds, description));
    }

    // 4. RÉPONDRE À UNE INVITATION
    @PutMapping("/invitations/{invitationId}")
    public ResponseEntity<Void> respondToInvitation(
            @PathVariable Long invitationId,
            @RequestParam InvitationStatus status) {
        walkService.respondToInvitation(invitationId, status);
        return ResponseEntity.ok().build();
    }

    // 5. TERMINER UNE BALADE
    @PutMapping("/{walkId}/end")
    public ResponseEntity<Void> endWalk(@PathVariable Long walkId) {
        walkService.endWalk(walkId);
        return ResponseEntity.ok().build();
    }

    // 6. RÉCUPÉRER LES PARTICIPANTS ACTUELS
    @GetMapping("/{walkId}/participants")
    public ResponseEntity<List<WalkInvitation>> getParticipants(@PathVariable Long walkId) {
        return ResponseEntity.ok(walkService.getAcceptedParticipants(walkId));
    }

    // 7. RECUPERER LES MESSAGES DU CHAT
    @GetMapping("/{walkId}/messages")
    public ResponseEntity<List<WalkMessage>> getMessages(@PathVariable Long walkId) {
        return ResponseEntity.ok(walkService.getWalkMessages(walkId));
    }

    // 8. ENVOYER UN MESSAGE DANS LE CHAT
    @PostMapping("/{walkId}/chat")
    public ResponseEntity<WalkMessage> sendMessage(
            @PathVariable Long walkId,
            @RequestParam Long senderId,
            @RequestBody String content) {
        return ResponseEntity.ok(walkService.sendWalkMessage(walkId, senderId, content));
    }
}