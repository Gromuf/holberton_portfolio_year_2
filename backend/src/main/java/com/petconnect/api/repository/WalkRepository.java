package com.petconnect.api.repository;

import com.petconnect.api.model.Walk;
import com.petconnect.api.model.WalkStatus;
import com.petconnect.api.model.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WalkRepository extends JpaRepository<Walk, Long> {
    
    @Query("SELECT DISTINCT w FROM Walk w LEFT JOIN w.invitations i " +
           "WHERE w.status = :walkStatus " +
           "AND (w.organizer.id = :petId OR (i.pet.id = :petId AND i.status = :invStatus))")
    Optional<Walk> findActiveWalkByPetId(
        @Param("petId") Long petId,
        @Param("walkStatus") WalkStatus walkStatus,
        @Param("invStatus") InvitationStatus invStatus
    );
}