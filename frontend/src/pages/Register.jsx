import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Common/Button";
import styles from "./auth.module.css";

export default function Register() {
  const navigate = useNavigate();
  const { registerData, setRegisterData, handleRegister } = useAuth(navigate);

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <h2>Créer un compte</h2>
        <form onSubmit={handleRegister} className={styles.authForm}>
          <input
            className="base-input"
            type="text"
            placeholder="Nom complet"
            value={registerData.name}
            onChange={(e) =>
              setRegisterData({ ...registerData, name: e.target.value })
            }
            required
          />
          <input
            className="base-input"
            type="email"
            placeholder="Email"
            value={registerData.email}
            onChange={(e) =>
              setRegisterData({ ...registerData, email: e.target.value })
            }
            required
          />
          <input
            className="base-input"
            type="password"
            placeholder="Mot de passe (min 6 car.)"
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
          Déjà un compte ?{" "}
          <Link to="/login" className={styles.authLink}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
