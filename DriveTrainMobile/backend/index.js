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

// // Endpoint to receive location data
// app.post('/api/locations', (req, res) => {
//   const locations = req.body;
//   // Process the locations to calculate the driving score
//   const drivingScore = calculateDrivingScore(locations);
//   // Store the data in the database
//   const query = 'INSERT INTO driving_data (locations, score) VALUES (?, ?)';
//   db.query(query, [JSON.stringify(locations), drivingScore], (err, result) => {
//     if (err) throw err;
//     res.json({ success: true, score: drivingScore });
//   });
// });

/*CREATE TABLE locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);*/ 
//what would the insert be?? use db? insert into which table in which order?

app.post('/api/locations', (req, res) => {
  const locations = req.body.locations;
  const query = 'INSERT INTO drivetrain.locations (latitude, longitude) VALUES ?';
  const values = locations.map((loc) => [loc.latitude, loc.longitude]);

  db.query(query, [values], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error inserting data');
    } else {
      console.log('Data inserted successfully:', result);
      res.json({ success: true, insertedRows: result.affectedRows });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


