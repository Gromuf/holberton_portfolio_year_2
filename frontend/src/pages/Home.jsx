import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Home() {
  const [pets, setPets] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedUserPets, setSelectedUserPets] = useState([]);
  const [mySelectedPetId, setMySelectedPetId] = useState("");
  const [formData, setFormData] = useState({ name: "", species: "" });
  
  // --- NOUVEAUX ÉTATS POUR LE PROFIL ET LES AMIS ---
  const [selectedPetForProfile, setSelectedPetForProfile] = useState(null);
  const [friendsList, setFriendsList] = useState([]);
  const [showFriends, setShowFriends] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMyData();
  }, []);

  const fetchMyData = async () => {
    try {
      const resPets = await api.get("/pets");
      const resReq = await api.get("/friendships/pending");
      const petsData = Array.isArray(resPets.data) ? resPets.data : (resPets.data?.pets || []);
      setPets(petsData);
      const reqData = Array.isArray(resReq.data) ? resReq.data : [];
      setPendingRequests(reqData);
    } catch (err) {
      console.error("Erreur chargement données", err);
      setPets([]);
      setPendingRequests([]);
    }
  };

  // --- NOUVELLES FONCTIONS DE GESTION ---
  
  const openProfile = async (pet) => {
    setSelectedPetForProfile(pet);
    setShowFriends(false); 
    try {
      const res = await api.get(`/friendships/pet/${pet.id}/friends`);
      setFriendsList(res.data);
    } catch (err) {
      console.error("Erreur chargement amis", err);
    }
  };

  const handleDeletePet = async (petId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet animal ?")) return;
    try {
      await api.delete(`/pets/${petId}`);
      fetchMyData();
    } catch (err) {
      console.error("Erreur suppression pet", err);
    }
  };

  const handleRemoveFriend = async (friendshipId) => {
    if (!window.confirm("Retirer cet ami ?")) return;
    try {
      await api.delete(`/friendships/${friendshipId}`);
      setFriendsList(friendsList.filter(f => f.friendshipId !== friendshipId));
    } catch (err) {
      console.error("Erreur suppression amitié", err);
    }
  };

  // --- FONCTIONS EXISTANTES ---

  const handleAddPet = async (e) => {
    e.preventDefault();
    try {
      const petData = {
        name: formData.name,
        species: formData.species,
        isWalking: false,
        imageUrl: "",
      };
      await api.post("/pets", petData);
      setFormData({ name: "", species: "" });
      fetchMyData();
    } catch (err) {
      console.error("Erreur ajout pet", err);
    }
  };

  const handleImageUpload = async (petId, file) => {
    if (!file) return;
    const imageData = new FormData();
    imageData.append("file", file);
    try {
      await api.post(`/pets/${petId}/upload-image`, imageData);
      alert("Image mise à jour !");
      fetchMyData();
    } catch (err) {
      console.error("Erreur upload", err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get(`/users/search?query=${searchQuery}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const viewUserPets = async (userId) => {
    try {
      const res = await api.get(`/pets/owner/${userId}`);
      setSelectedUserPets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendFriendRequest = async (targetPetId) => {
    if (!mySelectedPetId) {
      return alert("Sélectionnez lequel de vos animaux envoie la demande !");
    }
    try {
      const targetPet = selectedUserPets.find((p) => p.id === targetPetId);
      const myPet = pets.find((p) => p.id === parseInt(mySelectedPetId));

      const payload = {
        pet1: { id: myPet.id, name: myPet.name, species: myPet.species, isWalking: myPet.isWalking || false },
        pet2: { id: targetPet.id, name: targetPet.name, species: targetPet.species, isWalking: targetPet.isWalking || false },
        status: "PENDING",
      };

      await api.post("/friendships/request", payload);
      alert("Demande envoyée !");
      fetchMyData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Erreur lors de l'envoi.";
      alert(errorMsg);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await api.put(`/friendships/${requestId}/accept`);
      alert("Ami accepté !");
      fetchMyData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectRequest = async (requestId) => {
    if (!window.confirm("Refuser cette demande d'ami ?")) return;
    try {
      await api.delete(`/friendships/${requestId}`); 
      alert("Demande refusée.");
      fetchMyData();
    } catch (err) {
      console.error("Erreur rejet amitié", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "#e0e0e0", padding: "20px", fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* MODAL DE PROFIL */}
      {selectedPetForProfile && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", color: "#333", padding: "25px", borderRadius: "15px", width: "350px", textAlign: "center" }}>
            <img src={selectedPetForProfile.imageUrl || "/default-pet.png"} style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", marginBottom: "10px", border: "3px solid #3d5afe" }} alt="profil" />
            <h2 style={{ margin: "5px 0" }}>{selectedPetForProfile.name}</h2>
            <p style={{ color: "#666", marginBottom: "20px" }}>{selectedPetForProfile.species}</p>

            <button onClick={() => setShowFriends(!showFriends)} style={{ width: "100%", padding: "10px", backgroundColor: "#3d5afe", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", marginBottom: "10px" }}>
              {showFriends ? "Masquer les amis" : `Voir ses amis (${friendsList.length})`}
            </button>

            {showFriends && (
              <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #eee", padding: "10px", borderRadius: "5px", marginBottom: "15px", textAlign: "left" }}>
                {friendsList.length === 0 ? <p style={{ fontSize: "12px", textAlign: "center" }}>Aucun ami.</p> : 
                  friendsList.map(f => (
                    <div key={f.friendshipId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid #f9f9f9" }}>
                      <span style={{ fontSize: "14px" }}>🐾 {f.name}</span>
                      <button onClick={() => handleRemoveFriend(f.friendshipId)} style={{ color: "#cf6679", border: "none", background: "none", cursor: "pointer", fontSize: "11px" }}>Retirer</button>
                    </div>
                  ))
                }
              </div>
            )}
            <button onClick={() => setSelectedPetForProfile(null)} style={{ background: "none", border: "1px solid #ccc", padding: "8px 20px", borderRadius: "5px", cursor: "pointer" }}>Fermer</button>
          </div>
        </div>
      )}

      <header style={{ maxWidth: "1000px", margin: "0 auto 30px auto", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333", paddingBottom: "20px" }}>
        <h1 style={{ color: "#3d5afe" }}>Ma Session PetConnect</h1>
        <button onClick={logout} style={{ backgroundColor: "#cf6679", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Logout</button>
      </header>

      <main style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        
        {/* COLONNE GAUCHE : MES ANIMAUX */}
        <section>
          <h3>Ajouter un animal</h3>
          <form onSubmit={handleAddPet} style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
            <input placeholder="Nom" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={{ padding: "10px", flex: 1, borderRadius: "5px", border: "1px solid #333", backgroundColor: "#1e1e1e", color: "white" }} />
            <input placeholder="Espèce" value={formData.species} onChange={(e) => setFormData({ ...formData, species: e.target.value })} required style={{ padding: "10px", flex: 1, borderRadius: "5px", border: "1px solid #333", backgroundColor: "#1e1e1e", color: "white" }} />
            <button type="submit" style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", fontWeight: "bold" }}>Ajouter</button>
          </form>

          <h3>Mes animaux enregistrés</h3>
          <div style={{ display: "grid", gap: "15px" }}>
            {(!Array.isArray(pets) || pets.length === 0) ? (
              <p>Aucun animal trouvé.</p>
            ) : (
              pets.map((pet) => (
                <div key={pet.id} style={{ border: "1px solid #333", padding: "15px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "20px", backgroundColor: "#f5f5f5", color: "#333" }}>
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={pet.imageUrl || "/default-pet.png"}
                      alt={pet.name}
                      onClick={() => openProfile(pet)}
                      style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "2px solid #ddd", cursor: "pointer" }}
                    />
                    <label style={{ fontSize: "11px", color: "#007bff", cursor: "pointer", display: "block", marginTop: "5px" }}>
                      Changer
                      <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(pet.id, e.target.files[0])} />
                    </label>
                  </div>
                  <div style={{ flex: 1, cursor: "pointer" }} onClick={() => openProfile(pet)}>
                    <h4 style={{ margin: "0 0 5px 0" }}>{pet.name}</h4>
                    <p style={{ margin: "0 0 10px 0", color: "#666" }}>{pet.species}</p>
                    <span style={{ padding: "4px 8px", borderRadius: "12px", fontSize: "0.8rem", backgroundColor: pet.isWalking ? "#e8f5e9" : "#fff3e0", color: pet.isWalking ? "#2e7d32" : "#ef6c00", border: `1px solid ${pet.isWalking ? "#2e7d32" : "#ef6c00"}` }}>
                      {pet.isWalking ? "🏃 En balade" : "🏠 À la maison"}
                    </span>
                  </div>
                  <button onClick={() => handleDeletePet(pet.id)} style={{ background: "none", border: "none", color: "#cf6679", cursor: "pointer", fontSize: "20px" }}>🗑️</button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* COLONNE DROITE : RÉSEAU & RECHERCHE */}
        <section>
          {(Array.isArray(pets) && pets.length > 0) && (
            <div style={{ marginBottom: "25px", padding: "15px", backgroundColor: "#1e1e1e", borderRadius: "10px", border: "1px solid #3d5afe" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>🤝 Envoyer mes demandes en tant que :</label>
              <select value={mySelectedPetId} onChange={(e) => setMySelectedPetId(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "5px", backgroundColor: "#121212", color: "white", border: "1px solid #444" }}>
                <option value="">-- Choisir un de mes animaux --</option>
                {pets.map((p) => (<option key={p.id} value={p.id}>{p.name} ({p.species})</option>))}
              </select>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {(Array.isArray(pendingRequests) && pendingRequests.length > 0) && (
            <div style={{ backgroundColor: "#2c2200", border: "1px solid #664d03", color: "#ffecb3", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
              <h4 style={{ margin: "0 0 10px 0" }}>🔔 Demandes reçues</h4>
              {pendingRequests.map((req) => (
                <div key={req.id} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "10px", borderBottom: "1px solid #444", paddingBottom: "10px" }}>
                  <span><strong>{req.pet1.name}</strong> invite <strong>{req.pet2.name}</strong></span>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => handleAcceptRequest(req.id)} style={{ backgroundColor: "#03dac6", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", flex: 1 }}>Accepter</button>
                    <button onClick={() => handleRejectRequest(req.id)} style={{ backgroundColor: "#cf6679", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", flex: 1 }}>Refuser</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h3>Trouver des amis</h3>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <input style={{ flex: 1, padding: "10px", borderRadius: "5px", backgroundColor: "#1e1e1e", color: "white", border: "1px solid #333" }} placeholder="Rechercher un propriétaire..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button type="submit" style={{ backgroundColor: "#3d5afe", color: "white", border: "none", padding: "10px", borderRadius: "5px", cursor: "pointer" }}>🔍</button>
          </form>

          {searchResults.map((user) => (
            <div key={user.id} style={{ marginBottom: "10px" }}>
              <div onClick={() => viewUserPets(user.id)} style={{ padding: "12px", backgroundColor: "#1e1e1e", borderRadius: "8px", cursor: "pointer", border: "1px solid #333" }}>
                👤 {user.name} <small style={{ color: "#777" }}>({user.email})</small>
              </div>
              {selectedUserPets.length > 0 && selectedUserPets[0].owner.id === user.id && (
                <div style={{ marginLeft: "15px", borderLeft: "2px solid #3d5afe", paddingLeft: "10px", marginTop: "5px" }}>
                  {selectedUserPets.map((p) => (
                    <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#252525", padding: "8px", margin: "4px 0", borderRadius: "4px" }}>
                      <span>🐾 {p.name} ({p.species})</span>
                      <button onClick={() => sendFriendRequest(p.id)} style={{ fontSize: "11px", backgroundColor: "#3d5afe", color: "white", border: "none", borderRadius: "4px", padding: "5px 10px", cursor: "pointer", fontWeight: "bold" }}>Ajouter</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}