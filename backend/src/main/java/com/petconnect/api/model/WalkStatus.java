package com.petconnect.api.model;

public enum WalkStatus {
    PLANNED,      // Prévue (les invitations sont envoyées)
    IN_PROGRESS,  // En cours (le bouton "Démarrer" a été cliqué)
    COMPLETED,    // Terminée normalement
    CANCELLED     // Annulée par l'organisateur
}