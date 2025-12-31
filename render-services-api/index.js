const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const users = [];
const SECRET = process.env.JWT_SECRET || "supersecretkey";

app.get("/", (req, res) => res.send("Backend is running"));

// Register
app.post("/register", async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) return res.status(400).json({ message: "Missing fields" });

  if (users.find(u => u.userName === userName)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hash = await bcrypt.hash(password, 10);
  users.push({ userName, passwordHash: hash });
  res.json({ message: "Registered successfully" });
});

// Login
app.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  const user = users.find(u => u.userName === userName);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userName }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
