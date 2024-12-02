import React, { useState, useEffect } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import LocationComponent from './LocationComponent';

const kilometersPerDegree = 111.32; // Approximate value for converting degrees to kilometers

const App = () => {
  const [locations, setLocations] = useState([]);
  const [tracking, setTracking] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [tripID, setTripID] = useState(null);

  useEffect(() => {
    if (tracking) {
      // Start tracking: Set an interval to get the user's location every 5 seconds
      const id = setInterval(() => {
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, timestamp } = position.coords;
            setLocations((prevLocations) => {
              const newLocations = [...prevLocations, { latitude, longitude, timestamp }];
              if (newLocations.length > 1) {
                // Calculate distance, speed, and acceleration
                const prevLocation = newLocations[newLocations.length - 2];
                const distance = Math.sqrt(
                  Math.pow((prevLocation.latitude / kilometersPerDegree - latitude / kilometersPerDegree), 2) +
                  Math.pow((prevLocation.longitude / kilometersPerDegree - longitude / kilometersPerDegree), 2)
                );
                const time = (timestamp - prevLocation.timestamp) / 1000; // Time in seconds
                const speed = distance / time; // Speed in meters per second
                const prevSpeed = prevLocation.speed || 0;
                const acceleration = (speed - prevSpeed) / time; // Acceleration in meters per second squared

                // Add speed and acceleration to the latest location
                newLocations[newLocations.length - 1].speed = speed;
                newLocations[newLocations.length - 1].acceleration = acceleration;
              }
              return newLocations;
            });
          },
          (error) => {
            console.error(error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }, 2000); // Collect location every 2 seconds
      setIntervalId(id);
    } else if (intervalId) {
      // Stop tracking: Clear the interval and send the collected locations
      clearInterval(intervalId);
      setIntervalId(null);
      sendLocations(); // Automatically send locations when tracking stops
    }

    // Cleanup function: Clear the interval when the component unmounts or tracking stops
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [tracking]); // Dependency array: Re-run this effect when the tracking state changes

  // Function to start a new trip
  //MAY HAVE TO CHANGE POST ADDRESS:
  //try 192.168.2.233 -colins IP - http://192.168.2.233:3000/api/locations
  //http://localhost:8081/api/locations
  const startTrip = async () => {
    try {
      const response = await axios.post('http://192.168.2.233:3000/api/start-trip', { userID: 1 });
      return response.data.tripID;
    } catch (error) {
      console.error('Error starting trip:', error);
    }
  };

  const handleTracking = async () => {
    if (!tracking) {
      const newTripID = await startTrip();
      setTripID(newTripID);
    }
    setTracking(!tracking);
  };

  //MAY HAVE TO CHANGE POST ADDRESS:
  //try 192.168.2.233 -colins IP - http://192.168.2.233:3000/api/locations
  //http://localhost:8081/api/locations

  const sendLocations = async () => {
    try {
      const response = await axios.post('http://192.168.2.233:3000/api/locations', {
        tripID,
        locations,
      });
      if (response.data.success) {
        console.log('Locations saved:', response.data.insertedRows);
        setLocations([]); // Clear the array after sending
      } else {
        console.error('Failed to save locations');
      }
    } catch (error) {
      console.error('Error sending locations:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={tracking ? "Stop Tracking" : "Start Tracking"}
        onPress={() => setTracking(!tracking)}
      />
      <Text style={tracking ? styles.whiteText : styles.whiteText}>
        {tracking ? "Tracking is ON" : "Tracking is OFF"}
          </Text>
          <LocationComponent />
    </View>
  );
};


//stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', 
  },
  whiteText: {
    color: 'white',
  },
  blackText: {
    color: 'black',
  },
});

export default App;