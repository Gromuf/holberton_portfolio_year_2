import React, { useState } from "react";
import Button from "../Common/Button";
import NotifMsg from "../Common/NotifMsg";
import WalkForm from "./WalkForm";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./SidebarLeft.module.css";

export default function SidebarLeft({ onAddPetClick, hasUnread, pets = [], onToggleWalk }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const showAddBtn = location.pathname === "/home" || location.pathname === "/profile";

  const handleStartWalk = (selectedIds) => {
    // On déclenche l'appel API pour chaque animal coché
    selectedIds.forEach(id => {
      onToggleWalk(id, true);
    });
    setIsFormOpen(false); // Ferme le formulaire après validation
  };

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.navGroup}>
        <Button variant="ghost" onClick={() => navigate("/home")} className={styles.navBtn}>🏠 Accueil</Button>
        <Button variant="ghost" onClick={() => navigate("/messages")} className={styles.navBtn}>
          <div className={styles.notifWrapper}>
            <span>📩 Messages</span>
            {hasUnread && <NotifMsg />}
          </div>
        </Button>
        <Button variant="ghost" onClick={() => navigate("/profile")} className={styles.navBtn}>👤 Profil</Button>
      </nav>

      <div className={styles.actionGroup}>
        {!isFormOpen ? (
          <Button 
            variant="success" 
            onClick={() => setIsFormOpen(true)} 
            className={styles.walkBtn}
          >
            🦮 Lancer une balade
          </Button>
        ) : (
          <WalkForm 
            pets={pets} 
            onStart={handleStartWalk} 
            onCancel={() => setIsFormOpen(false)} 
          />
        )}

        {showAddBtn && (
          <Button variant="success" onClick={onAddPetClick} className={styles.addPetBtn}>
            + Ajouter un animal
          </Button>
        )}
      </div>
    </aside>
  );
}