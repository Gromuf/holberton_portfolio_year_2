package com.petconnect.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.petconnect.api.model.WalkMessage;

@Repository
public interface WalkMessageRepository extends JpaRepository<WalkMessage, Long> {
    List<WalkMessage> findByWalkIdOrderByCreatedAtAsc(Long walkId);
    void deleteByWalkId(Long walkId);
}