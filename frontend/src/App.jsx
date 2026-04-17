import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import des Pages
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";

// Import des Composants de structure
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Page d'accueil (Public) */}
        <Route path="/" element={<Landing />} />

        {/* 2. Inscription (Public) */}
        <Route path="/register" element={<Register />} />

        {/* 3. Connexion (Public) */}
        <Route path="/login" element={<Login />} />

        {/* 4. Tableau de bord (Privé - nécessite un Token) */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
