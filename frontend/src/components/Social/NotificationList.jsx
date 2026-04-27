import React from 'react';
import NotificationItem from './NotificationItem'; // Import du nouveau fichier
import styles from './Notification.module.css';

export default function NotificationList({ requests, onAccept, onReject }) {
  // Si aucune demande, on ne rend absolument rien (évite de polluer la sidebar)
  if (!requests || requests.length === 0) return null;

  return (
    <div className={styles.notificationArea}>
      <p className={styles.label}>Demandes reçues ({requests.length})</p>
      {requests.map(req => (
        <NotificationItem 
          key={req.id} 
          request={req} 
          onAccept={onAccept} 
          onReject={onReject} 
        />
      ))}
      <hr className={styles.divider} />
    </div>
  );
}