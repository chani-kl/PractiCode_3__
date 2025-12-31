const express = require("express");
const axios = require("axios");
const cors = require("cors");   // ⭐ הוספה
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ⭐ middleware
app.use(cors());               // ⭐ זה פותר את השגיאה
app.use(express.json());

const users = [];

// ---------- Render services ----------
app.get("/services", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.render.com/v1/services",
      {
        headers: {
          Authorization: `Bearer ${process.env.RENDER_API_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Register ----------
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const exists = users.find(u => u.username === username);
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = {
    id: Date.now(),
    username,
    password
  };

  users.push(user);

  res.json({ message: "User registered successfully" });
});

// ---------- Login (כדי שלא ייפול) ----------
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ token: "fake-token" });
});

// ---------- Server ----------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
