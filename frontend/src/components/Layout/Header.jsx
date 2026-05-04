import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import styles from "./Header.module.css";
import MobileMenu from "./MobileMenu";

export default function Header({ logout, onAddPetClick, ...socialProps }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // L'URL a été modifiée ici pour utiliser la nouvelle route
        const res = await api.get("/users/profile/me");
        setCurrentUser(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      }
    };
    fetchUser();
  }, []);

  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.trim().split(" ");
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.burgerMenu} onClick={() => setIsMenuOpen(true)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <h1 className={styles.logo} onClick={() => navigate("/home")}>
          PetConnect
        </h1>
        <div className={styles.headerRight}>
          <button onClick={logout} className={styles.logoutBtn}>Logout</button>
          <div className={styles.profileCircle} onClick={() => navigate("/profile")}>
            {getInitials(currentUser.name)}
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <MobileMenu 
          onClose={() => setIsMenuOpen(false)} 
          logout={logout} 
          onAddPetClick={onAddPetClick}
          {...socialProps} 
        />
      )}
    </header>
  );
}