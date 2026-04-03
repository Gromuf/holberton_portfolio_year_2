package com.petconnect.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(unique = true, nullable = false, length = 100) // Email doit être unique et non nul et 100 charactere suffisent
	@Email
	@NotBlank
	private String email;

	@Column(nullable = false) // Password ne doit pas être nul
	@Size(min = 6, message = "Password must be at least 6 characters long")
	private String password;

	@Column(nullable = false, length = 50) // Name ne doit pas être nul et 50 charactere suffisent
	@NotBlank(message = "Name is required")
	private String name;

	@OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Pet> pets;
}
