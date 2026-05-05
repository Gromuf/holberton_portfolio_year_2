import { useState, useEffect } from "react";
import api from "../api/client";

export function usePetProfile(petId) {
  const [pet, setPet] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [myPets, setMyPets] = useState([]);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState("");

  useEffect(() => {
    if (petId) fetchPetData();
  }, [petId]);

  const fetchPetData = async () => {
    try {
      setLoading(true);
      const myPetsRes = await api.get("/pets");
      const myOwnPets = Array.isArray(myPetsRes.data) ? myPetsRes.data : [];
      setMyPets(myOwnPets);

      const petRes = await api.get(`/pets/${petId}`);
      setPet(petRes.data);
      setTempBio(petRes.data.bio || "");

      const ownsThisPet = myOwnPets.some((p) => p.id === parseInt(petId));
      setIsOwner(ownsThisPet);

      const friendsRes = await api.get(`/friendships/pet/${petId}/friends`);
      setFriends(friendsRes.data);
    } catch (error) {
      console.error("Erreur récupération profil:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePetBio = async () => {
    try {
      const payload = {
        id: pet.id,
        name: pet.name,
        species: pet.species,
        age: pet.age,
        bio: tempBio,
        imageUrl: pet.imageUrl,
        walking: pet.walking ?? pet.isWalking ?? false,
        isWalking: pet.isWalking ?? pet.walking ?? false,
      };

      await api.put(`/pets/${petId}`, payload);
      setIsEditingBio(false);
      fetchPetData();
    } catch (error) {
      console.error("Erreur mise à jour:", error.response?.data);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    try {
      await api.post(`/pets/${petId}/upload-image`, data);
      fetchPetData();
    } catch (error) {
      console.error("Erreur upload:", error);
    }
  };

  // Retourne toutes les fonctions et etats pour le composant
  return {
    pet,
    friends,
    loading,
    isOwner,
    myPets,
    isEditingBio,
    setIsEditingBio,
    tempBio,
    setTempBio,
    updatePetBio,
    handleImageUpload,
    fetchPetData, // <--- C'ETAIT CETTE LIGNE MANQUANTE
  };
}
