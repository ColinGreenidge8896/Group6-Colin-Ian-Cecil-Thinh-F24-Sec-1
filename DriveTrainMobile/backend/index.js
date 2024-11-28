const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 3000 ;
var router = express.Router();

// Enable CORS for all routes
app.use(cors());

//my db config - change to yours!!!
//find out how to make this config native to the system
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Crying4435',
  database: 'drivetrain'
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

// Function to calculate driving score
const calculateDrivingScore = (locations) => {
  let score = 100;
  for (let i = 1; i < locations.length; i++) {
    const prev = locations[i - 1];
    const curr = locations[i];
    const timeDiff = (curr.timestamp - prev.timestamp) / 1000; // in seconds
    const speedDiff = curr.speed - prev.speed;
    const acceleration = speedDiff / timeDiff;
    // Adjust score based on acceleration
    if (acceleration > 3) { // Example threshold
      score -= 10;
    }
  }
  return score;
};

// Endpoint to receive location data
app.post('/api/locations', (req, res) => {
  const locations = req.body;
  // Process the locations to calculate the driving score
  const drivingScore = calculateDrivingScore(locations);
  // Store the data in the database
  const query = 'INSERT INTO driving_data (locations, score) VALUES (?, ?)';
  db.query(query, [JSON.stringify(locations), drivingScore], (err, result) => {
    if (err) throw err;
    res.json({ success: true, score: drivingScore });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


