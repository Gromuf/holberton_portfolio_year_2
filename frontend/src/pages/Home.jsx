import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Home() {
  const [pets, setPets] = useState([]);
  const [formData, setFormData] = useState({ name: "", species: "" });
  const navigate = useNavigate();

  // Charger les animaux au démarrage
  useEffect(() => {
    fetchMyPets();
  }, []);

  const fetchMyPets = async () => {
    try {
      const response = await api.get("/pets");
      setPets(response.data);
    } catch (err) {
      console.error("Erreur chargement", err);
    }
  };

  // Ajouter un nouvel animal
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
      setFormData({ name: "", species: "" }); // Reset form
      fetchMyPets(); // Refresh list
    } catch (err) {
      console.error("Erreur ajout pet", err);
    }
  };

  // Modifier l'image d'un animal existant
  const handleImageUpload = async (petId, file) => {
    if (!file) return;

    const imageData = new FormData();
    imageData.append("file", file);

    try {
      await api.post(`/pets/${petId}/upload-image`, imageData);
      alert("Image mise à jour !");
      fetchMyPets();
    } catch (err) {
      console.error("Erreur serveur détaillée :", err.response?.data);
      alert("Erreur lors de l'envoi de l'image.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Ma Session PetConnect</h1>
        <button
          onClick={logout}
          style={{
            backgroundColor: "red",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <hr />

      {/* --- FORMULAIRE D'AJOUT --- */}
      <section style={{ marginBottom: "40px" }}>
        <h3>Ajouter un nouvel animal</h3>
        <form onSubmit={handleAddPet} style={{ display: "flex", gap: "10px" }}>
          <input
            placeholder="Nom"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={{ padding: "8px", flex: 1 }}
          />
          <input
            placeholder="Espèce (Chien, Chat...)"
            value={formData.species}
            onChange={(e) =>
              setFormData({ ...formData, species: e.target.value })
            }
            required
            style={{ padding: "8px", flex: 1 }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 20px",
              cursor: "pointer",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Ajouter
          </button>
        </form>
      </section>

      {/* --- LISTE DES ANIMAUX --- */}
      <section>
        <h3>Mes animaux enregistrés</h3>
        <div style={{ display: "grid", gap: "15px" }}>
          {pets.length === 0 ? (
            <p>Vous n'avez pas encore d'animaux.</p>
          ) : (
            pets.map((pet) => (
              <div
                key={pet.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                {/* Photo + Upload */}
                <div style={{ textAlign: "center" }}>
                  <img
                    src={
                      pet.imageUrl || "/default-pet.png" // Image par défaut si aucune photo n'est disponible
                    }
                    alt={pet.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      display: "block",
                      marginBottom: "5px",
                      border: "2px solid #ddd",
                    }}
                  />
                  <label
                    style={{
                      fontSize: "11px",
                      color: "#007bff",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Changer la photo
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

                {/* Infos */}
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 5px 0", fontSize: "1.2rem" }}>
                    {pet.name}
                  </h4>
                  <p style={{ margin: "0 0 10px 0", color: "#555" }}>
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
    </div>
  );
}
