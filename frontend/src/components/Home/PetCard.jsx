import Button from "../Common/Button";
import "./PetCard.css";

export default function PetCard({ pet, onOpen, onDelete, onUpload }) {
  return (
    <div className="pet-card-item">
      <div className="avatar-section">
        <img src={pet.imageUrl || "/default-pet.png"} alt={pet.name} onClick={() => onOpen(pet)} />
        <label className="upload-label">
          Changer <input type="file" hidden accept="image/*" onChange={(e) => onUpload(pet.id, e.target.files[0])} />
        </label>
      </div>
      <div className="info-section" onClick={() => onOpen(pet)}>
        <h4>{pet.name}</h4>
        <p>{pet.species}</p>
        <span className={`badge ${pet.isWalking ? "walking" : "home"}`}>
          {pet.isWalking ? "🏃 En balade" : "🏠 À la maison"}
        </span>
      </div>
      <Button className="delete-btn" onClick={() => onDelete(pet.id)} variant="danger">
        Delete
      </Button>
    </div>
  );
}