import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Common/Button";
import "./PetModal.css";

export default function PetModal({ 
  pet, 
  onClose,
  onDelete,
  onUpload 
}) {
  const navigate = useNavigate();

  if (!pet) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* EN-TÊTE : Photo et Infos basiques */}
        <div className="modal-header">
          <div className="modal-avatar-section">
            <img 
              src={pet.imageUrl || "/default-pet.png"} 
              alt={pet.name} 
              className="modal-img"
            />
            <label className="upload-btn">
              Modifier
              <input 
                type="file" 
                hidden 
                accept="image/*" 
                onChange={(e) => onUpload(pet.id, e.target.files[0])} 
              />
            </label>
          </div>
          
          <div className="modal-info">
            <h2>{pet.name}</h2>
            <p className="species-text">
              {pet.species} {pet.age ? `• ${pet.age} an(s)` : ""}
            </p>
            {pet.isWalking && (
              <span className="badge-walking">En balade</span>
            )}
          </div>
        </div>

        {/* CORPS : Bio */}
        {pet.bio && (
          <div className="modal-bio">
            <p>"{pet.bio}"</p>
          </div>
        )}

        {/* BOUTON : Voir le profil complet */}
        <div className="modal-actions">
          <Button 
            variant="action" 
            className="w-100"
            onClick={() => {
              onClose(); // Ferme la modale
              navigate(`/pet/${pet.id}`); // Redirige vers la page du profil
            }}
          >
          Voir le profil complet
          </Button>
        </div>

        {/* PIED DE PAGE : Actions destructrices et fermeture */}
        <div className="modal-footer">
          <button 
            className="delete-pet-btn" 
            onClick={() => {
              if (window.confirm("Voulez-vous vraiment supprimer cet animal ?")) {
                onDelete(pet.id);
                onClose();
              }
            }}
          >
          Supprimer
          </button>
          <Button variant="ghost" onClick={onClose} className="close-btn">
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}