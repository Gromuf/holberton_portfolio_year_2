import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import MobileMenu from "./MobileMenu"; // On va créer ce composant

export default function Header({ logout, ...socialProps }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <div className={styles.profileCircle} onClick={() => navigate("/profile")}>JD</div>
        </div>
      </div>
      {isMenuOpen && (
        <MobileMenu 
          onClose={() => setIsMenuOpen(false)} 
          logout={logout} 
          {...socialProps} 
        />
      )}
    </header>
  );
}