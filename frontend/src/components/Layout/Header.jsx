import { useNavigate } from "react-router-dom";
import { useHeader } from "../../hooks/useHeader";
import styles from "./Header.module.css";
import MobileMenu from "./MobileMenu";

export default function Header({ logout, onAddPetClick, ...socialProps }) {
  const navigate = useNavigate();
  const { currentUser, isMenuOpen, getInitials, toggleMenu, closeMenu } = useHeader();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.burgerMenu} onClick={toggleMenu}>
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
          onClose={closeMenu} 
          logout={logout} 
          onAddPetClick={onAddPetClick}
          {...socialProps} 
        />
      )}
    </header>
  );
}