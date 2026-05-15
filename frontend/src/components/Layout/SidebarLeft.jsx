import React, { useState } from "react";
import Button from "../Common/Button";
import NotifMsg from "../Common/NotifMsg";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./SidebarLeft.module.css";

// 1. On importe la nouvelle modale et le hook
import CreateWalkModal from "../Walks/CreateWalkModal";
import { useWalk } from "../../hooks/useWalk";

export default function SidebarLeft({ onAddPetClick, hasUnread, pets = [] }) {
  const navigate = useNavigate();
  const location = useLocation();

  // 2. L'état pour ouvrir/fermer la modale au lieu du formulaire inline
  const [isWalkModalOpen, setIsWalkModalOpen] = useState(false);

  // 3. On récupère la fonction de création depuis notre hook
  const { createWalk } = useWalk();

  const showAddBtn =
    location.pathname === "/home" || location.pathname === "/profile";

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.navGroup}>
        <Button
          variant="ghost"
          onClick={() => navigate("/home")}
          className={styles.navBtn}
        >
          🏠 Accueil
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate("/messages")}
          className={styles.navBtn}
        >
          <div className={styles.notifWrapper}>
            <span>📩 Messages</span>
            {hasUnread && <NotifMsg />}
          </div>
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate("/profile")}
          className={styles.navBtn}
        >
          👤 Profil
        </Button>
      </nav>

      <div className={styles.actionGroup}>
        {/* Ce bouton ouvre maintenant la modale */}
        <Button
          variant="success"
          onClick={() => setIsWalkModalOpen(true)}
          className={styles.walkBtn}
        >
          🦮 Lancer une balade
        </Button>

        {showAddBtn && (
          <Button
            variant="success"
            onClick={onAddPetClick}
            className={styles.addPetBtn}
          >
            + Ajouter un animal
          </Button>
        )}
      </div>

      {/* 4. Affichage de la Modale en superposition */}
      {isWalkModalOpen && (
        <CreateWalkModal
          myPets={pets}
          onClose={() => setIsWalkModalOpen(false)}
          onSubmit={createWalk}
        />
      )}
    </aside>
  );
}
