package com.petconnect.api.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
	private boolean isWalking = false; // par defaut le pet n'est pas en balade

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false) // Clé étrangère vers la table users
	@JsonIgnoreProperties("pets") // pour éviter la récursion infinie lors de la sérialisation JSON
	private User owner;

	@Column(name = "image_url", length = 500)
	private String imageUrl;

	@OneToMany(mappedBy = "pet1", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private List<Friendship> friendshipsAsPet1;

	@OneToMany(mappedBy = "pet2", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private List<Friendship> friendshipsAsPet2;
}
