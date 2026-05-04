import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import Button from "../components/Common/Button";
import { usePetProfile } from "../hooks/usePetProfile";
import styles from "./PetProfile.module.css";

export default function PetProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pet, friends, loading, isOwner, myPets, handleImageUpload, sendFriendRequest } = usePetProfile(id);
  const handleLogout = () => {
	localStorage.removeItem("token");
	navigate("/login");
  };
  const [selectedMyPetId, setSelectedMyPetId] = useState("");

  if (loading) {
    return (
      <MainLayout logout={handleLogout}>
        <p className={styles.message}>Chargement du profil de l'animal...</p>
      </MainLayout>
    );
  }

  if (!pet) {
    return (
      <MainLayout logout={handleLogout}>
        <p className={styles.message}>Animal introuvable.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout logout={handleLogout}>
      <div className={styles.petProfileContainer}>
        
        <div className={styles.headerSection}>
          <div className={styles.imageContainer}>
            <img 
              src={pet.imageUrl || "/default-pet.png"} 
              alt={pet.name} 
              className={styles.petImage} 
            />
            {isOwner && (
              <label className={styles.uploadBtn}>
                📷 Changer la photo
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  style={{ display: "none" }} 
                />
              </label>
            )}
          </div>
          
          <div className={styles.petInfo}>
            <h1>{pet.name.toUpperCase()}</h1>
            <p className={styles.tagline}>{pet.species} • {pet.age ? `${pet.age} ans` : "Âge inconnu"}</p>
            
            <div className={styles.bioBox}>
              <p><strong>À propos :</strong></p>
              <p>{pet.bio || "Pas encore de description pour ce compagnon."}</p>
            </div>
            
            {!isOwner && (
              <div className={styles.actionBox}>
                <select 
                  value={selectedMyPetId} 
                  onChange={(e) => setSelectedMyPetId(e.target.value)}
                  className={styles.petSelect}
                >
                  <option value="">Choisir mon animal...</option>
                  {myPets.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <Button 
                  variant="success" 
                  disabled={!selectedMyPetId}
                  onClick={() => sendFriendRequest(selectedMyPetId)}
                >
                  Demander en ami
                </Button>
              </div>
            )}
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.friendsSection}>
          <h2>LES AMIS DE {pet.name.toUpperCase()} ({friends.length})</h2>
          
          {friends.length > 0 ? (
            <div className={styles.friendsGrid}>
              {friends.map(friend => (
                <div 
                  key={friend.id} 
                  className={styles.friendCard}
                  onClick={() => navigate(`/pet/${friend.id}`)}
                >
                  <img src={friend.imageUrl || "/default-pet.png"} alt={friend.name} />
                  <p>{friend.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noFriendsText}>Aucun ami pour le moment.</p>
          )}
        </div>

      </div>
    </MainLayout>
  );
}