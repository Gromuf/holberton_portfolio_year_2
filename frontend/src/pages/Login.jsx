import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Common/Button";
import Input from "../components/Common/Input";
import styles from "./auth.module.css";

export default function Login() {
  const navigate = useNavigate();
  const { credentials, setCredentials, handleLogin } = useAuth(navigate);

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <h2>Connexion</h2>
        <form onSubmit={handleLogin} className={styles.authForm}>
          <Input
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            required
          />
          <Input
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
          Pas de compte ?{" "}
          <Link to="/register" className={styles.authLink}>
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
