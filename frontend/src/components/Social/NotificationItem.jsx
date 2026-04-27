import React from 'react';
import styles from './Notification.module.css';

/**
 * Composant pour afficher une demande d'ami individuelle.
 * @param {Object} request - L'objet de la demande contenant les deux animaux (pet1 et pet2).
 * @param {Function} onAccept - Fonction appelée pour valider la demande.
 * @param {Function} onReject - Fonction appelée pour refuser la demande.
 */
export default function NotificationItem({ request, onAccept, onReject }) {
  return (
    <div className={styles.notifCard}>
      <div className={styles.notifText}>
        {/* L'animal qui envoie la demande */}
        <strong>{request.pet1.name}</strong>
        <span className={styles.notifSubText}>veut être ami avec</span>
        {/* Ton animal qui reçoit la demande */}
        <strong>{request.pet2.name}</strong>
      </div>
      
      <div className={styles.notifActions}>
        <button 
          className={styles.acceptBtn} 
          onClick={() => onAccept(request.id)}
          title="Accepter la demande"
        >
          ✓
        </button>
        <button 
          className={styles.rejectBtn} 
          onClick={() => onReject(request.id)}
          title="Refuser la demande"
        >
          ✕
        </button>
      </div>
    </div>
  );
}