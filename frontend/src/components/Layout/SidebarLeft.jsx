import Button from "../Common/Button";
import { useNavigate } from "react-router-dom";
import styles from "./SidebarLeft.module.css";

export default function SidebarLeft({ onAddPetClick }) {
  const navigate = useNavigate();

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.navGroup}>
        <Button variant="ghost" onClick={() => navigate("/home")} className={styles.navBtn}>🏠 Accueil</Button>
        <Button variant="ghost" onClick={() => navigate("/messages")} className={styles.navBtn}>📩 Messages</Button>
        <Button variant="ghost" onClick={() => navigate("/profile")} className={styles.navBtn}>👤 Profil</Button>
      </nav>
      <div className={styles.actionGroup}>
        <Button variant="success" onClick={onAddPetClick} className={styles.addPetBtn}>+ Ajouter un animal</Button>
      </div>
    </aside>
  );
}