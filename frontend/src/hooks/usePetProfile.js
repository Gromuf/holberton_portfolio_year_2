import { useState, useEffect } from "react";
import api from "../api/client";

export function usePetProfile(petId) {
  const [pet, setPet] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [myPets, setMyPets] = useState([]); // Pour le menu déroulant de demande d'ami

  useEffect(() => {
    if (petId) {
      fetchPetData();
    }
  }, [petId]);

  const fetchPetData = async () => {
    try {
      setLoading(true);

      // 1. Récupérer les animaux de l'utilisateur connecté
      const myPetsRes = await api.get("/pets");
      const myOwnPets = Array.isArray(myPetsRes.data)
        ? myPetsRes.data
        : myPetsRes.data?.pets || [];
      setMyPets(myOwnPets);

      // 2. Récupérer les infos de l'animal consulté
      const petRes = await api.get(`/pets/${petId}`);
      const fetchedPet = petRes.data;
      setPet(fetchedPet);

      // 3. Vérifier si l'utilisateur courant possède cet animal
      const ownsThisPet = myOwnPets.some((p) => p.id === parseInt(petId));
      setIsOwner(ownsThisPet);

      // 4. Récupérer les amis de cet animal
      const friendsRes = await api.get(`/friendships/pet/${petId}/friends`);
      setFriends(friendsRes.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du profil de l'animal :",
        error,
      );
    } finally {
      setLoading(false);
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
      console.error("Erreur lors de l'upload de l'image :", error);
      alert("Erreur lors du changement de la photo.");
    }
  };

  return {
    pet,
    friends,
    loading,
    isOwner,
    myPets,
    handleImageUpload,
  };
}
