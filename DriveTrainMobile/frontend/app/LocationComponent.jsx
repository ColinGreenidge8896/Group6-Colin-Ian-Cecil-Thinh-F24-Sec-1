import React, { useState, useEffect } from 'react';
var calculatedScore = 100;
const LocationComponent = () => {
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [simulatedLocation, setSimulatedLocation] = useState({ latitude: null, longitude: null });
    const [speed, setSpeed] = useState(null);
    const [acceleration, setAcceleration] = useState(null);
    const [lastLocation, setLastLocation] = useState(null);
    const [prevSpeed, setPrevSpeed] = useState(null);
    const [score, setScore] = useState(null);

    const kilometersPerDegree = 0.009;
    

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

    const simulateLocationChange = () => {
        const simulatedLocations = {
            latitude: location.latitude,
            longitude: location.longitude + kilometersPerDegree / 50,
        };
        setLocation(simulatedLocations);
        getAcceleration(simulatedLocations);
    };

    const getSpeed = (lastLocation, currentLocation) => {
        if (!lastLocation || !currentLocation) return 0;
        if (speed) {
            setPrevSpeed(speed);
        } else {
            setPrevSpeed(0);
        }
        
        const distance = Math.sqrt(
            Math.pow((lastLocation.latitude / kilometersPerDegree - currentLocation.latitude / kilometersPerDegree), 2) +
            Math.pow((lastLocation.longitude / kilometersPerDegree - currentLocation.longitude / kilometersPerDegree), 2)
        );
        const time = 1;
        const calculatedSpeed = (distance / time) * 3600;
        console.log("Speed = ", calculatedSpeed, 'km/h');
        setSpeed(calculatedSpeed);
        return calculatedSpeed;
    };

    const getAcceleration = (currentLocation) => {
        if (lastLocation && currentLocation) {
            const speed = getSpeed(lastLocation, currentLocation);
            const time = 1;
            
            const calculatedAcceleration = (speed - prevSpeed)/time;
            console.log('Acceleration =', calculatedAcceleration, 'km/h/s');
            setAcceleration(calculatedAcceleration);
            return calculatedAcceleration;
        }
    };

    const calculateScore = () => {
        const speedLimit = 80;
        const maxAcceleration = 20;
        const time = 1;
        if (speed > speedLimit) {
            calculatedScore -= ((speed - speedLimit) / time);
        }
        if (acceleration > 0) {
            calculatedScore -= (acceleration - maxAcceleration);
        }
        if (calculatedScore < 0) {
            calculatedScore = 0;
        }
        setScore(calculatedScore);
        return calculatedScore;
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            getLocation();
            //time between getlocation calls
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (location.latitude && location.longitude) {
            if (lastLocation) {
                getAcceleration(location);
                calculateScore();
            }
            setLastLocation(location);
        }
    }, [location]);

    return (
        <div>
            <h1 style={{ color: 'white' }}>User Location</h1>
            <button onClick={getLocation}>Get Location</button>
            <button onClick={simulateLocationChange}>Simulate Location Change</button>
            {location.latitude && location.longitude && (
                <div>
                    <p style={{ color: 'white' }}>Latitude: {location.latitude}</p>
                    <p style={{ color: 'white' }}>Longitude: {location.longitude}</p>
                </div>
            )}
            <h1 style={{ color: 'white' }}>Speed and Acceleration</h1>
            {speed !== null && <p style={{ color: 'white' }}>Speed: {speed} km/h</p>}
            {acceleration !== null && <p style={{ color: 'white' }}>Acceleration: {acceleration} km/h/s</p>}
            <h1 style={{ color: 'white' }}>Driver Score</h1>
            {score !== null && <p style={{ color: 'white' }}>Score: {score}</p>}
        </div>
    );
};

export default LocationComponent;
