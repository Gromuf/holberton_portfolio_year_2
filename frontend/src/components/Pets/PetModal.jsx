import React from "react";
import Button from "../Common/Button";
import "./PetModal.css";

export default function PetModal({ 
  pet, 
  friends, 
  showFriends, 
  setShowFriends, 
  onRemoveFriend, 
  onClose,
  onDelete,  // Nouvel ajout : pour supprimer depuis la modale
  onUpload   // Nouvel ajout : pour changer la photo depuis la modale
}) {
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
            {/* Bouton d'upload caché derrière un label */}
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

        {/* SECTION AMIS */}
        <div className="modal-friends-section">
          <Button 
            variant="action" 
            className="w-100 mb-10 toggle-friends-btn"
            onClick={() => setShowFriends(!showFriends)}
          >
            {showFriends ? "Masquer les amis" : `Voir ses amis (${friends.length})`}
          </Button>

          {showFriends && (
            <div className="friends-scroll-box">
              {friends.length === 0 ? (
                <p className="no-friends">Aucun ami pour le moment.</p>
              ) : (
                friends.map((f) => (
                  <div key={f.friendshipId} className="friend-list-item">
                    <span>{f.name}</span>
                    <button 
                      className="btn-remove"
                      onClick={() => onRemoveFriend(f.friendshipId)}
                    >
                      Retirer
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
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
          Supprimer l'animal
          </button>
          <Button variant="ghost" onClick={onClose} className="close-btn">
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}