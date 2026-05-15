import Button from "../Common/Button";
import styles from "./PetForm.module.css";

export default function PetForm({ formData, setFormData, onSubmit }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form className={styles.petAddForm} onSubmit={onSubmit}>
      <div className={styles.inputGroup}>
        <label>Nom du compagnon *</label>
        <input
          required
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          placeholder="Ex: Rex"
        />
      </div>

      <div className={styles.formRow}>
        <div className={`${styles.inputGroup} ${styles.flex1}`}>
          <label>Espèce *</label>
          <select
            required
            name="species"
            value={formData.species || ""}
            onChange={handleChange}
          >
            <option value="" disabled>
              Choisir une espèce
            </option>
            <option value="CHIEN">Chien</option>
            <option value="CHAT">Chat</option>
            <option value="AUTRE">Autre</option>
          </select>
        </div>
        <div className={`${styles.inputGroup} ${styles.flex1}`}>
          <label>Âge (ans)</label>
          <input
            type="number"
            name="age"
            value={formData.age || ""}
            onChange={handleChange}
            placeholder="Ex: 3"
            min="0"
          />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label>Petite Bio</label>
        <textarea
          name="bio"
          value={formData.bio || ""}
          onChange={handleChange}
          placeholder="Racontez une petite anecdote..."
          rows="3"
        />
      </div>

      <Button type="submit" variant="success" className={styles.submitBtnFull}>
        Créer le profil
      </Button>
    </form>
  );
}
