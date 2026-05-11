import React from 'react';
import styles from './WalkNotification.module.css';

const WalkNotification = ({ friend, onReply, onMute, onClose }) => {
  return (
    <div className={styles.notifBanner}>
      <div className={styles.content}>
        <div className={styles.avatarWrapper}>
          <img src={friend.imageUrl || "/default-pet.png"} alt={friend.name} className={styles.avatar} />
          <span className={styles.badge}>🦮</span>
        </div>
        <div className={styles.text}>
          <p><strong>{friend.name}</strong> est parti en balade !</p>
          <span>Vas vite le rejoindre au parc.</span>
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.btnReply} onClick={onReply}>J'arrive !</button>
        <button className={styles.btnMute} onClick={() => onMute(friend.id)}>Ne plus m'avertir</button>
        <button className={styles.btnClose} onClick={onClose}>Plus tard</button>
      </div>
    </div>
  );
};

export default WalkNotification;