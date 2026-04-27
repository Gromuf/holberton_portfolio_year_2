import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MobileMenu.module.css";
import SocialSection from "../Social/SocialSection";
import Button from "../Common/Button";

export default function MobileMenu({ onClose, onAddPetClick, logout, ...socialProps }) {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div 
      className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ""}`} 
      onClick={handleClose}
    >
      <div 
        className={`${styles.drawer} ${isClosing ? styles.drawerClosing : ""}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={handleClose}>✕</button>
        <nav className={styles.navLinks}>
          <h3>Navigation</h3>
          <Button variant="ghost" onClick={() => { navigate("/home"); onClose(); }}>🏠 Accueil</Button>
          <Button variant="ghost" onClick={() => { navigate("/profile"); onClose(); }}>👤 Profil</Button>
          <Button variant="success" onClick={() => { onAddPetClick(); onClose(); }} style={{ marginBottom: '10px' }}>Ajouter un animal</Button>
        </nav>

        <hr className={styles.divider} />

        <div className={styles.socialPart}>
          <h3>Recherche & Amis</h3>
          <SocialSection {...socialProps} />
        </div>
      </div>
    </div>
  );
}