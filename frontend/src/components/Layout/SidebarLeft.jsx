import React from "react";
import Button from "../Common/Button";
import NotifMsg from "../Common/NotifMsg";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./SidebarLeft.module.css";

export default function SidebarLeft({ onAddPetClick, hasUnread }) {
  const navigate = useNavigate();
  const location = useLocation();

  const showAddPetButton = location.pathname === "/home" || location.pathname === "/profile";

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.navGroup}>
        <Button variant="ghost" onClick={() => navigate("/home")} className={styles.navBtn}>🏠 Accueil</Button>
        
        <Button variant="ghost" onClick={() => navigate("/messages")} className={styles.navBtn}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span>📩 Messages</span>
            {hasUnread && <NotifMsg />}
          </div>
        </Button>

        <Button variant="ghost" onClick={() => navigate("/profile")} className={styles.navBtn}>👤 Profil</Button>
      </nav>
      {showAddPetButton && (
        <div className={styles.actionGroup}>
          <Button variant="success" onClick={onAddPetClick} className={styles.addPetBtn}>Ajouter un animal</Button>
        </div>
      )}
    </aside>
  );
}