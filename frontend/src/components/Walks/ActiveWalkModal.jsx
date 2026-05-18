import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import api from "../../api/client";
import styles from "./Walk.module.css";

export default function ActiveWalkModal({ activeWalk, activePet, onClose, onEndWalk }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeWalk) return;
    api.get(`/walks/${activeWalk.id}/participants`)
      .then(res => setParticipants(res.data))
      .catch(err => console.error("Erreur participants", err))
      .finally(() => setLoading(false));
  }, [activeWalk]);

  if (!activeWalk || !activePet) return null;

  const isOrganizer = activeWalk.organizer.id === activePet.id;

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h3 className={styles.title}>📍 Balade en cours</h3>
        
        {/* Infos de la balade (Zéro CSS en ligne) */}
        <div className={styles.walkDetailsBlock}>
            <p className={styles.organizerText}>
                <strong>Organisée par :</strong> {activeWalk.organizer.name}
            </p>
            {activeWalk.description && (
                <p className={styles.descriptionText}>
                    "{activeWalk.description}"
                </p>
            )}
        </div>

        {/* Liste des participants */}
        <div className={styles.inputGroup}>
            <label>Membres présents :</label>
            {loading ? (
                <p className={styles.infoText}>Actualisation...</p>
            ) : (
                <div className={styles.friendsList}>
                    {/* L'organisateur */}
                    <div className={styles.participantRow}>
                        <img src={activeWalk.organizer.imageUrl || "/default-pet.png"} alt="Orga" className={styles.friendAvatar} />
                        <span className={styles.friendName}>{activeWalk.organizer.name} 👑</span>
                    </div>

                    {/* Les invités présents */}
                    {participants.map(invit => (
                        <div key={invit.id} className={styles.participantRow}>
                            <img src={invit.pet.imageUrl || "/default-pet.png"} alt={invit.pet.name} className={styles.friendAvatar} />
                            <span className={styles.friendName}>{invit.pet.name}</span>
                            <span className={styles.statusBadgePresent}>Présent(e)</span>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Fermer
            </button>
            {isOrganizer && (
                <button 
                  className={styles.endWalkBtn}
                  onClick={() => { onEndWalk(activeWalk.id); onClose(); }}
                >
                    Terminer la balade
                </button>
            )}
        </div>
      </div>
    </div>,
    document.body
  );
}