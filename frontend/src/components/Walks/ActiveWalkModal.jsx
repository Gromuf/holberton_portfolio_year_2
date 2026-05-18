import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import api from "../../api/client";
import styles from "./Walk.module.css";

export default function ActiveWalkModal({ activeWalk, activePet, messages = [], onSendMessage, onClose, onEndWalk }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typedMessage, setTypedMessage] = useState("");
  const chatEndRef = useRef(null);

  // Charger la liste des animaux présents
  useEffect(() => {
    if (!activeWalk) return;
    api.get(`/walks/${activeWalk.id}/participants`)
      .then(res => setParticipants(res.data))
      .catch(err => console.error("Erreur participants", err))
      .finally(() => setLoading(false));
  }, [activeWalk]);

  // Scroll automatique tout en bas du chat lors d'un nouveau message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!activeWalk || !activePet) return null;

  const isOrganizer = activeWalk.organizer.id === activePet.id;

  const handleSend = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    onSendMessage(activeWalk.id, activePet.id, typedMessage);
    setTypedMessage("");
  };

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modalContent} ${styles.largeModal}`} onClick={e => e.stopPropagation()}>
        <h3 className={styles.title}>📍 Balade de {activeWalk.organizer.name}</h3>
        
        <div className={styles.walkGridContainer}>
          
          {/* COLONNE GAUCHE : MEMBRES */}
          <div className={styles.sidebarColumn}>
            <div className={styles.walkDetailsBlock}>
                {activeWalk.description && (
                    <p className={styles.descriptionText}>"{activeWalk.description}"</p>
                )}
            </div>

            <div className={styles.inputGroup}>
                <label>Chiens présents :</label>
                {loading ? (
                    <p className={styles.infoText}>Actualisation...</p>
                ) : (
                    <div className={styles.friendsList}>
                        <div className={styles.participantRow}>
                            <img src={activeWalk.organizer.imageUrl || "/default-pet.png"} alt="Orga" className={styles.friendAvatar} />
                            <span className={styles.friendName}>{activeWalk.organizer.name} 👑</span>
                        </div>

                        {participants.map(invit => (
                            <div key={invit.id} className={styles.participantRow}>
                                <img src={invit.pet.imageUrl || "/default-pet.png"} alt={invit.pet.name} className={styles.friendAvatar} />
                                <span className={styles.friendName}>{invit.pet.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </div>

          {/* COLONNE DROITE : CHAT ÉPHÉMÈRE */}
          <div className={styles.chatColumn}>
            <label className={styles.chatLabel}>💬 Discussion éphémère</label>
            <div className={styles.chatMessagesContainer}>
              {messages.length === 0 ? (
                <p className={styles.emptyChat}>Aucun message. Dites bonjour ! 👋</p>
              ) : (
                messages.map(msg => {
                  const isMe = msg.sender.id === activePet.id;
                  return (
                    <div key={msg.id} className={`${styles.chatBubbleWrapper} ${isMe ? styles.chatMe : styles.chatOther}`}>
                      <span className={styles.chatSenderName}>{msg.sender.name}</span>
                      <div className={styles.chatBubble}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSend} className={styles.chatInputForm}>
              <input 
                type="text" 
                placeholder="Écrire un message..." 
                value={typedMessage}
                onChange={e => setTypedMessage(e.target.value)}
                className={styles.chatInputField}
              />
              <button type="submit" className={styles.chatSendBtn}>▶</button>
            </form>
          </div>

        </div>

        <div className={styles.actions} style={{ marginTop: "20px" }}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Fermer
            </button>
            {isOrganizer && (
                <button 
                  className={styles.endWalkBtn}
                  onClick={() => { onEndWalk(activeWalk.id); onClose(); }}
                >
                    Terminer la balade (Efface le chat)
                </button>
            )}
        </div>
      </div>
    </div>,
    document.body
  );
}