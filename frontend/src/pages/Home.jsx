import React from "react";
import { useNavigate } from "react-router-dom";
import { useHome } from "../hooks/useHome";
import api from "../api/client";

// On utilise maintenant le Layout global
import MainLayout from "../components/Layout/MainLayout";

// Composants métiers
import PetCard from "../components/Pets/PetCard";
import PetModal from "../components/Pets/PetModal";
import PetForm from "../components/Pets/PetForm";

// --- IMPORT DU CSS MODULE ---
import styles from "./Home.module.css";

export default function Home() {
  const navigate = useNavigate();

  // On extrait la logique de ton hook useHome
  const {
    pets,
    searchResults,
    searchQuery,
    setSearchQuery,
    pendingRequests,
    selectedUserPets,
    mySelectedPetId,
    setMySelectedPetId,
    formData,
    setFormData,
    selectedPetForProfile,
    setSelectedPetForProfile,
    friendsList,
    showFriends,
    setShowFriends,
    handleAddPet,
    handleDeletePet,
    handleImageUpload,
    openProfile,
    handleSearch,
    viewUserPets,
    sendFriendRequest,
    handleAcceptRequest,
    logout,
    fetchMyData,
  } = useHome(navigate);

  // Harmonisation des noms pour le "câblage"
  const socialProps = {
    pets,
    mySelectedPetId,
    setMySelectedPetId,
    pendingRequests,
    onAcceptRequest: handleAcceptRequest,
    onRejectRequest: async (id) => {
      try {
        await api.delete(`/friendships/${id}`);
        fetchMyData(); // Rafraîchit les données après suppression
      } catch (error) {
        console.error("Erreur lors du refus de la demande :", error);
      }
    },
    searchQuery,
    setSearchQuery,
    onSearch: handleSearch,
    searchResults,
    viewUserPets,
    selectedUserPets,
    sendFriendRequest,
  };

  return (
    <MainLayout 
      onAddPetClick={() => setSelectedPetForProfile("new")} 
      logout={logout}
      {...socialProps}
    >
      {/* --- UTILISATION DE LA CLASSE petGrid DU MODULE --- */}
      <div className={styles.petGrid}>
        {pets.length > 0 ? (
          pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onOpen={openProfile}
              // onDelete et onUpload retirés car gérés ailleurs maintenant
            />
          ))
        ) : (
          <p style={{ color: "#94a3b8", textAlign: "center", padding: "20px", width: "100%" }}>
            Aucun animal trouvé. Cliquez sur "+" à gauche pour commencer !
          </p>
        )}
      </div>

      {/* Modal de profil/amis (si un animal est sélectionné) */}
      {selectedPetForProfile && selectedPetForProfile !== "new" && (
        <PetModal
          pet={selectedPetForProfile}
          friends={friendsList}
          showFriends={showFriends}
          setShowFriends={setShowFriends}
          onRemoveFriend={async (fid) => {
            await api.delete(`/friendships/${fid}`);
            openProfile(selectedPetForProfile);
          }}
          onClose={() => setSelectedPetForProfile(null)}
          // --- AJOUTE CES DEUX LIGNES : ---
          onDelete={handleDeletePet}
          onUpload={handleImageUpload}
        />
      )}

      {/* Modal de création d'un nouvel animal */}
      {selectedPetForProfile === "new" && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Ajouter un compagnon</h3>
            <PetForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={async (e) => {
                await handleAddPet(e);
                setSelectedPetForProfile(null);
              }}
            />
            <button 
              onClick={() => setSelectedPetForProfile(null)}
              style={{ 
                marginTop: "15px", 
                background: "none", 
                border: "none", 
                color: "#94a3b8", 
                cursor: "pointer",
                textDecoration: "underline" 
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}