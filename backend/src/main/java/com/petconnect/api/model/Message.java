package com.petconnect.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, columnDefinition = "TEXT")
	@NotBlank(message = "Message content cannot be empty")
	private String content;

	@Column(name = "sent_at", nullable = false)
	private LocalDateTime sentAt = LocalDateTime.now();

	@ManyToOne
	@JoinColumn(name = "sender_pet_id", nullable = false)
	@NotNull(message = "Sender pet is required")
	private Pet senderPet;

	@ManyToOne
	@JoinColumn(name = "receiver_pet_id", nullable = false)
	@NotNull(message = "Receiver pet is required")
	private Pet receiverPet;
}