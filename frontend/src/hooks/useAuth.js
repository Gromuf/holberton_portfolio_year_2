import { useState } from "react";
import api from "../api/client";

export function useAuth(navigate) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", credentials);
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (err) {
      alert("Identifiants invalides");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", registerData);
      alert("Compte créé ! Connectez-vous.");
      navigate("/login");
    } catch (err) {
      alert("Erreur : " + (err.response?.data || "Échec de l'inscription"));
    }
  };

  return {
    credentials,
    setCredentials,
    registerData,
    setRegisterData,
    handleLogin,
    handleRegister,
  };
}
