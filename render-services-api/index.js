const express = require("express");
const bcrypt = require("bcryptjs"); // בלי בעיות native build
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || "supersecretkey";

app.use(cors({ origin: "*" })); // מאפשר לכולם, אפשר להחליף ל־frontend ספציפי
app.use(express.json());

const users = [];
const todos = []; // למען הפשטות, DB פשוט

// Root
app.get("/", (req, res) => res.send("Backend is running"));

// Register – public
app.post("/register", async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) return res.status(400).json({ message: "Missing fields" });
  if (users.find(u => u.userName === userName)) return res.status(400).json({ message: "User already exists" });

  const hash = await bcrypt.hash(password, 10);
  users.push({ userName, passwordHash: hash });
  res.json({ message: "Registered successfully" });
});

// Login – public
app.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  const user = users.find(u => u.userName === userName);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userName }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Middleware for protected routes
function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

// Todos – protected
app.get("/todos", auth, (req, res) => {
  res.json(todos);
});

app.post("/todos", auth, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Missing name" });

  const todo = { id: Date.now(), name, isComplete: false };
  todos.push(todo);
  res.json(todo);
});

app.put("/todos/:id", auth, (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ message: "Not found" });

  todo.name = req.body.name ?? todo.name;
  todo.isComplete = req.body.isComplete ?? todo.isComplete;
  res.json(todo);
});

app.delete("/todos/:id", auth, (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ message: "Not found" });

  todos.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
