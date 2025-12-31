const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ לפתוח CORS לכולם (מהיר, לא יפה – אבל עובד)
app.use(cors());
app.use(express.json());

// ===== USERS (זמני) =====
const users = [];

// ===== LOGIN =====
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ token: "123" });
});

// ===== REGISTER =====
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  users.push({ username, password });
  res.json({ message: "ok" });
});

// ===== TEST =====
app.get("/", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log("Server running");
});
