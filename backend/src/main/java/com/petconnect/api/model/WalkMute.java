package com.petconnect.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "walk_mutes")
@Data
public class WalkMute {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "muter_id")
    private Pet muter; // L'animal qui "silencie"

    @ManyToOne
    @JoinColumn(name = "muted_id")
    private Pet muted; // L'animal qui est "silencié"
}