import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Common/Button";
import styles from "./auth.module.css";

export default function Login() {
  const navigate = useNavigate();
  const { credentials, setCredentials, handleLogin } = useAuth(navigate);

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <h2>Bon retour !</h2>
        <form onSubmit={handleLogin} className={styles.authForm}>
          <input
            className="base-input" // Utilise ta classe d'Input globale
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            required
          />
          <input
            className="base-input"
            type="password"
            placeholder="Mot de passe"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            required
          />
          <Button variant="action" type="submit">
            Se connecter
          </Button>
        </form>
        <p className={styles.authFooter}>
          Pas encore de compte ?{" "}
          <Link to="/register" className={styles.authLink}>
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
