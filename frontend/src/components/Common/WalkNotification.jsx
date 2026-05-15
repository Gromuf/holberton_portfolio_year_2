import React from "react";
import styles from "./WalkNotification.module.css";

const WalkNotification = ({ invitation, onAccept, onDecline }) => {
  // SÉCURITÉ : On bloque le rendu si les données ne sont pas encore prêtes
  if (!invitation || !invitation.walk || !invitation.walk.organizer)
    return null;

  const organizer = invitation.walk.organizer;

  return (
    <div className={styles.notifBanner}>
      <div className={styles.content}>
        <div className={styles.avatarWrapper}>
          <img
            src={organizer.imageUrl || "/default-pet.png"}
            alt={organizer.name}
            className={styles.avatar}
          />
          <span className={styles.badge}>🦮</span>
        </div>
        <div className={styles.text}>
          <p>Nouvelle balade !</p>
          <span>
            <strong>{organizer.name}</strong> vous invite.
          </span>
        </div>
      </div>

      {/* Affichage de la description (Lieu/Heure) si elle existe */}
      {invitation.walk.description && (
        <div className={styles.description}>
          "{invitation.walk.description}"
        </div>
      )}

      <div className={styles.actions}>
        <button className={styles.btnAccept} onClick={onAccept}>
          Accepter
        </button>
        <button className={styles.btnDecline} onClick={onDecline}>
          Refuser
        </button>
      </div>
    </div>
  );
};

export default WalkNotification;
