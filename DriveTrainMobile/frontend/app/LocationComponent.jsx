import React, { useState, useEffect } from 'react';

const time = 1; // Interval time in seconds
const kilometersPerDegree = 0.009;

const LocationComponent = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [speed, setSpeed] = useState(null);
  const [acceleration, setAcceleration] = useState(null);
  const [lastLocation, setLastLocation] = useState(null);
  const [prevSpeed, setPrevSpeed] = useState(0);
  const [score, setScore] = useState(100);
  const [isSimulating, setIsSimulating] = useState(false);

  const getLocation = () => {
    if (!isSimulating && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const simulateLocationChange = () => {
    setIsSimulating(true);
    const numLocations = 10;
    const minSpeed = 30; // km/h
    const maxSpeed = 60; // km/h
    const simulatedLocations = [];

    for (let i = 0; i < numLocations; i++) {
      const randomSpeed = Math.random() * (maxSpeed - minSpeed) + minSpeed; // Random speed between 30 and 60 km/h
      const distance = (randomSpeed / 3600) * time; // Distance in degrees (since time is in seconds and speed is in km/h)
      const newLongitude = location.longitude + (distance * kilometersPerDegree);

      
      simulatedLocations.push({
        latitude: location.latitude,
        longitude: newLongitude,
      });


      // Update location for the next iteration
      location.longitude = newLongitude;
    }

    // Simulate the location changes one after another
    simulatedLocations.forEach((loc, index) => {
      setTimeout(() => {
        setLocation(loc);
        getAcceleration(loc);
        if (index === simulatedLocations.length - 1) {
          setIsSimulating(false); // End simulation after the last location
        }
      }, index * time * 1000); // Delay each update by `time` seconds
    });
  };

  const getSpeed = (lastLocation, currentLocation) => {
    if (!lastLocation || !currentLocation) return 0;

    const distance = Math.sqrt(
      Math.pow((lastLocation.latitude / kilometersPerDegree - currentLocation.latitude / kilometersPerDegree), 2) +
      Math.pow((lastLocation.longitude / kilometersPerDegree - currentLocation.longitude / kilometersPerDegree), 2)
    );
    const calculatedSpeed = (distance / time) * 3600;
    setPrevSpeed(speed);
    setSpeed(calculatedSpeed.toFixed(2));
    console.log("Speed = ", calculatedSpeed, 'km/h');
    return calculatedSpeed;
  };

  const getAcceleration = (currentLocation) => {
    if (lastLocation && currentLocation) {
      const speed = getSpeed(lastLocation, currentLocation);
      const calculatedAcceleration = (speed - prevSpeed) / time;
      setAcceleration(calculatedAcceleration.toFixed(2));
      console.log('Acceleration =', calculatedAcceleration, 'km/h/s');
      return calculatedAcceleration;
    }
  };

  const calculateScore = () => {
    const speedLimit = 80;
    const maxAcceleration = 20;
    let newScore = score;

    if (speed > speedLimit) {
      newScore -= ((speed - speedLimit) / time);
    }
    if (acceleration > 0) {
      newScore -= (acceleration - maxAcceleration);
    }
    if (newScore < 0) {
      newScore = 0;
    }
    setScore(newScore);
    return newScore;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      getLocation();
    }, time * 1000);

    return () => clearInterval(intervalId);
  }, [isSimulating]);

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