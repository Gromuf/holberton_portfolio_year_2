import styles from "./MobileMenu.module.css";
import SocialSection from "../Social/SocialSection";
import Button from "../Common/Button";
import { useNavigate } from "react-router-dom";

export default function MobileMenu({ onClose, logout, ...socialProps }) {
  const navigate = useNavigate();

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        
        <nav className={styles.navLinks}>
          <h3>Navigation</h3>
          <Button variant="ghost" onClick={() => { navigate("/home"); onClose(); }}>🏠 Accueil</Button>
          <Button variant="ghost" onClick={() => { navigate("/profile"); onClose(); }}>👤 Profil</Button>
          <Button variant="danger" onClick={logout}>🚪 Déconnexion</Button>
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