import React, { useState, useEffect } from "react";
// 1. IMPORT
import { createPortal } from "react-dom";
import api from "../../api/client";
import styles from "./Walk.module.css";

export default function ActiveWalkModal({ activeWalk, activePet, onClose, onEndWalk }) {
  // ... (Garde tes états et tes useEffects) ...
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

  // 2. TÉLÉPORTATION
  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {/* ... Garde ton code HTML intact ... */}
        <h3 className={styles.title}>📍 Balade en cours</h3>
        
        <div style={{ marginBottom: "20px", background: "#1e293b", padding: "15px", borderRadius: "8px" }}>
            <p style={{ margin: "0 0 10px 0", color: "#f1f5f9" }}>
                <strong>Organisée par :</strong> {activeWalk.organizer.name}
            </p>
            {activeWalk.description && (
                <p style={{ margin: 0, fontStyle: "italic", color: "#94a3b8" }}>
                    "{activeWalk.description}"
                </p>
            )}
        </div>

        <div className={styles.inputGroup}>
            <label>Membres présents :</label>
            {loading ? (
                <p className={styles.infoText}>Actualisation...</p>
            ) : (
                <div className={styles.friendsList}>
                    <div className={styles.friendOption} style={{ cursor: "default" }}>
                        <img src={activeWalk.organizer.imageUrl || "/default-pet.png"} alt="Orga" className={styles.friendAvatar} />
                        <span>{activeWalk.organizer.name} 👑</span>
                    </div>

                    {participants.map(invit => (
                        <div key={invit.id} className={styles.friendOption} style={{ cursor: "default" }}>
                            <img src={invit.pet.imageUrl || "/default-pet.png"} alt={invit.pet.name} className={styles.friendAvatar} />
                            <span>{invit.pet.name}</span>
                            <span style={{ marginLeft: "auto", fontSize: "12px", color: "#10b981" }}>Présent(e)</span>
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
                  onClick={() => { onEndWalk(activeWalk.id); onClose(); }}
                  style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "10px 15px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
                >
                    Terminer la balade
                </button>
            )}
        </div>
      </div>
    </div>,
    document.body // <-- Cible de la téléportation
  );
}