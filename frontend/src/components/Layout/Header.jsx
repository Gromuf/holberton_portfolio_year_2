import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header({ logout }) {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.logo} onClick={() => navigate("/home")}>
          PetConnect
        </h1>
        <div className={styles.headerRight}>
          <button onClick={logout} className={styles.logoutBtn}>Déconnexion</button>
          <div 
            className={styles.profileCircle} 
            onClick={() => navigate("/profile")}
            style={{ cursor: "pointer" }}
          >
            JD
          </div>
        </div>
      </div>
    </header>
  );
}