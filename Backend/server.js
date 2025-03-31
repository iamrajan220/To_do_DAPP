const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1) Serve static files from "../src" (relative to the Backend folder).
//    __dirname = "<...>/TO_DO_DAPP/Backend"
//    We go one level up ".." and into "src".
app.use(express.static(path.join(__dirname, '..', 'src')));

// 2) Main entry point: return "index.html" (login page) when visiting "/".
app.get('/', (req, res) => {
  // Use path.join to navigate up one directory, then into "src/index.html".
  res.sendFile(path.join(__dirname, '..', 'src', 'index.html'));
});

// 3) (Optional) If you want a route for the tasks page:
app.get('/tasks-page', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'src', 'task.html'));
});

// 4) Load your users and tasks JSON files from the Backend folder
const USERS = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json')));
const TASK_FILE = path.join(__dirname, 'tasks.json');

// 5) Login endpoint: validate user credentials from users.json
app.post('/login', (req, res) => {
  const { name, password } = req.body;
  const user = USERS.find(u => u.name === name && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  return res.json({ success: true });
});

// 6) GET tasks: read from tasks.json
app.get('/tasks', (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(TASK_FILE));
  res.json(tasks);
});

// 7) CREATE task: add a new task to tasks.json
app.post('/tasks', (req, res) => {
  const newTask = req.body;
  const tasks = JSON.parse(fs.readFileSync(TASK_FILE));
  tasks.push(newTask);
  fs.writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2));
  res.status(201).json(newTask);
});

// 8) Start the server on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
