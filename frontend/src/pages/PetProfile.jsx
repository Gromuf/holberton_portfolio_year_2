import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import Button from "../components/Common/Button";
import { usePetProfile } from "../hooks/usePetProfile";
import api from "../api/client";
import styles from "./PetProfile.module.css";

export default function PetProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // AJOUT de fetchPetData ici pour qu'il soit reconnu plus bas
  const { 
    pet, friends, loading, isOwner, myPets, handleImageUpload, 
    isEditingBio, setIsEditingBio, tempBio, setTempBio, updatePetBio, fetchPetData 
  } = usePetProfile(id);

  const [selectedMyPetId, setSelectedMyPetId] = useState("");

  const isAlreadyFriend = friends.some(f => myPets.some(myP => myP.id === f.id));

  const handleSendRequest = async () => {
    if (!selectedMyPetId) return;
    try {
      await api.post("/friendships/request", {
        pet1: { id: parseInt(selectedMyPetId) },
        pet2: { id: parseInt(id) }
      });
      alert("Demande d'ami envoyée !");
      setSelectedMyPetId("");
    } catch (error) {
      console.error("Erreur demande ami:", error);
      alert("Erreur lors de l'envoi de la demande");
    }
  };

  const handleRemoveFriend = async (friend) => {
    if (window.confirm(`Voulez-vous vraiment supprimer l'amitié avec ${friend.name} ?`)) {
      try {
        await api.delete(`/friendships/${friend.friendshipId}`);
        // Maintenant cette fonction est bien définie[cite: 6]
        fetchPetData(); 
      } catch (error) {
        console.error("Erreur suppression amitié:", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <MainLayout hideRightSidebar={true} logout={handleLogout}><p className={styles.message}>Chargement...</p></MainLayout>;
  if (!pet) return <MainLayout hideRightSidebar={true} logout={handleLogout}><p className={styles.message}>Animal introuvable.</p></MainLayout>;

  return (
    <MainLayout hideRightSidebar={true} logout={handleLogout}>
      <div className={styles.petProfileContainer}>
        <div className={styles.headerSection}>
          <div className={styles.imageContainer}>
            <img src={pet.imageUrl || "/default-pet.png"} alt={pet.name} className={styles.petImage} />
            {isOwner && (
              <label className={styles.uploadBtn}>
                Changer la photo
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
              </label>
            )}
          </div>
          
          <div className={styles.petInfo}>
            <div className={styles.nameRow}>
              <h1>{pet.name.toUpperCase()}</h1>
              <p className={styles.ownerText}>
                Appartient à : <span className={styles.ownerLink} onClick={() => navigate(`/profile/${pet.owner?.id}`)}>{pet.owner?.name}</span>
              </p>
            </div>

            <p className={styles.tagline}>
              {pet.species} • {pet.age ? `${pet.age} ans` : "Age inconnu"}
            </p>
            
            <div className={styles.bioBox}>
              <div className={styles.bioHeader}>
                <h3>A propos</h3>
              </div>

              {isEditingBio ? (
                <div className={styles.editBioContainer}>
                  <textarea
                    className={styles.bioInput}
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                  />
                  <div className={styles.editBioActions}>
                    <Button variant="success" onClick={updatePetBio}>Enregistrer</Button>
                    <Button variant="ghost" onClick={() => setIsEditingBio(false)}>Annuler</Button>
                  </div>
                </div>
              ) : (
                <div className={styles.bioContentWrapper}>
                  <p className={styles.bioText}>{pet.bio || "Pas encore de description."}</p>
                  {isOwner && (
                    <Button variant="action" className={styles.editTriggerBtn} onClick={() => setIsEditingBio(true)}>
                      Modifier la description
                    </Button>
                  )}
                </div>
              )}
            </div>

            {!isOwner && !isAlreadyFriend && (
              <div className={styles.friendRequestBox}>
                <p className={styles.friendRequestLabel}>Devenir amis</p>
                <div className={styles.friendRequestActions}>
                  <select 
                    className={styles.petSelect}
                    value={selectedMyPetId}
                    onChange={(e) => setSelectedMyPetId(e.target.value)}
                  >
                    <option value="">Choisir mon animal...</option>
                    {myPets.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <Button variant="success" onClick={handleSendRequest} disabled={!selectedMyPetId}>
                    Envoyer
                  </Button>
                </div>
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
                  
                  {isOwner && (
                    <button 
                      className={styles.removeFriendBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFriend(friend);
                      }}
                    >
                      Supprimer
                    </button>
                  )}
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