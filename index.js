const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = "votes.json";

// Initialize file if not present
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

app.post("/vote", (req, res) => {
  const { name, fight, vote } = req.body;

  if (!name || !fight || !vote) {
    return res.status(400).json({ error: "Missing name, fight, or vote" });
  }

  const votes = JSON.parse(fs.readFileSync(DATA_FILE));

  // Prevent duplicate names
  const existing = votes.find((entry) => entry.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: "Name already used for voting" });
  }

  votes.push({ name, fight, vote });
  fs.writeFileSync(DATA_FILE, JSON.stringify(votes, null, 2));
  res.json({ message: "Vote recorded" });
});

app.get("/votes", (req, res) => {
  const votes = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(votes);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
