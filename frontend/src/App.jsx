import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <div style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>
        <Link to="/" style={{ marginRight: "10px" }}>
          Accueil
        </Link>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <div style={{ padding: "20px" }}>
              <h1>Bienvenue sur PetConnect</h1>
              <Link to="/register">
                <button>Créer un compte</button>
              </Link>
              <Link to="/login">
                <button style={{ marginLeft: "10px" }}>Se connecter</button>
              </Link>
            </div>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
