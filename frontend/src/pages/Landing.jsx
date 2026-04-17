import { Link } from "react-router-dom";
import Button from "../components/Common/Button"; // Vérifie bien le chemin
import styles from "./auth.module.css";

export default function Landing() {
  return (
    <div className={styles.authWrapper}>
      <div className={`${styles.authCard} ${styles.landingContent}`}>
        <h1 className={styles.mainTitle}>PetConnect</h1>
        <p className={styles.description}>
          La plateforme sociale pour vos compagnons à quatre pattes. <br />
          Rencontrez d'autres propriétaires !
        </p>
        <div className={styles.buttonGroup}>
          <Link to="/register">
            <Button variant="success">Créer un compte</Button>
          </Link>
          <Link to="/login">
            <Button variant="action">Se connecter</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
