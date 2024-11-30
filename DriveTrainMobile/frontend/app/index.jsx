import React, { useState, useEffect } from 'react';
import { View, Button } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import LocationComponent from './LocationComponent';

const BACKEND_URL = 'http://10.0.0.250:3001';

const App = () => {
    const [tracking, setTracking] = useState(false);
    const [locations, setLocations] = useState([]);
    const [speed, setSpeed] = useState(0);
    const [acceleration, setAcceleration] = useState(0);

    useEffect(() => {
        let watchId;
        let intervalId;
        /*
        if (tracking) {
            watchId = Geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude, speed } = position.coords;
                    setLocations((prev) => [...prev, { latitude, longitude, speed, timestamp: Date.now() }]);
                    setSpeed(speed);
                    // Calculate acceleration here based on speed changes over time
                },
                (error) => console.error(error),
                { enableHighAccuracy: true, distanceFilter: 0 }
            );

        intervalId = setInterval(() => {
            Geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude, speed } = position.coords;
                    setLocations((prev) => [...prev, { latitude, longitude, speed, timestamp: Date.now() }]);
                    setSpeed(speed);
                    // Calculate acceleration here based on speed changes over time
                },
                (error) => console.error(error),
                { enableHighAccuracy: true }
            );
        }, 1000);
        } else {
            if (watchId) Geolocation.clearWatch(watchId);
            if (intervalId) clearInterval(intervalId);
        } */
        return () => {
            //if (watchId) Geolocation.clearWatch(watchId);
            //if (intervalId) clearInterval(intervalId);
        };
    }, [tracking]);

    const startTracking = () => setTracking(true);
    const stopTracking = () => {
        setTracking(false);
        fetch(`${BACKEND_URL}/api/locations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(locations),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // Handle the driving score received from the backend
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <View>
            <Button title={tracking ? "Stop Tracking" : "Start Tracking"} onPress={tracking ? stopTracking : startTracking} />
            <LocationComponent />
        </View>
    );
};

export default App;
