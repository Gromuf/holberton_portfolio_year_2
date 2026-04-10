import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client"; // Ton instance axios configurée

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
      // On récupère les animaux (le backend filtrera selon l'utilisateur via le token)
      const response = await api.get("/pets");
      setPets(response.data);
    } catch (err) {
      console.error("Erreur de chargement", err);
    }
  };

  const handleAddPet = async (e) => {
    e.preventDefault();

    const petData = {
      name: formData.name,
      species: formData.species,
      isWalking: false, // Inutile techniquement car géré par le défaut Java, mais sécurisant
      imageUrl: "", // On laisse vide, pourra être modifié via l'upload plus tard
    };

    try {
      // On utilise 'api' (et non axios brut) pour inclure les headers/token
      const response = await api.post("/pets", petData);

      console.log("Pet ajouté avec succès !", response.data);

      // 1. On vide le formulaire
      setFormData({ name: "", species: "" });

      // 2. On rafraîchit la liste pour voir le nouveau pet
      fetchMyPets();
    } catch (error) {
      // On affiche les détails de l'erreur 400 ou 403 pour débugger
      console.error(
        "Détails de l'erreur :",
        error.response?.data || error.message,
      );
      alert("Erreur lors de l'ajout de l'animal.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId"); // Optionnel
    navigate("/");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Ma Session PetConnect</h1>
      <button
        onClick={logout}
        style={{
          backgroundColor: "#ff4d4d",
          color: "white",
          border: "none",
          padding: "8px 15px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Déconnexion
      </button>

      <hr style={{ margin: "20px 0" }} />

      <h3>Ajouter un animal</h3>
      <form
        onSubmit={handleAddPet}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <input
          placeholder="Nom de l'animal"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          style={{ padding: "8px" }}
        />
        <input
          placeholder="Espèce (Chien, Chat...)"
          value={formData.species}
          onChange={(e) =>
            setFormData({ ...formData, species: e.target.value })
          }
          required
          style={{ padding: "8px" }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Ajouter à mes animaux
        </button>
      </form>

      <h3>Mes animaux enregistrés</h3>
      {pets.length === 0 ? (
        <p>Aucun animal trouvé.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {pets.map((pet) => (
            <li
              key={pet.id}
              style={{
                padding: "10px",
                borderBottom: "1px solid #eee",
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >
              {pet.imageUrl ? (
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                  }}
                >
                  N/A
                </div>
              )}
              <div>
                <strong>{pet.name}</strong>{" "}
                <span style={{ color: "#666" }}>({pet.species})</span>
                <br />
                <small style={{ color: pet.isWalking ? "green" : "orange" }}>
                  {pet.isWalking ? "● En balade" : "○ Au repos"}
                </small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
