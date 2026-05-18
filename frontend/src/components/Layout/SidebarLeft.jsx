import React, { useState } from "react";
import Button from "../Common/Button";
import NotifMsg from "../Common/NotifMsg";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./SidebarLeft.module.css";

import CreateWalkModal from "../Walks/CreateWalkModal";
import ActiveWalkModal from "../Walks/ActiveWalkModal"; 

export default function SidebarLeft({ 
  onAddPetClick, hasUnread, pets = [], activePet, activeWalk, createWalk, endWalk 
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isActiveModalOpen, setIsActiveModalOpen] = useState(false);

  const showAddBtn = location.pathname === "/home" || location.pathname === "/profile";

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
        {activeWalk ? (
          <Button 
            variant="success" 
            onClick={() => setIsActiveModalOpen(true)} 
            className={styles.walkBtn}
          >
            📍 Balade en cours
          </Button>
        ) : (
          <Button 
            variant="success" 
            onClick={() => setIsCreateModalOpen(true)} 
            className={styles.walkBtn}
          >
            🦮 Lancer une balade
          </Button>
        )}

        {showAddBtn && (
          <Button variant="success" onClick={onAddPetClick} className={styles.addPetBtn}>
            + Ajouter un animal
          </Button>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateWalkModal 
          myPets={pets} 
          onClose={() => setIsCreateModalOpen(false)} 
          onSubmit={createWalk} 
        />
      )}

      {isActiveModalOpen && activeWalk && (
        <ActiveWalkModal 
          activeWalk={activeWalk} 
          activePet={activePet}
          onClose={() => setIsActiveModalOpen(false)} 
          onEndWalk={endWalk} 
        />
      )}
    </aside>
  );
}