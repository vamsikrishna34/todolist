
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: parse JSON bodies (for POST/PUT)
app.use(express.json());

// CORS (allow frontend to call API — needed for local dev)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); // VS Code Live Server
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');  // if using other
  res.header('Access-Control-Allow-Origin', '*'); // ⚠️ for dev only — restrict in prod!
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// In-memory "database" (Week 4: temporary — Week 5 → MongoDB)
let tasks = [
  { id: 1, title: "Welcome to backend!", description: "This task is stored in memory.", completed: false, createdAt: new Date().toISOString() }
];

// 🛣️ API Routes — Week 4: Basic CRUD
app.get('/api/tasks', (req, res) => {
  res.json({ success: true, tasks });
});

app.post('/api/tasks', (req, res) => {
  const { title, description, dueDate } = req.body;
  
  if (!title) {
    return res.status(400).json({ success: false, message: "Title is required" });
  }

  const newTask = {
    id: Date.now(),
    title,
    description: description || '',
    dueDate: dueDate || null,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  res.status(201).json({ success: true, task: newTask });
});

app.put('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, description, dueDate, completed } = req.body;

  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  task.title = title ?? task.title;
  task.description = description ?? task.description;
  task.dueDate = dueDate ?? task.dueDate;
  task.completed = completed !== undefined ? completed : task.completed;

  res.json({ success: true, task });
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  const deleted = tasks.splice(index, 1)[0];
  res.json({ success: true, task: deleted });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

//  Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`→ Try: GET http://localhost:${PORT}/api/tasks`);
});