import { useState, useEffect } from "react";
import api from "../api/client";

export function useHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/profile/me");
        setCurrentUser(res.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'utilisateur :",
          error,
        );
      }
    };
    fetchUser();
  }, []);

  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.trim().split(" ");
    if (nameParts.length >= 2) {
      return (
        nameParts[0][0] + nameParts[nameParts.length - 1][0]
      ).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return {
    currentUser,
    isMenuOpen,
    getInitials,
    toggleMenu,
    closeMenu,
  };
}
