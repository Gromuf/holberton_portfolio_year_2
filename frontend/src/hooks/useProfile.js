import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

export function useProfile(navigate) {
  const { userId } = useParams();
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

  // Détermine si on est sur son propre profil ou celui d'un autre
  const isMyOwnProfile = !userId;

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      // 1. Appel vers UserController.java (@GetMapping("/{id}"))
      const userEndpoint = isMyOwnProfile
        ? "/users/profile/me"
        : `/users/${userId}`;
      const userRes = await api.get(userEndpoint);
      setUserData(userRes.data);

      // 2. Appel vers PetController.java (@GetMapping("/owner/{ownerId}"))
      const petsEndpoint = isMyOwnProfile ? "/pets" : `/pets/owner/${userId}`;
      const petsRes = await api.get(petsEndpoint);
      const basicPets = Array.isArray(petsRes.data) ? petsRes.data : [];

      // 3. Récupération du nombre d'amis
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
      console.error("Erreur chargement profil:", error);
      setUserData({ name: "Utilisateur introuvable", email: "N/A" });
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
        console.error("Erreur suppression :", error);
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
    isMyOwnProfile,
  };
}
