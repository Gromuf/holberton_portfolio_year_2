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

  const activePet =
    socialProps.pets?.find((p) => p.id === socialProps.mySelectedPetId) ||
    socialProps.pets?.[0];

  // CORRECTION : On passe l'ID de l'animal et on récupère les NOUVELLES variables
  const { invitations, respondToInvitation } = useWalk(activePet?.id);

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

  // On prend la première invitation en attente s'il y en a une
  const pendingInvitation = invitations?.length > 0 ? invitations[0] : null;

  return (
    <div className={styles.layoutWrapper}>
      {/* NOUVEAU SYSTÈME DE NOTIFICATION D'INVITATION */}
      {pendingInvitation && activePet && (
        <WalkNotification
          invitation={pendingInvitation}
          onAccept={() => respondToInvitation(pendingInvitation.id, "ACCEPTED")}
          onDecline={() =>
            respondToInvitation(pendingInvitation.id, "DECLINED")
          }
        />
      )}

      <Header
        logout={logout}
        onAddPetClick={onAddPetClick}
        onAcceptRequest={onAcceptRequest}
        onRejectRequest={onRejectRequest}
        {...socialProps}
      />

      <div
        className={`${styles.gridContainer} ${hideRightSidebar ? styles.noRightSidebar : ""}`}
      >
        <aside className="sidebar">
          {/* Plus besoin de onToggleWalk ici */}
          <SidebarLeft
            pets={socialProps.pets}
            onAddPetClick={onAddPetClick}
            hasUnread={hasUnread}
          />
        </aside>

        <main className={styles.mainContent}>{children}</main>

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
