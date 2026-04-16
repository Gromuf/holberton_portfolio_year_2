import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css"; 
import { useHome } from "../hooks/useHome"; // Import du hook

// Composants
import Button from "../components/Common/Button";
import PetCard from "../components/Home/PetCard";
import PetModal from "../components/Home/PetModal";
import SocialSection from "../components/Home/SocialSection";
import PetForm from "../components/Home/PetForm";
import api from "../api/client";

export default function Home() {
  const navigate = useNavigate();
  
  const {
    pets, searchResults, searchQuery, setSearchQuery,
    pendingRequests, selectedUserPets, mySelectedPetId, setMySelectedPetId,
    formData, setFormData, selectedPetForProfile, setSelectedPetForProfile,
    friendsList, showFriends, setShowFriends,
    handleAddPet, handleDeletePet, handleImageUpload, openProfile,
    handleSearch, viewUserPets, sendFriendRequest, handleAcceptRequest, logout,
    fetchMyData
  } = useHome(navigate);

  return (
    <div className={styles.homeContainer}>
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

      <header className={styles.homeHeader}>
        <h1>PetConnect</h1>
        <Button variant="danger" onClick={logout}>Logout</Button>
      </header>

      <main className={styles.gridMain}>
        <section>
          <div className={styles.actionCard}>
            <h3 className={styles.sectionTitle}>Ajouter un animal</h3>
            <PetForm formData={formData} setFormData={setFormData} onSubmit={handleAddPet} />
          </div>

          <h3 className={styles.sectionTitle}>Mes animaux</h3>
          <div className={styles.listSection}>
            {pets.map(pet => (
              <PetCard key={pet.id} pet={pet} onOpen={openProfile} onDelete={handleDeletePet} onUpload={handleImageUpload} />
            ))}
          </div>
        </section>

        <SocialSection 
          pets={pets}
          mySelectedPetId={mySelectedPetId}
          setMySelectedPetId={setMySelectedPetId}
          pendingRequests={pendingRequests}
          onAccept={handleAcceptRequest}
          onReject={async (id) => { await api.delete(`/friendships/${id}`); fetchMyData(); }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          searchResults={searchResults}
          viewUserPets={viewUserPets}
          selectedUserPets={selectedUserPets}
          sendFriendRequest={sendFriendRequest}
        />
      </main>
    </div>
  );
}