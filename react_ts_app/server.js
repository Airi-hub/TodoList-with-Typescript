const express = require('express');
const app = express();
const cors = require('cors'); 
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

let todos = [];
let currentId = 1;


app.use(cors());



// Get all todos
app.get('/todos', (req, res) => {
    res.json(todos);
  });
  
  // Create a new todo
  app.post('/todos', express.json(), (req, res) => {
    const todo = req.body;
    todo.id = currentId++;
    todos.push(todo);
    res.status(201).json(todo);
  });
  
  // Update a todo
  app.put('/todos/:id', express.json(), (req, res) => {
    const id = parseInt(req.params.id);
    const updatedTodo = req.body;
    const todoIndex = todos.findIndex((todo) => todo.id === id);
  
    if (todoIndex !== -1) {
      todos[todoIndex] = updatedTodo;
      res.json(updatedTodo);
    } else {
      res.status(404).json({ message: 'Todo not found' });
    }
  });
  
  // Delete a todo
  app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todoIndex = todos.findIndex((todo) => todo.id === id);
  
    if (todoIndex !== -1) {
      todos.splice(todoIndex, 1);
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Todo not found' });
    }
  });
  