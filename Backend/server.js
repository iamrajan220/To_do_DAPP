const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const USERS = JSON.parse(fs.readFileSync('./users.json'));
const TASK_FILE = './tasks.json';

// LOGIN endpoint
app.post('/login', (req, res) => {
  const { name, password } = req.body;
  const user = USERS.find(u => u.name === name && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  return res.json({ success: true });
});


// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
