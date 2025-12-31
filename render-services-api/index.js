const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS – חובה
app.use(cors({
  origin: "https://frontend-40od.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ====== FAKE DB ======
const users = [];

// ====== TEST ROUTE ======
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ====== RENDER API ======
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

// ====== REGISTER ======
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const exists = users.find(u => u.username === username);
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({
    id: Date.now(),
    username,
    password
  });

  res.json({ message: "Registered successfully" });
});

// ====== LOGIN ======
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ token: "fake-jwt-token" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
