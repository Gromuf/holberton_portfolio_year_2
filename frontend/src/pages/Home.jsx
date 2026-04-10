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
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyData();
  }, []);

  const fetchMyData = async () => {
    try {
      const resPets = await api.get("/pets");
      setPets(resPets.data);
      const resReq = await api.get("/friendships/pending");
      setPendingRequests(resReq.data);
    } catch (err) {
      console.error("Erreur chargement données", err);
    }
  };

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
      // On récupère l'animal cible dans la liste de recherche pour avoir ses infos
      const targetPet = selectedUserPets.find((p) => p.id === targetPetId);
      // On récupère ton animal sélectionné
      const myPet = pets.find((p) => p.id === parseInt(mySelectedPetId));

      const payload = {
        pet1: {
          id: myPet.id,
          name: myPet.name,
          species: myPet.species,
          isWalking: myPet.isWalking || false, // Évite le null
        },
        pet2: {
          id: targetPet.id,
          name: targetPet.name,
          species: targetPet.species,
          isWalking: targetPet.isWalking || false, // Évite le null
        },
        status: "PENDING",
      };

      await api.post("/friendships/request", payload);

      alert("Demande envoyée !");
      fetchMyData();
    } catch (err) {
      console.error("Erreur Backend:", err.response?.data);
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

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      style={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        color: "#e0e0e0",
        padding: "20px",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <header
        style={{
          maxWidth: "1000px",
          margin: "0 auto 30px auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #333",
          paddingBottom: "20px",
        }}
      >
        <h1 style={{ color: "#3d5afe" }}>Ma Session PetConnect</h1>
        <button
          onClick={logout}
          style={{
            backgroundColor: "#cf6679",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </header>

      <main
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
        }}
      >
        {/* COLONNE GAUCHE : MES ANIMAUX */}
        <section>
          <h3>Ajouter un animal</h3>
          <form
            onSubmit={handleAddPet}
            style={{ display: "flex", gap: "10px", marginBottom: "30px" }}
          >
            <input
              placeholder="Nom"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              style={{
                padding: "10px",
                flex: 1,
                borderRadius: "5px",
                border: "1px solid #333",
                backgroundColor: "#1e1e1e",
                color: "white",
              }}
            />
            <input
              placeholder="Espèce"
              value={formData.species}
              onChange={(e) =>
                setFormData({ ...formData, species: e.target.value })
              }
              required
              style={{
                padding: "10px",
                flex: 1,
                borderRadius: "5px",
                border: "1px solid #333",
                backgroundColor: "#1e1e1e",
                color: "white",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontWeight: "bold",
              }}
            >
              Ajouter
            </button>
          </form>

          <h3>Mes animaux enregistrés</h3>
          <div style={{ display: "grid", gap: "15px" }}>
            {pets.length === 0 ? (
              <p>Aucun animal trouvé.</p>
            ) : (
              pets.map((pet) => (
                <div
                  key={pet.id}
                  style={{
                    border: "1px solid #333",
                    padding: "15px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    backgroundColor: "#f5f5f5", // Fond clair pour les cartes
                    color: "#333", // Texte sombre pour lisibilité sur fond clair
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    {/* UTILISATION DE TON IMAGE PAR DÉFAUT LOCALE ICI */}
                    <img
                      src={pet.imageUrl || "/default-pet.png"}
                      alt={pet.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #ddd",
                      }}
                    />
                    <label
                      style={{
                        fontSize: "11px",
                        color: "#007bff",
                        cursor: "pointer",
                        display: "block",
                        marginTop: "5px",
                      }}
                    >
                      Changer
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload(pet.id, e.target.files[0])
                        }
                      />
                    </label>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 5px 0" }}>{pet.name}</h4>
                    <p style={{ margin: "0 0 10px 0", color: "#666" }}>
                      {pet.species}
                    </p>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "0.8rem",
                        backgroundColor: pet.isWalking ? "#e8f5e9" : "#fff3e0",
                        color: pet.isWalking ? "#2e7d32" : "#ef6c00",
                        border: `1px solid ${pet.isWalking ? "#2e7d32" : "#ef6c00"}`,
                      }}
                    >
                      {pet.isWalking ? "🏃 En balade" : "🏠 À la maison"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* COLONNE DROITE : RÉSEAU & RECHERCHE */}
        <section>
          {/* SÉLECTEUR D'IDENTITÉ */}
          {pets.length > 0 && (
            <div
              style={{
                marginBottom: "25px",
                padding: "15px",
                backgroundColor: "#1e1e1e",
                borderRadius: "10px",
                border: "1px solid #3d5afe",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                }}
              >
                🤝 Envoyer mes demandes en tant que :
              </label>
              <select
                value={mySelectedPetId}
                onChange={(e) => setMySelectedPetId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  backgroundColor: "#121212",
                  color: "white",
                  border: "1px solid #444",
                }}
              >
                <option value="">-- Choisir un de mes animaux --</option>
                {pets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.species})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {pendingRequests.length > 0 && (
            <div
              style={{
                backgroundColor: "#2c2200",
                border: "1px solid #664d03",
                color: "#ffecb3",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              <h4 style={{ margin: "0 0 10px 0" }}>🔔 Demandes reçues</h4>
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "14px",
                    marginBottom: "8px",
                    borderBottom: "1px solid #444",
                    paddingBottom: "5px",
                  }}
                >
                  <span>
                    <strong>{req.pet1.name}</strong> invite{" "}
                    <strong>{req.pet2.name}</strong>
                  </span>
                  <button
                    onClick={() => handleAcceptRequest(req.id)}
                    style={{
                      backgroundColor: "#03dac6",
                      border: "none",
                      padding: "4px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Accepter
                  </button>
                </div>
              ))}
            </div>
          )}

          <h3>Trouver des amis</h3>
          <form
            onSubmit={handleSearch}
            style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
          >
            <input
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: "#1e1e1e",
                color: "white",
                border: "1px solid #333",
              }}
              placeholder="Rechercher un propriétaire..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              style={{
                backgroundColor: "#3d5afe",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              🔍
            </button>
          </form>

          {searchResults.map((user) => (
            <div key={user.id} style={{ marginBottom: "10px" }}>
              <div
                onClick={() => viewUserPets(user.id)}
                style={{
                  padding: "12px",
                  backgroundColor: "#1e1e1e",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border: "1px solid #333",
                }}
              >
                👤 {user.name}{" "}
                <small style={{ color: "#777" }}>({user.email})</small>
              </div>

              {selectedUserPets.length > 0 &&
                selectedUserPets[0].owner.id === user.id && (
                  <div
                    style={{
                      marginLeft: "15px",
                      borderLeft: "2px solid #3d5afe",
                      paddingLeft: "10px",
                      marginTop: "5px",
                    }}
                  >
                    {selectedUserPets.map((p) => (
                      <div
                        key={p.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          backgroundColor: "#252525",
                          padding: "8px",
                          margin: "4px 0",
                          borderRadius: "4px",
                        }}
                      >
                        <span>
                          🐾 {p.name} ({p.species})
                        </span>
                        <button
                          onClick={() => sendFriendRequest(p.id)}
                          style={{
                            fontSize: "11px",
                            backgroundColor: "#3d5afe",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "5px 10px",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          Ajouter
                        </button>
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
