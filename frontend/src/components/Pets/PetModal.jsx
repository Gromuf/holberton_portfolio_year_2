import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Common/Button";
import styles from "./PetModal.module.css"; // IMPORT MODIFIÉ

export default function PetModal({ pet, onClose, onDelete, onUpload }) {
  const navigate = useNavigate();

  if (!pet) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* EN-TÊTE : Photo et Infos basiques */}
        <div className={styles.modalHeader}>
          <div className={styles.modalAvatarSection}>
            <img
              src={pet.imageUrl || "/default-pet.png"}
              alt={pet.name}
              className={styles.modalImg}
            />
            <label className={styles.uploadBtn}>
              Modifier
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => onUpload(pet.id, e.target.files[0])}
              />
            </label>
          </div>

          <div className={styles.modalInfo}>
            <h2>{pet.name}</h2>
            <p className={styles.speciesText}>
              {pet.species} {pet.age ? `• ${pet.age} an(s)` : ""}
            </p>
            {pet.isWalking && (
              <span className={styles.badgeWalking}>En balade</span>
            )}
          </div>
        </div>

        {/* CORPS : Bio */}
        {pet.bio && (
          <div className={styles.modalBio}>
            <p>"{pet.bio}"</p>
          </div>
        )}

        {/* BOUTON : Voir le profil complet */}
        <div className={styles.modalActions}>
          <Button
            variant="action"
            className={styles.w100}
            onClick={() => {
              onClose();
              navigate(`/pet/${pet.id}`);
            }}
          >
            Voir le profil complet
          </Button>
        </div>

        {/* PIED DE PAGE : Actions destructrices et fermeture */}
        <div className={styles.modalFooter}>
          <button
            className={styles.deletePetBtn}
            onClick={() => {
              if (
                window.confirm("Voulez-vous vraiment supprimer cet animal ?")
              ) {
                onDelete(pet.id);
                onClose();
              }
            }}
          >
            Supprimer
          </button>
          <Button variant="ghost" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}
