import React, { useState } from 'react';

const LocationComponent = () => {
    const [location, setLocation] = useState({ latitude: null, longitude: null });

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
        </div>
    );
};

export default LocationComponent;