package com.petconnect.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "friendships")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Friendship {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "pet_id_1", nullable = false)
	@NotNull(message = "First pet is required")
	private Pet pet1;

	@ManyToOne
	@JoinColumn(name = "pet_id_2", nullable = false)
	@NotNull(message = "Second pet is required")
	private Pet pet2;

	@Column(nullable = false)
	private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt = LocalDateTime.now();
}