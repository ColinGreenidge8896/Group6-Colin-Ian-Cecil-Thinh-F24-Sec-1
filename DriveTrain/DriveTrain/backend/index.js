const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 3001 ;
var router = express.Router();

// Enable CORS for all routes
app.use(cors());

//my db config - change to yours!!!
//find out how to make this config native to the system
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Crying4435',
  database: 'test'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected...');
});

// Middleware to parse JSON bodies
app.use(express.json());



//time to create some app stuff
app.get('/', (req, res) => {
    console.log('Backend says hi');
    res.send('Using database: '+ database);
    
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// GET route
app.get('/api/items', (req, res) => {
  // Logic to get items
  res.json({ message: 'GET all items' });
});

// POST route
app.post('/api/items', (req, res) => {
  // Logic to create a new item
  const newItem = req.body;
  res.json({ message: 'POST new item', item: newItem });
});

// PUT route
app.put('/api/items/:id', (req, res) => {
  // Logic to update an item
  const itemId = req.params.id;
  const updatedItem = req.body;
  res.json({ message: `PUT update item ${itemId}`, item: updatedItem });
});

// DELETE route
app.delete('/api/items/:id', (req, res) => {
  // Logic to delete an item
  const itemId = req.params.id;
  res.json({ message: `DELETE item ${itemId}` });
});


