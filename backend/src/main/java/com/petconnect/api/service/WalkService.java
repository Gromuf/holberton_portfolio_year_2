package com.petconnect.api.service;

import com.petconnect.api.model.*;
import com.petconnect.api.repository.PetRepository;
import com.petconnect.api.repository.WalkInvitationRepository;
import com.petconnect.api.repository.WalkRepository;
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

    @Transactional
    public Walk createWalk(Long organizerId, List<Long> invitedPetIds, String description) {
        Pet organizer = petRepository.findById(organizerId)
                .orElseThrow(() -> new RuntimeException("Pet organizer not found"));

        Walk walk = new Walk();
        walk.setOrganizer(organizer);
        walk.setDescription(description);
        walk.setStatus(WalkStatus.IN_PROGRESS);
        Walk savedWalk = walkRepository.save(walk);

        for (Long invitedId : invitedPetIds) {
            Pet invitedPet = petRepository.findById(invitedId)
                    .orElseThrow(() -> new RuntimeException("Invited Pet not found"));
            
            WalkInvitation invitation = new WalkInvitation();
            invitation.setWalk(savedWalk);
            invitation.setPet(invitedPet);
            invitation.setStatus(InvitationStatus.PENDING);
            invitationRepository.save(invitation);
        }

        return savedWalk;
    }

    public Optional<Walk> getActiveWalk(Long petId) {
        return walkRepository.findActiveWalkByPetId(
            petId, 
            WalkStatus.IN_PROGRESS, 
            InvitationStatus.ACCEPTED
        );
    }

    public List<WalkInvitation> getPendingInvitations(Long petId) {
        return invitationRepository.findByPetIdAndStatus(petId, InvitationStatus.PENDING);
    }

    public List<WalkInvitation> getAcceptedParticipants(Long walkId) {
        return invitationRepository.findByWalkIdAndStatus(walkId, InvitationStatus.ACCEPTED);
    }

    @Transactional
    public void respondToInvitation(Long invitationId, InvitationStatus response) {
        WalkInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));
        invitation.setStatus(response);
        invitation.setRespondedAt(LocalDateTime.now());
        invitationRepository.save(invitation);
    }

    @Transactional
    public void endWalk(Long walkId) {
        Walk walk = walkRepository.findById(walkId)
                .orElseThrow(() -> new RuntimeException("Walk not found"));
        walk.setStatus(WalkStatus.COMPLETED);
        walkRepository.save(walk);
    }
}