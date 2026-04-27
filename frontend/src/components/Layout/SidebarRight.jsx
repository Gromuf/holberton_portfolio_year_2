import SocialSection from "../Social/SocialSection";
import styles from "./SidebarRight.module.css";

export default function SidebarRight(props) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Membres & Recherche</h3>
        <SocialSection {...props} />
      </div>
    </aside>
  );
}