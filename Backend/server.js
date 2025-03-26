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

// GET all tasks
app.get('/tasks', (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(TASK_FILE));
  res.json(tasks);
});

// CREATE a new task
app.post('/tasks', (req, res) => {
  const newTask = req.body;
  const tasks = JSON.parse(fs.readFileSync(TASK_FILE));
  tasks.push(newTask);
  fs.writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2));
  res.status(201).json(newTask);
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
