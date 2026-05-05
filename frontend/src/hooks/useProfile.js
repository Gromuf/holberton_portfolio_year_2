import { useState, useEffect } from "react";
import api from "../api/client";

export function useProfile(navigate) {
  const [userData, setUserData] = useState({
    name: "Chargement...",
    email: "...",
  });
  const [myPets, setMyPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    age: "",
    bio: "",
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // 1. Récupérer les infos utilisateur
      const userRes = await api.get("/users/profile/me").catch(() => ({
        data: { name: "Erreur", email: "erreur" },
      }));
      setUserData(userRes.data);

      // 2. Récupérer les animaux de l'utilisateur
      const petsRes = await api.get("/pets");
      const basicPets = Array.isArray(petsRes.data) ? petsRes.data : [];

      // 3. Récupérer dynamiquement le nombre d'amis pour chaque animal
      const petsWithFriends = await Promise.all(
        basicPets.map(async (pet) => {
          try {
            const friendsRes = await api.get(
              `/friendships/pet/${pet.id}/friends`,
            );
            return { ...pet, friendsCount: friendsRes.data.length };
          } catch (err) {
            return { ...pet, friendsCount: 0 };
          }
        }),
      );

      setMyPets(petsWithFriends);
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

  const handleAddPet = async (e) => {
    e.preventDefault();
    try {
      await api.post("/pets", { ...formData, isWalking: false, imageUrl: "" });
      setFormData({ name: "", species: "", age: "", bio: "" });
      setIsAddModalOpen(false);
      fetchProfileData();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout de l'animal");
    }
  };

  return {
    userData,
    myPets,
    loading,
    isAddModalOpen,
    setIsAddModalOpen,
    formData,
    setFormData,
    handleAddPet,
    handleDeletePet,
    handleLogout,
  };
}
