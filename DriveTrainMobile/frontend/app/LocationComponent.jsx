import React, { useState, useEffect } from 'react';

//TODO:
//-add wait between get locations calls (global var for time intervals?
//-FIND OUT HOW TO CHANGE TEXT COLOR / CREATE A STYLESHEET
//-

var calculatedScore = 100;

const LocationComponent = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [simulatedLocation, setSimulatedLocation] = useState({ latitude: null, longitude: null });
  const [speed, setSpeed] = useState(null);
  const [acceleration, setAcceleration] = useState(null);
  const [lastLocation, setLastLocation] = useState(null);
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

  const simulateLocationChange = async () => {
    const simulatedLocations = { latitude: location.latitude, longitude: location.longitude + 0.009 };
    setLocation(simulatedLocations);
  };

  const getSpeed = (lastLocation, currentLocation) => {
    if (!lastLocation || !currentLocation) return 0;

    const distance = Math.sqrt(
      Math.pow((lastLocation.latitude / kilometersPerDegree - currentLocation.latitude / kilometersPerDegree), 2) +
      Math.pow((lastLocation.longitude / kilometersPerDegree - currentLocation.longitude / kilometersPerDegree), 2)
    );
    const calculatedSpeed = (distance / 10) * 3600;
    console.log("Speed = ", calculatedSpeed, 'km/h');
    setSpeed(calculatedSpeed);
    return calculatedSpeed;
  };

  const getAcceleration = async (currentLocation) => {
    if (lastLocation && currentLocation) {
      const speed = getSpeed(lastLocation, currentLocation);
      const time = 10;
      const distance = Math.sqrt(
        Math.pow((lastLocation.latitude / kilometersPerDegree - currentLocation.latitude / kilometersPerDegree), 2) +
        Math.pow((lastLocation.longitude / kilometersPerDegree - currentLocation.longitude / kilometersPerDegree), 2)
      );
      const calculatedAcceleration = 2 * (distance - speed) / (time ** 2);
      console.log('Acceleration =', calculatedAcceleration, 'km/h/s');
      setAcceleration(calculatedAcceleration);
      return calculatedAcceleration;
    }
  };

  const calculateScore = () => {
    const speedLimit = 80;
    const maxAcceleration = 20;
    if (speed > speedLimit) {
      calculatedScore -= ((speed - speedLimit) / 10);
    }
    if (acceleration > 0) {
      calculatedScore -= (acceleration - maxAcceleration);
    }
    setScore(calculatedScore);
    return calculatedScore;
  };

  useEffect(() => {
    getLocation();
    //simulateLocationChange();
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
      <h1 color={'white'}>User Location</h1>
      <button onClick={getLocation}>Get Location</button>
      <button onClick={simulateLocationChange}>Simulate Location Change</button>
      {location.latitude && location.longitude && (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      )}
      <h1 color={'white'}>Speed and Acceleration</h1>
      {speed !== null && <p>Speed: {speed} km/h</p>}
      {acceleration !== null && <p>Acceleration: {acceleration} km/h/s</p>}
      <h1>Driver Score</h1>
      {score !== null && <p>Score: {score}</p>}
    </div>
  );
};

export default LocationComponent;
