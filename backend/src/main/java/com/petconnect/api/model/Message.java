package com.petconnect.api.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

	@Column(nullable = false)
    private Boolean isRead = false;
	
	@ManyToOne
	@JoinColumn(name = "sender_pet_id", nullable = false)
	@NotNull(message = "Sender pet is required")
	private Pet senderPet;

	@ManyToOne
	@JoinColumn(name = "receiver_pet_id", nullable = false)
	@NotNull(message = "Receiver pet is required")
	private Pet receiverPet;
}