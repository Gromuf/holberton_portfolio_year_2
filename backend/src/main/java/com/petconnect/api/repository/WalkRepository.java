package com.petconnect.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.petconnect.api.model.Walk;

@Repository
public interface WalkRepository extends JpaRepository<Walk, Long> {
    
    boolean existsByOrganizerId(Long organizerId);

    @Query(value = "SELECT DISTINCT w.* FROM walks w " +
                   "LEFT JOIN walk_invitations i ON w.id = i.walk_id " +
                   "WHERE w.status = :walkStatus " +
                   "AND (w.organizer_id = :petId OR (i.pet_id = :petId AND i.status = :invStatus))", 
           nativeQuery = true)
    Optional<Walk> findActiveWalkByPetId(
        @Param("petId") Long petId,
        @Param("walkStatus") String walkStatus,
        @Param("invStatus") String invStatus
    );

    // Supprime toutes les balades créées par cet organisateur
    @Modifying
    @Transactional
    void deleteByOrganizerId(Long organizerId);
}