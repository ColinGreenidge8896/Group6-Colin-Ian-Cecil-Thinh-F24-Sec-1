import React, { useState, useEffect } from 'react';
import { Button, View, Text } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';

const App = () => {
  const [locations, setLocations] = useState([]);
  const [tracking, setTracking] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (tracking) {
      const id = setInterval(() => {
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocations((prevLocations) => [
              ...prevLocations,
              { latitude, longitude },
            ]);
          },
          (error) => {
            console.error(error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }, 1000); // Collect location every 5 seconds
      setIntervalId(id);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [tracking]);
//try 192.168.2.233 -colins IP
//http://localhost:8081/api/locations
const sendLocations = async () => {
    try {
      const response = await axios.post('http://192.168.2.233:3000/api/locations', {
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
    <View>
      <Button
        title={tracking ? "Stop Tracking" : "Start Tracking"}
        onPress={() => setTracking(!tracking)}
      />
      <Button title="Send Locations" onPress={sendLocations} />
      <Text>{tracking ? "Tracking is ON" : "Tracking is OFF"}</Text>
    </View>
  );
};

export default App;