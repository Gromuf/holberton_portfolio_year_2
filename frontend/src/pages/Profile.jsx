import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import Button from "../components/Common/Button";
import PetForm from "../components/Pets/PetForm";
import { useProfile } from "../hooks/useProfile";
import styles from "./Profile.module.css";

export default function Profile() {
  const navigate = useNavigate();
  const { 
    userData, myPets, loading, isAddModalOpen, setIsAddModalOpen, 
    formData, setFormData, handleAddPet, handleDeletePet, handleLogout,
    isMyOwnProfile
  } = useProfile(navigate);

  return (
    <MainLayout 
      hideRightSidebar={true} 
      logout={handleLogout} 
      onAddPetClick={isMyOwnProfile ? () => setIsAddModalOpen(true) : null} 
    >
      <div className={styles.profileContainer}>
        
        {/* SECTION PARAMÈTRES : Masquée si ce n'est pas mon profil */}
        {isMyOwnProfile && (
          <div className={styles.settingsSection}>
            <h2 className={styles.sectionHeading}>MES PARAMÈTRES</h2>
            <div className={styles.userInfoRow}>
              <p><strong>Nom :</strong> {userData.name}</p>
              <p><strong>Email :</strong> {userData.email}</p>
            </div>
            <div className={styles.userActions}>
              <Button variant="outline">Modifier le mot de passe</Button>
              <button className={styles.deleteAccountBtn}>Supprimer mon compte</button>
            </div>
          </div>
        )}

        {/* Header simple pour le profil d'un autre */}
        {!isMyOwnProfile && (
          <div className={styles.settingsSection}>
            <h2 className={styles.sectionHeading}>PROFIL DE {userData.name.toUpperCase()}</h2>
            <p className={styles.userInfoRow}>Consultez les compagnons de cet utilisateur.</p>
          </div>
        )}

        <hr className={styles.divider} />

        {/* SECTION ANIMAUX */}
        <div className={styles.petsSection}>
          <h2 className={styles.sectionHeading}>
            {isMyOwnProfile ? "DÉTAILS DE MES ANIMAUX" : `LES ANIMAUX DE ${userData.name.toUpperCase()}`}
          </h2>
          
          {loading ? (
            <p className={styles.loadingText}>Chargement...</p>
          ) : myPets.length > 0 ? (
            <div className={styles.petsList}>
              {myPets.map(pet => (
                <div 
                  key={pet.id} 
                  className={styles.petDetailCard}
                  onClick={() => navigate(`/pet/${pet.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.petImageWrapper}>
                    <img src={pet.imageUrl || "/default-pet.png"} alt={pet.name} />
                  </div>
                  
                  <div className={styles.petInfoBody}>
                    <div className={styles.petHeader}>
                      <h3>{pet.name.toUpperCase()}</h3>
                    </div>
                    <p className={styles.petStats}>
                      Race : {pet.species} | Âge : {pet.age ? `${pet.age} ans` : "Non renseigné"}
                    </p>
                    {pet.bio && <p className={styles.petBio}>Description : {pet.bio}</p>}
                    <p className={styles.petFriendsCount}>{pet.friendsCount || 0} Ami(s)</p>
                    
                    {/* Bouton supprimer : Uniquement sur mon profil */}
                    {isMyOwnProfile && (
                      <div className={styles.petActions}>
                        <button 
                          className={styles.deleteBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePet(pet.id);
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.loadingText}>Aucun animal enregistré.</p>
          )}
        </div>
      </div>
      {isAddModalOpen && isMyOwnProfile && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Ajouter un compagnon</h3>
            <PetForm formData={formData} setFormData={setFormData} onSubmit={handleAddPet} />
            <button onClick={() => setIsAddModalOpen(false)} className={styles.cancelLink}>
              Annuler
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}