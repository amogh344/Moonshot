import { useState } from "react";
import Login from "./Login";
import Profile from "./Profile";
import ProjectManager from "./ProjectManager";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "50px",
        fontFamily: "sans-serif",
      }}
    >
      <header style={{ marginBottom: "30px" }}>
        <h1>Moonshot Enterprise Dashboard</h1>
      </header>

      {!isLoggedIn ? (
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        <>
          <Profile onLogout={handleLogout} />
          <ProjectManager />
        </>
      )}
    </div>
  );
}

export default App;
