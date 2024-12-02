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

app.get('/', (req, res) => {
    console.log('Backend says hi');
    res.send('Using database: '+ database);
    
});

// Endpoint to start a new trip
app.post('/api/start-trip', (req, res) => {
  const userID = req.body.userID; // Get the userID from the request body
  const query = 'INSERT INTO trip (userID) VALUES (?)'; // SQL query to insert a new trip

  // Execute the query
  db.query(query, [userID], (err, result) => {
    if (err) {
      console.error('Error starting trip:', err); // Log any errors
      res.status(500).send('Error starting trip'); // Send error response
      return;
    }
    res.json({ tripID: result.insertId }); // Send the new tripID in the response
  });
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

// Endpoint to store locations, speed, and acceleration data
app.post('/api/locations', (req, res) => {
  const { tripID, locations } = req.body; // Get tripID and locations from the request body

  // SQL query to insert locations
  const locationQuery = 'INSERT INTO locations (tripID, latitude, longitude, timestamp) VALUES ?';
  const locationValues = locations.map((loc) => [tripID, loc.latitude, loc.longitude, new Date(loc.timestamp)]);

  // Execute the query to insert locations
  db.query(locationQuery, [locationValues], (err, result) => {
    if (err) {
      console.error('Error inserting locations:', err); // Log any errors
      res.status(500).send('Error inserting locations'); // Send error response
      return;
    }

    // Prepare values for speed and acceleration tables
    const speedValues = locations.map((loc) => [tripID, new Date(loc.timestamp), loc.speed, 60]);
    const accelerationValues = locations.map((loc) => [tripID, new Date(loc.timestamp), loc.acceleration]);

    // SQL queries to insert speed and acceleration data
    const speedQuery = 'INSERT INTO speed (tripID, time, speed, speed_limit) VALUES ?';
    const accelerationQuery = 'INSERT INTO acceleration (tripID, time, acceleration) VALUES ?';

    // Execute the query to insert speed data
    db.query(speedQuery, [speedValues], (err) => {
      if (err) {
        console.error('Error inserting speed data:', err); // Log any errors
        res.status(500).send('Error inserting speed data'); // Send error response
        return;
      }

      // Execute the query to insert acceleration data
      db.query(accelerationQuery, [accelerationValues], (err) => {
        if (err) {
          console.error('Error inserting acceleration data:', err); // Log any errors
          res.status(500).send('Error inserting acceleration data'); // Send error response
          return;
        }

        res.send('Locations, speed, and acceleration data saved to database'); // Send success response
      });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


