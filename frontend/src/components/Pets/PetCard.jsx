import "./PetCard.css";

export default function PetCard({ pet, onOpen }) {
  const imageUrl = pet.imageUrl || "/default-pet.png";

  return (
    <div className="pet-mini-card" onClick={() => onOpen(pet)}>
      <div className="card-img-wrapper">
        <img src={imageUrl} alt={pet.name} />
      </div>
      <div className="card-overlay">
        <h4>{pet.name}</h4>
        {pet.isWalking && <span className="walking-dot" title="En balade"></span>}
      </div>
    </div>
  );
}