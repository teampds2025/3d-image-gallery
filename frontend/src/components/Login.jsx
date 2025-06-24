import React, { useState } from "react";
import "../styles/Login.css"; 

// COMPONENT
// renders and handles a login form. it is a demonstration variant, it does not handle API responses securely!!
const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState(""); // stores the username input
  const [password, setPassword] = useState(""); // stores the password input
  const [error, setError] = useState(null); // stores any login error messages
  const [isLoading, setIsLoading] = useState(false); // tracks the submission process for UI

  // handles the form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); 
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      onLoginSuccess();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="input-group">
        <input
          type="text"
          id="username"
          placeholder="USERNAME"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <input
          type="password"
          id="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default Login;
