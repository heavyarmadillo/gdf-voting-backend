const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const votesFile = 'votes.json';

// Create file if it doesn't exist
if (!fs.existsSync(votesFile)) {
  fs.writeFileSync(votesFile, JSON.stringify([]));
}

// Save a vote
app.post('/vote', (req, res) => {
  const { name, fightType, vote } = req.body;

  if (!name || !vote || !fightType) {
    return res.status(400).send({ message: 'Missing data' });
  }

  const votes = JSON.parse(fs.readFileSync(votesFile));
  votes.push({ name, fightType, vote, timestamp: new Date().toISOString() });
  fs.writeFileSync(votesFile, JSON.stringify(votes, null, 2));
  res.send({ message: 'Vote recorded' });
});

// View votes (admin)
app.get('/votes', (req, res) => {
  const votes = JSON.parse(fs.readFileSync(votesFile));
  res.json(votes);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
