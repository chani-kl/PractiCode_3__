import React, { useState } from "react";
import axios from "axios";

function Register({ onRegister }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/register`, {
        userName,
        password // אם ה־backend מצפה ל-passwordHash, תצטרך לחשב hash
      });

      alert("הרשמה בוצעה בהצלחה");
      onRegister(); 
    } catch (err) {
      alert("שגיאה בהרשמה: " + err.response?.data?.message || err.message);
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>הרשמה</h2>

      <input
        placeholder="שם משתמש"
        value={userName}
        onChange={e => setUserName(e.target.value)}
      />

      <input
        type="password"
        placeholder="סיסמה"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button type="submit">הרשמה</button>
    </form>
  );
}

export default Register;
