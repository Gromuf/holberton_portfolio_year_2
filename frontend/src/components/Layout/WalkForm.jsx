import React, { useState } from "react";
import Button from "../Common/Button";
import styles from "./SidebarLeft.module.css";

export default function WalkForm({ pets = [], onStart, onCancel }) {
  const [selectedPetIds, setSelectedPetIds] = useState([]);

  const togglePet = (id) => {
    const numericId = Number(id);
    setSelectedPetIds(prev => 
      prev.includes(numericId) ? prev.filter(pId => pId !== numericId) : [...prev, numericId]
    );
  };

  return (
    <div className={styles.walkForm}>
      <h4 className={styles.formTitle}>Qui part en balade ?</h4>
      <div className={styles.multiSelect}>
        {pets && pets.length > 0 ? (
          pets.map(pet => (
            <label key={pet.id} className={styles.petOption}>
              <input 
                type="checkbox" 
                checked={selectedPetIds.includes(Number(pet.id))}
                onChange={() => togglePet(pet.id)}
              />
              <span className={pet.isWalking ? styles.isWalkingLabel : styles.petName}>
                {pet.name} {pet.isWalking && "🐾"}
              </span>
            </label>
          ))
        ) : (
          <p className={styles.noPetText}>Aucun animal trouvé</p>
        )}
      </div>
      
      <div className={styles.formActions}>
        <Button 
          variant="success" 
          onClick={() => onStart(selectedPetIds)}
          disabled={selectedPetIds.length === 0}
        >
          C'est parti !
        </Button>
        <button className={styles.cancelLink} onClick={onCancel}>
          Annuler
        </button>
      </div>
    </div>
  );
}