import Button from "../Common/Button";
import "./PetModal.css";

export default function PetModal({ 
  pet, 
  friends, 
  showFriends, 
  setShowFriends, 
  onRemoveFriend, 
  onClose 
}) {
  if (!pet) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <img 
          src={pet.imageUrl || "/default-pet.png"} 
          alt="profil" 
          className="modal-img"
        />
        <h2>{pet.name}</h2>
        <p className="species-text">{pet.species}</p>

        <Button 
          variant="action" 
          className="w-100 mb-10"
          onClick={() => setShowFriends(!showFriends)}
        >
          {showFriends ? "Masquer les amis" : `Voir ses amis (${friends.length})`}
        </Button>

        {showFriends && (
          <div className="friends-scroll-box">
            {friends.length === 0 ? (
              <p className="no-friends">Aucun ami pour le moment.</p>
            ) : (
              friends.map((f) => (
                <div key={f.friendshipId} className="friend-list-item">
                  <span>🐾 {f.name}</span>
                  <button 
                    className="btn-remove"
                    onClick={() => onRemoveFriend(f.friendshipId)}
                  >
                    Retirer
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        <Button variant="danger" onClick={onClose} className="w-100">
          Fermer
        </Button>
      </div>
    </div>
  );
}