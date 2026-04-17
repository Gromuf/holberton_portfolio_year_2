import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Common/Button";
import Input from "../components/Common/Input";
import styles from "./auth.module.css";

export default function Register() {
  const navigate = useNavigate();
  const { registerData, setRegisterData, handleRegister } = useAuth(navigate);

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <h2>Créer un compte</h2>
        <form onSubmit={handleRegister} className={styles.authForm}>
          <Input
            type="text"
            placeholder="Nom complet"
            value={registerData.name}
            onChange={(e) =>
              setRegisterData({ ...registerData, name: e.target.value })
            }
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={registerData.email}
            onChange={(e) =>
              setRegisterData({ ...registerData, email: e.target.value })
            }
            required
          />
          <Input
            type="password"
            placeholder="Mot de passe"
            value={registerData.password}
            onChange={(e) =>
              setRegisterData({ ...registerData, password: e.target.value })
            }
            required
          />
          <Button variant="success" type="submit">
            S'inscrire
          </Button>
        </form>
        <p className={styles.authFooter}>
          Déjà inscrit ?{" "}
          <Link to="/login" className={styles.authLink}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
