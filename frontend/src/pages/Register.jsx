import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "", // Synchronisé avec private String name dans User.java
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", formData);
      alert("Compte créé avec succès ! Connectez-vous.");
      navigate("/login");
    } catch (err) {
      alert("Erreur : " + (err.response?.data || "Échec de l'inscription"));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Inscription</h2>
      <form
        onSubmit={handleRegister}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "300px",
        }}
      >
        <input
          type="text"
          placeholder="Nom complet"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe (min 6 car.)"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}
