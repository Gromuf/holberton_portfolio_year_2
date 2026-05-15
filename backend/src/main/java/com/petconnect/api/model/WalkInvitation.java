package com.petconnect.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "walk_invitations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WalkInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // La balade concernée
    @ManyToOne
    @JoinColumn(name = "walk_id", nullable = false)
    private Walk walk;

    // L'animal invité
    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvitationStatus status = InvitationStatus.PENDING;

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;
}