import React, { useState, useEffect } from 'react';

const SpeedAndAccelerationComponent = ({ currentLocation }) => {
    const [speed, setSpeed] = useState(null);
    const [acceleration, setAcceleration] = useState(null);
    const [lastLocation, setLastLocation] = useState(null);

    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

    const getSpeed = (lastLocation, currentLocation) => {
        const kilometersPerDegree = 0.009;
        const distance = Math.sqrt(
            Math.pow((lastLocation.latitude / kilometersPerDegree - currentLocation.latitude / kilometersPerDegree), 2) +
            Math.pow((lastLocation.longitude / kilometersPerDegree - currentLocation.longitude / kilometersPerDegree), 2)
        );
        const calculatedSpeed = (distance / 10) * 3600;
        console.log("Speed = ", calculatedSpeed, 'km/h');
        setSpeed(calculatedSpeed);
        return calculatedSpeed;
    };

    const getAcceleration = async () => {
        if (lastLocation) {
            const speed = getSpeed(lastLocation, currentLocation);
            const time = 10;
            const kilometersPerDegree = 0.009;
            const distance = Math.sqrt(
                Math.pow((lastLocation.latitude / kilometersPerDegree - currentLocation.latitude / kilometersPerDegree), 2) +
                Math.pow((lastLocation.longitude / kilometersPerDegree - currentLocation.longitude / kilometersPerDegree), 2)
            );
            const calculatedAcceleration = 2 * (distance - speed) / (time ^ 2);
            console.log('Acceleration =', calculatedAcceleration, 'km/h/s');
            setAcceleration(calculatedAcceleration);
        }
    };

    useEffect(() => {
        if (currentLocation.latitude && currentLocation.longitude) {
            if (lastLocation) {
                getAcceleration();
            }
            setLastLocation(currentLocation);
        }
    }, [currentLocation]);

    return (
        <div>
            <h1>Speed and Acceleration</h1>
            {speed !== null && <p>Speed: {speed} km/h</p>}
            {acceleration !== null && <p>Acceleration: {acceleration} km/h/s</p>}
        </div>
    );
};

export default SpeedAndAccelerationComponent;