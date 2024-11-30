import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import LocationComponent from './LocationComponent';

const BACKEND_URL = 'http://10.0.0.250:3001';

const App = () => {
    const [tracking, setTracking] = useState(false);
    const [driving, setDriving] = useState(false);
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
    const startDrive = () => {
        setDriving(true);
    }
    const endDrive = () => {
        setDriving(false);
        //write to db?
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'flex-end', // Adjusts the button position to lower on the screen 
            alignItems: 'center',
            paddingBottom: 50, // Adds some padding to move it further up from the bottom edge 
        },
        button: {
            width: 200,
            paddingVertical: 100,
            borderRadius: 5,
        },
    });

    if (driving) {
        
        return (
            <View>
                <Button title={tracking ? "Stop Tracking" : "Start Tracking"} onPress={tracking ? stopTracking : startTracking} />
                <View style={styles.container}>
                    <Button title={driving ? "End Drive" : "Start Drive"} onPress={driving ? endDrive : startDrive} color="#007bff" />
                </View>

                <LocationComponent />
            </View>

        );
    }
    else {
        return (
            <View>
                <Button title={tracking ? "Stop Tracking" : "Start Tracking"} onPress={tracking ? stopTracking : startTracking} />
                <View style={styles.container}>
                    <Button title={driving ? "End Drive" : "Start Drive"} onPress={driving ? endDrive : startDrive} color="#007bff" />
                </View>
            </View>
        );
    }
};

export default App;
