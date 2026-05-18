package com.petconnect.api.service;

import com.petconnect.api.model.*;
import com.petconnect.api.repository.PetRepository;
import com.petconnect.api.repository.WalkInvitationRepository;
import com.petconnect.api.repository.WalkRepository;
import com.petconnect.api.repository.WalkMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class WalkService {

    @Autowired private WalkRepository walkRepository;
    @Autowired private WalkInvitationRepository invitationRepository;
    @Autowired private PetRepository petRepository;
    @Autowired private WalkMessageRepository walkMessageRepository;

    @Transactional
    public Walk createWalk(Long organizerId, List<Long> invitedPetIds, String description) {
        Pet organizer = petRepository.findById(organizerId)
                .orElseThrow(() -> new RuntimeException("Pet organizer not found"));

        Walk walk = new Walk();
        walk.setOrganizer(organizer);
        walk.setDescription(description);
        walk.setStatus(WalkStatus.IN_PROGRESS);
        Walk savedWalk = walkRepository.save(walk);

        // 🛡️ SÉCURITÉ BALADE SOLO : On exécute la boucle d'invitations uniquement s'il y a des invités
        if (invitedPetIds != null && !invitedPetIds.isEmpty()) {
            for (Long invitedId : invitedPetIds) {
                Pet invitedPet = petRepository.findById(invitedId)
                        .orElseThrow(() -> new RuntimeException("Invited Pet not found"));
                
                WalkInvitation invitation = new WalkInvitation();
                invitation.setWalk(savedWalk);
                invitation.setPet(invitedPet);
                invitation.setStatus(InvitationStatus.PENDING);
                invitationRepository.save(invitation);
            }
        }

        return savedWalk;
    }

    public Optional<Walk> getActiveWalk(Long petId) {
        if (petId == null || petId <= 0) {
            return Optional.empty();
        }

        try {
            // Le bouclier est élargi : si l'animal est l'organisateur d'une balade active, 
            // il est considéré comme indisponible, même s'il n'y a aucune ligne dans la table walk_invitations.
            boolean hasHistory = walkRepository.existsByOrganizerId(petId) || invitationRepository.existsByPetId(petId);
            if (!hasHistory) {
                return Optional.empty();
            }

            return walkRepository.findActiveWalkByPetId(
                petId, 
                WalkStatus.IN_PROGRESS.name(), 
                InvitationStatus.ACCEPTED.name()
            );
        } catch (Exception e) {
            System.err.println("Sécurité interceptée sur getActiveWalk: " + e.getMessage());
            return Optional.empty();
        }
    }

    public List<WalkInvitation> getPendingInvitations(Long petId) {
        if (petId == null || petId <= 0) {
            return List.of();
        }

        try {
            if (!invitationRepository.existsByPetId(petId)) {
                return List.of();
            }

            return invitationRepository.findByPetIdAndStatus(petId, InvitationStatus.PENDING);
        } catch (Exception e) {
            System.err.println("Sécurité interceptée sur getPendingInvitations: " + e.getMessage());
            return List.of();
        }
    }

    public List<WalkInvitation> getAcceptedParticipants(Long walkId) {
        return invitationRepository.findByWalkIdAndStatus(walkId, InvitationStatus.ACCEPTED);
    }

    @Transactional
    public void respondToInvitation(Long invitationId, InvitationStatus response) {
        WalkInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));
        
        // 🛡️ SÉCURITÉ AU MOMENT D'ACCEPTER : Si l'animal tente d'accepter mais qu'il est parti entre-temps
        if (response == InvitationStatus.ACCEPTED && getActiveWalk(invitation.getPet().getId()).isPresent()) {
            throw new RuntimeException("Tu es déjà engagé dans une autre balade active !");
        }

        invitation.setStatus(response);
        invitation.setRespondedAt(LocalDateTime.now());
        invitationRepository.save(invitation);
    }

    public List<WalkMessage> getWalkMessages(Long walkId) {
        return walkMessageRepository.findByWalkIdOrderByCreatedAtAsc(walkId);
    }

    @Transactional
    public WalkMessage sendWalkMessage(Long walkId, Long senderPetId, String content) {
        Walk walk = walkRepository.findById(walkId)
                .orElseThrow(() -> new RuntimeException("Walk not found"));
        Pet sender = petRepository.findById(senderPetId)
                .orElseThrow(() -> new RuntimeException("Sender pet not found"));

        WalkMessage msg = new WalkMessage();
        msg.setWalk(walk);
        msg.setSender(sender);
        msg.setContent(content);
        return walkMessageRepository.save(msg);
    }

    @Transactional
    public void endWalk(Long walkId) {
        Walk walk = walkRepository.findById(walkId)
                .orElseThrow(() -> new RuntimeException("Walk not found"));
        
        walk.setStatus(WalkStatus.COMPLETED);
        walkRepository.save(walk);

        walkMessageRepository.deleteByWalkId(walkId);
    }
}