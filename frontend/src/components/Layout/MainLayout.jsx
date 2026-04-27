import Header from "./Header";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import styles from "./MainLayout.module.css";

export default function MainLayout({ children, onAddPetClick, logout, ...socialProps }) {
  return (
    <div className={styles.layoutWrapper}>
      <Header logout={logout} onAddPetClick={onAddPetClick} {...socialProps} />
      <div className={styles.gridContainer}>
        <aside className="sidebar">
          <SidebarLeft onAddPetClick={onAddPetClick} />
        </aside>
        <main className={styles.mainContent}>
          {children}
        </main>
        <aside className="sidebar">
          <SidebarRight {...socialProps} />
        </aside>
      </div>
    </div>
  );
}