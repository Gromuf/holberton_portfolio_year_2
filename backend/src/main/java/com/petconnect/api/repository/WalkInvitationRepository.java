package com.petconnect.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.petconnect.api.model.InvitationStatus;
import com.petconnect.api.model.WalkInvitation;

@Repository
public interface WalkInvitationRepository extends JpaRepository<WalkInvitation, Long> {
    // Trouver les invitations reçues par un animal
    List<WalkInvitation> findByPetIdAndStatus(Long petId, InvitationStatus status);
    
    // Trouver une invitation spécifique pour une balade donnée
    Optional<WalkInvitation> findByWalkIdAndPetId(Long walkId, Long petId);
    
    // Trouver tous les participants "acceptés" d'une balade
    List<WalkInvitation> findByWalkIdAndStatus(Long walkId, InvitationStatus status);

    // Vérifier si un animal a déjà une invitation active (acceptée ou en attente)
    boolean existsByPetId(Long petId);
}