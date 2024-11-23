import React, { useState, useEffect } from 'react';
import SpeedAndAccelerationComponent from './SpeedAndAccelerationComponent';

const LocationComponent = () => {
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [simulatedLocation, setSimulatedLocation] = useState({ latitude: null, longitude: null });

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };

    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

    const simulateLocationChange = async () => {
        const simulatedLocations = [
            { latitude: 37.7749, longitude: -122.4194 }, // San Francisco
            { latitude: 37.7749, longitude: -122.4284 }, // Slightly north-east
            { latitude: 37.7749, longitude: -122.4374 }, // Further north-east
            // Add more locations as needed
        ];

        for (let i = 0; i < simulatedLocations.length; i++) {
            setSimulatedLocation(simulatedLocations[i]);
            await sleep(10000); // Wait for 10 seconds before updating to the next location
        }
    };

    useEffect(() => {
        getLocation();
        simulateLocationChange();
    }, []);

    return (
        <div>
            <h1>User Location</h1>
            <button onClick={getLocation}>Get Location</button>
            {location.latitude && location.longitude && (
                <div>
                    <p>Latitude: {location.latitude}</p>
                    <p>Longitude: {location.longitude}</p>
                </div>
            )}
            <SpeedAndAccelerationComponent currentLocation={simulatedLocation} />
        </div>
    );
};

export default LocationComponent;