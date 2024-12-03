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
  password: 'w6c9Ze//',
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

// Endpoint to create a new user
app.post('/api/create-user', (req, res) => {
  const { name, DriverScore } = req.body;
  const query = 'INSERT INTO users (name, DriverScore) VALUES (?, ?)';

  db.query(query, [name, DriverScore], (err, result) => {
    if (err) {
      console.error('Error creating user:', err);
      res.status(500).send('Error creating user');
      return;
    }
    res.json({ userID: result.insertId, message: 'User created successfully' });
  });
});

// Endpoint to start a new trip
app.post('/api/start-trip', (req, res) => {
  const userID = req.body.userID;

  const query = 'INSERT INTO trip (userID) VALUES (?)';

  db.query(query, [userID], (err, result) => {
    if (err) {
      console.error('Error starting trip:', err);
      res.status(500).send('Error starting trip');
      return;
    }
    res.json({ tripID: result.insertId });
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
  const { tripID, locations } = req.body;

  const locationQuery = 'INSERT INTO locations (tripID, latitude, longitude, timestamp) VALUES ?';
  const locationValues = locations.map((loc) => [tripID, loc.latitude, loc.longitude, new Date(loc.timestamp)]);

  db.query(locationQuery, [locationValues], (err, result) => {
    if (err) {
      console.error('Error inserting locations:', err);
      res.status(500).send('Error inserting locations');
      return;
    }

    const speedValues = locations.map((loc) => [tripID, new Date(loc.timestamp), loc.speed, 60]);
    const accelerationValues = locations.map((loc) => [tripID, new Date(loc.timestamp), loc.acceleration]);

    const speedQuery = 'INSERT INTO speed (tripID, time, speed, speed_limit) VALUES ?';
    const accelerationQuery = 'INSERT INTO acceleration (tripID, time, acceleration) VALUES ?';

    db.query(speedQuery, [speedValues], (err) => {
      if (err) {
        console.error('Error inserting speed data:', err);
        res.status(500).json({ success: false, message: 'Error inserting speed data' });
        return;
      }

      db.query(accelerationQuery, [accelerationValues], (err) => {
        if (err) {
          console.error('Error inserting acceleration data:', err);
          res.status(500).json({ success: false, message: 'Error inserting acceleration data' });
          return;
        }

        res.json({ success: true, message: 'Locations, speed, and acceleration data saved to database' });
      });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


