import Header from "./Header";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import styles from "./MainLayout.module.css";

export default function MainLayout({ children, onAddPetClick, logout, ...socialProps }) {
  return (
    <div className={styles.layoutWrapper}>
      <Header logout={logout} />
      <div className={styles.gridContainer}>
        <SidebarLeft onAddPetClick={onAddPetClick} />
        <main className={styles.mainContent}>
          {children}
        </main>
        <SidebarRight {...socialProps} />
      </div>
    </div>
  );
}