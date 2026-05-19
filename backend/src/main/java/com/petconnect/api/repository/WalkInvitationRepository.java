package com.petconnect.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.petconnect.api.model.InvitationStatus;
import com.petconnect.api.model.WalkInvitation;

@Repository
public interface WalkInvitationRepository extends JpaRepository<WalkInvitation, Long> {
    
    List<WalkInvitation> findByPetIdAndStatus(Long petId, InvitationStatus status);
    Optional<WalkInvitation> findByWalkIdAndPetId(Long walkId, Long petId);
    List<WalkInvitation> findByWalkIdAndStatus(Long walkId, InvitationStatus status);
    boolean existsByPetId(Long petId);

    // Supprime toutes les invitations qu'un animal a reçues
    @Modifying
    @Transactional
    void deleteByPetId(Long petId);

    // Supprime toutes les invitations distribuées pour une balade spécifique
    @Modifying
    @Transactional
    void deleteByWalkId(Long walkId);
}