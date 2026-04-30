import Button from "../Common/Button";
import "./PetForm.css";

export default function PetForm({ formData, setFormData, onSubmit }) {
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form className="pet-add-form" onSubmit={onSubmit}>
      <div className="input-group">
        <label>Nom du compagnon *</label>
        <input 
          required 
          type="text" 
          name="name" 
          value={formData.name || ''} 
          onChange={handleChange} 
          placeholder="Ex: Rex" 
        />
      </div>

      <div className="form-row">
        <div className="input-group flex-1">
          <label>Espèce *</label>
          <input 
            required 
            type="text" 
            name="species" 
            value={formData.species || ''} 
            onChange={handleChange} 
            placeholder="Chien, Chat..." 
          />
        </div>
        <div className="input-group flex-1">
          <label>Âge (ans)</label>
          <input 
            type="number" 
            name="age" 
            value={formData.age || ''} 
            onChange={handleChange} 
            placeholder="Ex: 3" 
            min="0" 
          />
        </div>
      </div>

      <div className="input-group">
        <label>Petite Bio</label>
        <textarea 
          name="bio" 
          value={formData.bio || ''} 
          onChange={handleChange} 
          placeholder="Racontez une petite anecdote..." 
          rows="3" 
        />
      </div>

      <Button type="submit" variant="success" className="submit-btn-full">
        Créer le profil
      </Button>
    </form>
  );
}