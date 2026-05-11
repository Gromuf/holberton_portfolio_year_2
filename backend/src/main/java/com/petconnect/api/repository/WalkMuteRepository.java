package com.petconnect.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.petconnect.api.model.WalkMute;

public interface WalkMuteRepository extends JpaRepository<WalkMute, Long> {
    boolean existsByMuterIdAndMutedId(Long muterId, Long mutedId);
}