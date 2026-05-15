package com.petconnect.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "walks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Walk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "organizer_id", nullable = false)
    private Pet organizer;

    // NOUVEAU CHAMP : Description ou lieu de rendez-vous
    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WalkStatus status = WalkStatus.PLANNED;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "walk", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<WalkInvitation> invitations;
}