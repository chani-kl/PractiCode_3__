import { useState } from "react";
import axios from "axios";

function Login({ onLogin, onShowRegister }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  <button type="button" onClick={onShowRegister}>
  להרשמה
</button>

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        userName,
        passwordHash: password
      });

      localStorage.setItem("token", res.data.token);
      onLogin(); 
    } catch {
      alert("שם משתמש או סיסמה שגויים");
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      <input
        placeholder="Username"
        value={userName}
        onChange={e => setUserName(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
