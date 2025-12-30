import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5208/login", {
        userName,
        passwordHash: password
      });

      // 🔥 זה השורה הכי חשובה
      localStorage.setItem("token", res.data.token);

      onLogin(); // מעבר ל-Todo
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
