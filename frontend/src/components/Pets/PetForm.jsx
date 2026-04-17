import Input from "../Common/Input";
import Button from "../Common/Button";
import "./PetForm.css";

export default function PetForm({ formData, setFormData, onSubmit }) {
  return (
    <form className="pet-add-form" onSubmit={onSubmit}>
      <Input placeholder="Nom" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
      <Input placeholder="Espèce" value={formData.species} onChange={(e) => setFormData({...formData, species: e.target.value})} />
      <Button type="submit" variant="success">Ajouter</Button>
    </form>
  );
}