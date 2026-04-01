import { useState, useEffect } from "react";
import { getProfile } from "./services/api";

function Profile({ onLogout }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getProfile();
        setUser(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          // Token expired or invalid - trigger logout and return to login
          onLogout();
        } else {
          setError(err.response?.data?.error || "Failed to load profile");
        }
      }
    };

    fetchUser();
  }, [onLogout]);

  const handleLogout = () => {
    onLogout();
  };

  if (error) {
    return <div style={{ color: "red", padding: "10px" }}>{error}</div>;
  }

  if (!user) {
    return <div>Loading secure profile...</div>;
  }

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f4f4f4",
        borderRadius: "8px",
      }}
    >
      <h2>Welcome back, {user.username}!</h2>

      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <p>
        <strong>Account Created:</strong>{" "}
        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
      </p>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "10px",
          background: "#ff4444",
          color: "white",
          border: "none",
          padding: "8px 15px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;
