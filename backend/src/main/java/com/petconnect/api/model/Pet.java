package com.petconnect.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "pets")
@Data // Génère les getters, setters, toString, equals et hashCode
@NoArgsConstructor // Génère un constructeur sans arguments
@AllArgsConstructor // Génère un constructeur avec tous les arguments
public class Pet {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 50)
	@NotBlank(message = "Name is required")
	private String name;

	@Column(nullable = false, length = 30)
	@NotBlank(message = "Species is required")
	private String species;

	@Column(nullable = false)
	private Boolean isWalking = false; // par defaut le pet n'est pas en balade

	@NotNull(message = "Owner is required for every pet") // Le propriétaire doit être spécifié
	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false) // Clé étrangère vers la table users
	private User owner;
}
