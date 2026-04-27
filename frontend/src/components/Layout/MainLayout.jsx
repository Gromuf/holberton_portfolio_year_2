import Header from "./Header";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import styles from "./MainLayout.module.css";

export default function MainLayout({ children, onAddPetClick, onAcceptRequest, onRejectRequest, logout, ...socialProps }) {
  return (
    <div className={styles.layoutWrapper}>
      {/* On passe les fonctions au Header pour le menu Mobile */}
      <Header 
        logout={logout} 
        onAddPetClick={onAddPetClick} 
        onAcceptRequest={onAcceptRequest} 
        onRejectRequest={onRejectRequest} 
        {...socialProps} 
      />
      <div className={styles.gridContainer}>
        <aside className="sidebar">
          <SidebarLeft onAddPetClick={onAddPetClick} />
        </aside>
        <main className={styles.mainContent}>
          {children}
        </main>
        <aside className="sidebar">
          {/* On passe les fonctions à la SidebarRight */}
          <SidebarRight 
            onAcceptRequest={onAcceptRequest} 
            onRejectRequest={onRejectRequest} 
            {...socialProps} 
          />
        </aside>
      </div>
    </div>
  );
}