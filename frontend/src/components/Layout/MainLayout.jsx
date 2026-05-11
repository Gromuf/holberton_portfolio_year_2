import React, { useState, useEffect } from "react";
import Header from "./Header";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import api from "../../api/client";
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
    
    // On écoute l'événement de lecture venant de useMessages
    window.addEventListener("messagesMarkedAsRead", checkNotifs);
    
    // Check automatique toutes les 30s
    const interval = setInterval(checkNotifs, 30000);

    return () => {
      window.removeEventListener("messagesMarkedAsRead", checkNotifs);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={styles.layoutWrapper}>
      <Header 
        logout={logout} 
        onAddPetClick={onAddPetClick} 
        onAcceptRequest={onAcceptRequest} 
        onRejectRequest={onRejectRequest} 
        {...socialProps} 
      />
      
      <div className={`${styles.gridContainer} ${hideRightSidebar ? styles.noRightSidebar : ""}`}>
        <aside className="sidebar">
          <SidebarLeft onAddPetClick={onAddPetClick} hasUnread={hasUnread} />
        </aside>
        
        <main className={styles.mainContent}>
          {children}
        </main>
        
        {!hideRightSidebar && (
          <aside className="sidebar">
            <SidebarRight 
              onAcceptRequest={onAcceptRequest} 
              onRejectRequest={onRejectRequest} 
              {...socialProps} 
            />
          </aside>
        )}
      </div>
    </div>
  );
}