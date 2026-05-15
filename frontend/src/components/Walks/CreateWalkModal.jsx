import React, { useState, useEffect } from "react";
import Button from "../Common/Button";
import api from "../../api/client";
import styles from "./Walk.module.css";

export default function CreateWalkModal({ myPets = [], onClose, onSubmit }) {
  const [organizerId, setOrganizerId] = useState("");
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [description, setDescription] = useState("");
  const [loadingFriends, setLoadingFriends] = useState(false);

  // Dès qu'on choisit un organisateur, on va chercher SES amis en base de données
  useEffect(() => {
    if (!organizerId) {
      setFriends([]);
      setSelectedFriends([]);
      return;
    }
    setLoadingFriends(true);
    api
      .get(`/pets/${organizerId}/friends`)
      .then((res) => setFriends(res.data))
      .catch((err) => console.error("Erreur amis", err))
      .finally(() => setLoadingFriends(false));
  }, [organizerId]);

  const toggleFriend = (id) => {
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // On appelle la fonction createWalk du Hook
    onSubmit(organizerId, selectedFriends, description);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Organiser une balade</h3>

        <form onSubmit={handleSubmit} className={styles.walkForm}>
          {/* 1. Sélection de l'organisateur */}
          <div className={styles.inputGroup}>
            <label>Qui organise la balade ? *</label>
            <select
              required
              value={organizerId}
              onChange={(e) => setOrganizerId(e.target.value)}
            >
              <option value="" disabled>
                Choisir un de vos animaux
              </option>
              {myPets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Description (Lieu / Heure) */}
          <div className={styles.inputGroup}>
            <label>Où et quand ? (Optionnel)</label>
            <input
              type="text"
              placeholder="Ex: Parc de la Tête d'Or à 18h"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* 3. Sélection des amis */}
          <div className={styles.inputGroup}>
            <label>Inviter des amis :</label>
            {!organizerId ? (
              <p className={styles.infoText}>
                Choisissez un organisateur d'abord.
              </p>
            ) : loadingFriends ? (
              <p className={styles.infoText}>Recherche des amis...</p>
            ) : friends.length > 0 ? (
              <div className={styles.friendsList}>
                {friends.map((friend) => (
                  <label key={friend.id} className={styles.friendOption}>
                    <input
                      type="checkbox"
                      checked={selectedFriends.includes(friend.id)}
                      onChange={() => toggleFriend(friend.id)}
                    />
                    <img
                      src={friend.imageUrl || "/default-pet.png"}
                      alt={friend.name}
                      className={styles.friendAvatar}
                    />
                    <span>{friend.name}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className={styles.infoText}>
                Cet animal n'a pas encore d'amis à inviter.
              </p>
            )}
          </div>

          {/* 4. Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
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
    </div>
  );
}
