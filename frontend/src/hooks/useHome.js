import { useState, useEffect } from "react";
import api from "../api/client";

export function useHome(navigate) {
  const [pets, setPets] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedUserPets, setSelectedUserPets] = useState([]);
  const [mySelectedPetId, setMySelectedPetId] = useState("");
  const [formData, setFormData] = useState({ name: "", species: "" });
  const [selectedPetForProfile, setSelectedPetForProfile] = useState(null);
  const [friendsList, setFriendsList] = useState([]);
  const [showFriends, setShowFriends] = useState(false);

  useEffect(() => {
    fetchMyData();
  }, []);

  const fetchMyData = async () => {
    try {
      const resPets = await api.get("/pets");
      const resReq = await api.get("/friendships/pending");
      setPets(
        Array.isArray(resPets.data) ? resPets.data : resPets.data?.pets || [],
      );
      setPendingRequests(Array.isArray(resReq.data) ? resReq.data : []);
    } catch (err) {
      console.error("Erreur chargement données", err);
    }
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    try {
      await api.post("/pets", { ...formData, isWalking: false, imageUrl: "" });
      setFormData({ name: "", species: "" });
      fetchMyData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePet = async (id) => {
    if (window.confirm("Supprimer cet animal ?")) {
      await api.delete(`/pets/${id}`);
      fetchMyData();
    }
  };

  const handleImageUpload = async (id, file) => {
    const data = new FormData();
    data.append("file", file);
    await api.post(`/pets/${id}/upload-image`, data);
    fetchMyData();
  };

  const openProfile = async (pet) => {
    setSelectedPetForProfile(pet);
    setShowFriends(false);
    try {
      const res = await api.get(`/friendships/pet/${pet.id}/friends`);
      setFriendsList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await api.get(`/users/search?query=${searchQuery}`);
    setSearchResults(res.data);
  };

  const viewUserPets = async (userId) => {
    const res = await api.get(`/pets/owner/${userId}`);
    setSelectedUserPets(res.data);
  };

  const sendFriendRequest = async (targetPetId) => {
    if (!mySelectedPetId) return alert("Sélectionnez un de vos animaux !");
    const targetPet = selectedUserPets.find((p) => p.id === targetPetId);
    const myPet = pets.find((p) => p.id === parseInt(mySelectedPetId));

    const payload = {
      pet1: {
        id: myPet.id,
        name: myPet.name,
        species: myPet.species,
        isWalking: myPet.isWalking || false,
      },
      pet2: {
        id: targetPet.id,
        name: targetPet.name,
        species: targetPet.species,
        isWalking: targetPet.isWalking || false,
      },
      status: "PENDING",
    };

    try {
      await api.post("/friendships/request", payload);
      alert("Demande envoyée !");
      fetchMyData();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur");
    }
  };

  const handleAcceptRequest = async (id) => {
    await api.put(`/friendships/${id}/accept`);
    fetchMyData();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // On retourne tout ce dont le composant Home a besoin
  return {
    pets,
    searchResults,
    searchQuery,
    setSearchQuery,
    pendingRequests,
    selectedUserPets,
    mySelectedPetId,
    setMySelectedPetId,
    formData,
    setFormData,
    selectedPetForProfile,
    setSelectedPetForProfile,
    friendsList,
    showFriends,
    setShowFriends,
    handleAddPet,
    handleDeletePet,
    handleImageUpload,
    openProfile,
    handleSearch,
    viewUserPets,
    sendFriendRequest,
    handleAcceptRequest,
    logout,
    fetchMyData,
  };
}
