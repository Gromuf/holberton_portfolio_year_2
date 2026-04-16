import Button from "../Common/Button";
import Input from "../Common/Input";
import "./SocialSection.css";

export default function SocialSection({ 
  pets, 
  mySelectedPetId, 
  setMySelectedPetId, 
  pendingRequests, 
  onAccept, 
  onReject, 
  searchQuery, 
  setSearchQuery, 
  onSearch, 
  searchResults, 
  viewUserPets, 
  selectedUserPets, 
  sendFriendRequest 
}) {
  return (
    <section className="social-container">
      {/* SÉLECTEUR D'IDENTITÉ */}
      {pets.length > 0 && (
        <div className="identity-box">
          <label>🤝 Agir en tant que :</label>
          <select 
            className="pet-select"
            value={mySelectedPetId} 
            onChange={(e) => setMySelectedPetId(e.target.value)}
          >
            <option value="">-- Choisir un animal --</option>
            {pets.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* NOTIFICATIONS */}
      {pendingRequests.length > 0 && (
        <div className="notif-panel">
          <h4>🔔 Demandes reçues</h4>
          {pendingRequests.map((req) => (
            <div key={req.id} className="notif-item">
              <span><strong>{req.pet1.name}</strong> invite <strong>{req.pet2.name}</strong></span>
              <div className="notif-btns">
                <Button variant="success" onClick={() => onAccept(req.id)}>Accepter</Button>
                <Button variant="danger" onClick={() => onReject(req.id)}>Refuser</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RECHERCHE */}
      <h3 className="section-title">Trouver des amis</h3>
      <form onSubmit={onSearch} className="search-bar">
        <Input 
          placeholder="Rechercher un propriétaire..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <Button type="submit">🔍</Button>
      </form>

      <div className="results-list">
        {searchResults.map((user) => (
          <div key={user.id} className="user-result">
            <div className="user-info" onClick={() => viewUserPets(user.id)}>
              👤 {user.name} <small>({user.email})</small>
            </div>
            
            {selectedUserPets.length > 0 && selectedUserPets[0].owner.id === user.id && (
              <div className="user-pets-list">
                {selectedUserPets.map((p) => (
                  <div key={p.id} className="user-pet-card">
                    <span>🐾 {p.name} ({p.species})</span>
                    <Button onClick={() => sendFriendRequest(p.id)}>Ajouter</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}