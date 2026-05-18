import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "../Common/Button";
import api from "../../api/client";
import styles from "./Walk.module.css";

export default function CreateWalkModal({ myPets = [], onClose, onSubmit }) {
  const [organizerId, setOrganizerId] = useState("");
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [description, setDescription] = useState("");
  const [loadingFriends, setLoadingFriends] = useState(false);

  useEffect(() => {
    if (!organizerId) {
      setFriends([]);
      setSelectedFriends([]);
      return;
    }
    setLoadingFriends(true);
    api.get(`/pets/${organizerId}/friends`)
      .then(res => setFriends(res.data))
      .catch(err => console.error("Erreur amis", err))
      .finally(() => setLoadingFriends(false));
  }, [organizerId]);

  const toggleFriend = (id) => {
    setSelectedFriends(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(organizerId, selectedFriends, description);
    onClose();
  };

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h3 className={styles.title}>🦮 Organiser une balade</h3>

        <form onSubmit={handleSubmit} className={styles.walkForm}>
          
          <div className={styles.inputGroup}>
            <label>Qui organise la balade ? *</label>
            <select 
              required
              value={organizerId} 
              onChange={(e) => setOrganizerId(e.target.value)}
            >
              <option value="" disabled>Choisir un de vos animaux</option>
              {myPets.map(pet => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} {pet.walking ? "🐾 (Déjà en balade)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Où et quand ? (Optionnel)</label>
            <input 
              type="text" 
              placeholder="Ex: Parc de la Tête d'Or à 18h"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Inviter des amis :</label>
            {!organizerId ? (
              <p className={styles.infoText}>Choisissez un organisateur d'abord.</p>
            ) : loadingFriends ? (
              <p className={styles.infoText}>Recherche des amis...</p>
            ) : friends.length > 0 ? (
              <div className={styles.friendsList}>
                {friends.map(friend => (
                  <label 
                    key={friend.id} 
                    className={styles.friendOption}
                    style={{ 
                      opacity: friend.walking ? 0.5 : 1, 
                      cursor: friend.walking ? "not-allowed" : "pointer" 
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedFriends.includes(friend.id)}
                      onChange={() => toggleFriend(friend.id)}
                      disabled={friend.walking}
                    />
                    <img 
                      src={friend.imageUrl || "/default-pet.png"} 
                      alt={friend.name} 
                      className={styles.friendAvatar}
                    />
                    <span>{friend.name}</span>
                    
                    {friend.walking && (
                      <span style={{ marginLeft: "auto", fontSize: "12px", color: "#ef4444", fontWeight: "bold" }}>
                        Déjà en balade 🐾
                      </span>
                    )}
                  </label>
                ))}
              </div>
            ) : (
              <p className={styles.infoText}>Cet animal n'a pas encore d'amis à inviter.</p>
            )}
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Annuler
            </button>
            <Button 
              type="submit" 
              variant="success" 
              disabled={!organizerId || selectedFriends.length === 0}
            >
              Lancer la balade
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}