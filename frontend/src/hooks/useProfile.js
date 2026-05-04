import { useState, useEffect } from "react";
import api from "../api/client";

export function useProfile(navigate) {
  const [userData, setUserData] = useState({
    name: "Chargement...",
    email: "...",
  });
  const [myPets, setMyPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const userRes = await api.get("/users/profile/me").catch(() => ({
        data: { name: "Erreur", email: "erreur" },
      }));
      setUserData(userRes.data);

      const petsRes = await api.get("/pets");
      setMyPets(petsRes.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet animal ?")) {
      try {
        await api.delete(`/pets/${id}`);
        setMyPets(myPets.filter((pet) => pet.id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return {
    userData,
    myPets,
    loading,
    handleDeletePet,
    handleLogout,
  };
}
