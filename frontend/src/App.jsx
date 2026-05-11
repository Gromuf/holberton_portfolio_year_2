import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import des Pages
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import PetProfile from "./pages/PetProfile";
import Messages from "./pages/Messages";

// Import des Composants de structure
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";

function App() {
  
  // Fonction de déconnexion globale
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // On redirige vers la landing ou login et on recharge pour vider les états React
    window.location.href = "/";
  };

  return (
    <Router>
      <Routes>
        {/* 1. Page d'accueil (Public) */}
        <Route path="/" element={<Landing />} />

        {/* 2. Inscription (Public) */}
        <Route path="/register" element={<Register />} />

        {/* 3. Connexion (Public) */}
        <Route path="/login" element={<Login />} />

        {/* 4. Tableau de bord (Privé) */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* 5. Profil (Privé) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              {/* On passe le logout au profil pour que le bouton Header fonctionne */}
              <Profile logout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <Profile logout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* 6. Profil de l'animal (Privé) */}
        <Route
          path="/pet/:id"
          element={
            <ProtectedRoute>
              <PetProfile logout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* 7. Messagerie (Privé) */}
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages logout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;