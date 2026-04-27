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

export default function Home() {
  const navigate = useNavigate();

  // On extrait TOUTE la logique de ton hook useHome
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

  // On regroupe les fonctions pour la SocialSection (Sidebar droite)
  const socialProps = {
    pets,
    mySelectedPetId,
    setMySelectedPetId,
    pendingRequests,
    onAccept: handleAcceptRequest,
    onReject: async (id) => {
      await api.delete(`/friendships/${id}`);
      fetchMyData();
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
      {/* Flux central des animaux */}
      <div className="pet-grid">
        {pets.length > 0 ? (
          pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onOpen={openProfile}
              onDelete={handleDeletePet}
              onUpload={handleImageUpload}
            />
          ))
        ) : (
          <p style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}>
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
        />
      )}
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
              style={{ marginTop: "15px", background: "none", border: "none", color: "#666", cursor: "pointer" }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}