import styles from "./PetCard.module.css";

export default function PetCard({ pet, onOpen }) {
  const imageUrl = pet.imageUrl || "/default-pet.png";

  return (
    <div className={styles.petMiniCard} onClick={() => onOpen(pet)}>
      <div className={styles.cardImgWrapper}>
        <img src={imageUrl} alt={pet.name} />
      </div>
      <div className={styles.cardOverlay}>
        <h4>{pet.name}</h4>
        {pet.isWalking && (
          <span className={styles.walkingDot} title="En balade"></span>
        )}
      </div>
    </div>
  );
}
