import React, { useState } from "react";
import NotificationList from "./NotificationList";
import Button from "../Common/Button";
import Input from "../Common/Input";
import styles from "./SocialSection.module.css";

export default function SocialSection({ 
  onAcceptRequest, 
  onRejectRequest, 
  pendingRequests,
  pets, // Tes propres animaux pour le <select>
  mySelectedPetId, 
  setMySelectedPetId, 
  searchQuery, 
  setSearchQuery, 
  onSearch, 
  searchResults, 
  viewUserPets, 
  selectedUserPets, 
  sendFriendRequest 
}) {
  // --- ÉTATS LOCAUX POUR LA NAVIGATION DU TUNNEL ---
  const [currentStep, setCurrentStep] = useState('SEARCH'); // SEARCH | OWNER | DETAILS
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedTargetPet, setSelectedTargetPet] = useState(null);

  // --- LOGIQUE DE NAVIGATION ---
  const handleOwnerClick = async (user) => {
    setSelectedOwner(user);
    await viewUserPets(user.id); // Charge les animaux de cet humain
    setCurrentStep('OWNER');
  };

  const handlePetClick = (pet) => {
    setSelectedTargetPet(pet);
    setCurrentStep('DETAILS');
  };

  const goBack = () => {
    if (currentStep === 'DETAILS') {
      setCurrentStep('OWNER');
    } else {
      setCurrentStep('SEARCH');
      setSelectedOwner(null);
    }
  };

  return (
    <div className={styles.socialContainer}>
      {/* 1. NOTIFICATIONS (Toujours en haut) */}
      <NotificationList 
        requests={pendingRequests} 
        onAccept={onAcceptRequest} 
        onReject={onRejectRequest} 
      />

      {/* 2. ÉTAPE : RECHERCHE D'HUMAIN */}
      {currentStep === 'SEARCH' && (
        <div className={styles.searchSection}>
          <form onSubmit={onSearch} className={styles.searchBox}>
            <Input 
              placeholder="Rechercher un humain..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div className={styles.resultsList}>
            {searchResults && searchResults.map(user => (
              <div key={user.id} className={styles.userItem} onClick={() => handleOwnerClick(user)}>
                <span>👤 {user.name}</span>
                <span style={{color: '#3d5afe'}}>❯</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ÉTAPE : LISTE DES ANIMAUX DE L'HUMAIN SÉLECTIONNÉ */}
      {currentStep === 'OWNER' && (
        <div className={styles.stepContainer}>
          <button onClick={goBack} className={styles.backLink}>← Retour</button>
          <h4>Animaux de {selectedOwner?.name}</h4>
          <div className={styles.resultsList}>
            {selectedUserPets && selectedUserPets.map(pet => (
              <div key={pet.id} className={styles.petItem} onClick={() => handlePetClick(pet)}>
                <span>🐾 {pet.name}</span>
                <span style={{fontSize: '0.8rem', color: '#94a3b8'}}>{pet.species}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ÉTAPE : DÉTAILS ET DEMANDE D'AMI */}
      {currentStep === 'DETAILS' && (
        <div className={styles.stepContainer}>
          <button onClick={goBack} className={styles.backLink}>← Retour</button>
          <h4>{selectedTargetPet?.name}</h4>
          <div className={styles.actionCard}>
            <p className={styles.label}>Option A</p>
            <Button variant="ghost" disabled style={{width: '100%'}}>📖 Voir le profil</Button>
            
            <hr className={styles.divider} />
            
            <p className={styles.label}>Option B : Demande d'ami</p>
            <select 
              className={styles.petSelect}
              value={mySelectedPetId} 
              onChange={(e) => setMySelectedPetId(e.target.value)}
            >
              <option value="">Choisir mon animal...</option>
              {pets && pets.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <Button 
              variant="success" 
              onClick={() => {
                sendFriendRequest(selectedTargetPet.id);
                // Optionnel : revenir au début après l'envoi
                setCurrentStep('SEARCH');
              }}
              disabled={!mySelectedPetId}
              style={{width: '100%'}}
            >
              Envoyer la demande
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}