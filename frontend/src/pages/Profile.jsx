import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import Button from "../components/Common/Button";
import { useProfile } from "../hooks/useProfile";
import styles from "./Profile.module.css";

export default function Profile() {
  const navigate = useNavigate();
  const { userData, myPets, loading, handleDeletePet, handleLogout } = useProfile(navigate);

  return (
    <MainLayout hideRightSidebar={true} logout={handleLogout}>
      <div className={styles.profileContainer}>
        
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

        <hr className={styles.divider} />

        <div className={styles.petsSection}>
          <h2 className={styles.sectionHeading}>DÉTAILS DE MES ANIMAUX</h2>
          
          {loading ? (
            <p className={styles.loadingText}>Chargement de vos animaux...</p>
          ) : myPets.length > 0 ? (
            <div className={styles.petsList}>
              {myPets.map(pet => (
                <div key={pet.id} className={styles.petDetailCard}>
                  
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
                    
                    {pet.bio && (
                      <p className={styles.petBio}>Description : {pet.bio}</p>
                    )}
                    
                    <p className={styles.petFriendsCount}>
                      12 Amis
                    </p>
                    
                    <div className={styles.petActions}>
                      <button className={styles.editBtn}>Modifier les infos</button>
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => handleDeletePet(pet.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.loadingText}>Vous n'avez pas encore enregistré d'animaux.</p>
          )}
        </div>

      </div>
    </MainLayout>
  );
}