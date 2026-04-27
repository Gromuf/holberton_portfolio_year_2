import Header from "./Header";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import styles from "./MainLayout.module.css";

export default function MainLayout({ children, onAddPetClick, logout, ...socialProps }) {
  return (
    <div className={styles.layoutWrapper}>
      {/* On passe les socialProps au Header pour le MobileMenu */}
      <Header logout={logout} {...socialProps} />
      
      <div className={styles.gridContainer}>
        {/* On ajoute la classe "sidebar" ici */}
        <aside className="sidebar">
          <SidebarLeft onAddPetClick={onAddPetClick} />
        </aside>

        <main className={styles.mainContent}>
          {children}
        </main>

        {/* On ajoute la classe "sidebar" ici aussi */}
        <aside className="sidebar">
          <SidebarRight {...socialProps} />
        </aside>
      </div>
    </div>
  );
}