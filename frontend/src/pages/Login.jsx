import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", credentials);
      // On stocke le token JWT renvoyé par ton AuthController
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (err) {
      alert("Identifiants invalides");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Connexion</h2>
      <form
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "300px",
        }}
      >
        <input
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          required
        />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}
