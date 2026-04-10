import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🏠 Home</h1>
      <p>Tu es connecté à PetConnect !</p>
      <button
        onClick={handleLogout}
        style={{ backgroundColor: "#ff4444", color: "white" }}
      >
        Déconnexion
      </button>
    </div>
  );
}
