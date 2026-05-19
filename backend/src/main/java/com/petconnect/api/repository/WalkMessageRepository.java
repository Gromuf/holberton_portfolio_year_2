package com.petconnect.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.petconnect.api.model.WalkMessage;

@Repository
public interface WalkMessageRepository extends JpaRepository<WalkMessage, Long> {
    
    List<WalkMessage> findByWalkIdOrderByCreatedAtAsc(Long walkId);
    
    // Supprime tous les messages éphémères d'une balade spécifique
    @Modifying
    @Transactional
    void deleteByWalkId(Long walkId);

    // Supprime tous les messages éphémères envoyés par cet animal (Lien vers "sender")
    @Modifying
    @Transactional
    void deleteBySenderId(Long petId);
}