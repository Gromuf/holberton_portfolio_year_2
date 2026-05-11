import React, { useState, useEffect } from "react";
import Header from "./Header";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import api from "../../api/client";
import { useWalk } from "../../hooks/useWalk";
import WalkNotification from "../Common/WalkNotification";
import styles from "./MainLayout.module.css";

export default function MainLayout({ 
  children, 
  onAddPetClick, 
  onAcceptRequest, 
  onRejectRequest, 
  logout, 
  hideRightSidebar,
  ...socialProps 
}) {
  const [hasUnread, setHasUnread] = useState(false);

  // Sécurité : on prend l'animal sélectionné ou le premier par défaut
  const activePet = socialProps.pets?.find(p => p.id === socialProps.mySelectedPetId) 
                 || socialProps.pets?.[0];
  
  const { 
    isWalking,
    friendInWalk, 
    toggleWalk, 
    muteFriend, 
    dismissNotification 
  } = useWalk(activePet);

  const checkNotifs = async () => {
    try {
      const res = await api.get("/messages/has-unread");
      setHasUnread(res.data);
    } catch (err) {
      console.error("Erreur check notifications", err);
    }
  };

  useEffect(() => {
    checkNotifs();
    window.addEventListener("messagesMarkedAsRead", checkNotifs);
    const interval = setInterval(checkNotifs, 30000);
    return () => {
      window.removeEventListener("messagesMarkedAsRead", checkNotifs);
      clearInterval(interval);
    };
  }, []);

  const handleReplyWalk = async () => {
    if (!activePet || !friendInWalk) return;
    
    // On masque immédiatement en local via le storage
    const targetFriendId = friendInWalk.id;
    dismissNotification(targetFriendId);

    try {
      // 1. Message auto (on utilise /messages/send configuré dans ton MessageController)
      await api.post("/messages/send", {
        content: `J'arrive ! Attends-moi avec ${activePet.name} ! 🐾`,
        senderPet: { id: Number(activePet.id) },
        receiverPet: { id: Number(targetFriendId) }
      });
    } catch (err) {
      console.warn("Message auto non envoyé (doublon ignoré), poursuite de la balade.");
    }

    try {
      // 2. Lancer notre balade
      if (!isWalking) {
        await toggleWalk(activePet.id, true);
      }
      window.dispatchEvent(new Event("messagesMarkedAsRead"));
    } catch (err) {
      console.error("Erreur lors de l'action rejoindre :", err);
    }
  };

  return (
    <div className={styles.layoutWrapper}>
      {/* La notification survit maintenant au changement de page grâce au storage */}
      {friendInWalk && activePet && (
        <WalkNotification 
          friend={friendInWalk}
          onReply={handleReplyWalk}
          onMute={() => muteFriend(friendInWalk.id)}
          onClose={() => dismissNotification(friendInWalk.id)}
        />
      )}

      <Header 
        logout={logout} 
        onAddPetClick={onAddPetClick} 
        onAcceptRequest={onAcceptRequest} 
        onRejectRequest={onRejectRequest} 
        {...socialProps} 
      />
      
      <div className={`${styles.gridContainer} ${hideRightSidebar ? styles.noRightSidebar : ""}`}>
        <aside className="sidebar">
          <SidebarLeft 
            pets={socialProps.pets}
            onAddPetClick={onAddPetClick} 
            hasUnread={hasUnread} 
            onToggleWalk={toggleWalk}
          />
        </aside>
        
        <main className={styles.mainContent}>
          {children}
        </main>
        
        {!hideRightSidebar && (
          <aside className="sidebar">
            <SidebarRight 
              onAcceptRequest={onAcceptRequest} 
              onRejectRequest={onRejectRequest} 
              pets={socialProps.pets}
              mySelectedPetId={socialProps.mySelectedPetId}
              setMySelectedPetId={socialProps.setMySelectedPetId}
              {...socialProps} 
            />
          </aside>
        )}
      </div>
    </div>
  );
}