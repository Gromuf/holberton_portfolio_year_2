import styles from "./Header.module.css";

export default function Header({ logout }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.logo}>PetConnect</h1>
        <div className={styles.headerRight}>
          <button onClick={logout} className={styles.logoutBtn}>Déconnexion</button>
          <div className={styles.profileCircle}>JD</div>
        </div>
      </div>
    </header>
  );
}