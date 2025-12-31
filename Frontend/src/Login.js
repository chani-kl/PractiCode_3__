import { useState } from "react";
import axios from "axios";

function Login({ onLogin, onShowRegister }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { userName, password });
      localStorage.setItem("token", res.data.token);
      onLogin();
    } catch {
      alert("שם משתמש או סיסמה שגויים");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input placeholder="Username" value={userName} onChange={e => setUserName(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
        <button type="button" onClick={onShowRegister}>להרשמה</button>
      </form>
    </div>
  );
}

export default Login;
