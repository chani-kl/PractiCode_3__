const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const users = [];


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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
