import Header from "./Header";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import styles from "./MainLayout.module.css";

export default function MainLayout({ 
  children, 
  onAddPetClick, 
  onAcceptRequest, 
  onRejectRequest, 
  logout, 
  hideRightSidebar, // Ajout de la propriété
  ...socialProps 
}) {
  return (
    <div className={styles.layoutWrapper}>
      <Header 
        logout={logout} 
        onAddPetClick={onAddPetClick} 
        onAcceptRequest={onAcceptRequest} 
        onRejectRequest={onRejectRequest} 
        {...socialProps} 
      />
      
      {/* On ajoute une classe conditionnelle pour adapter la grille */}
      <div className={`${styles.gridContainer} ${hideRightSidebar ? styles.noRightSidebar : ""}`}>
        <aside className="sidebar">
          <SidebarLeft onAddPetClick={onAddPetClick} />
        </aside>
        
        <main className={styles.mainContent}>
          {children}
        </main>
        
        {/* On masque tout l'encart droit si hideRightSidebar est true */}
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