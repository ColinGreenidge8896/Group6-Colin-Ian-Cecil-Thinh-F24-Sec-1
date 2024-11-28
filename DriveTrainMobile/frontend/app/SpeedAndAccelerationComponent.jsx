// import React, { useState, useEffect } from 'react';
// var calculatedScore = 100;
// const SpeedAndAccelerationComponent = ({ currentLocation }) => {

//     const [speed, setSpeed] = useState(null);
//     const [acceleration, setAcceleration] = useState(null);
//     const [lastLocation, setLastLocation] = useState(null);
//     const [score, setScore] = useState(null);

//     //const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
//     const kilometersPerDegree = 0.009;

//     const getSpeed = (lastLocation, currentLocation) => {
        
//         const distance = Math.sqrt(
//             Math.pow((lastLocation.latitude / kilometersPerDegree - currentLocation.latitude / kilometersPerDegree), 2) +
//             Math.pow((lastLocation.longitude / kilometersPerDegree - currentLocation.longitude / kilometersPerDegree), 2)
//         );
//         const calculatedSpeed = (distance / 10) * 3600;
//         console.log("Speed = ", calculatedSpeed, 'km/h');
//         setSpeed(calculatedSpeed);
//         return calculatedSpeed;
//     };

//     const getAcceleration = async () => {
//         if (lastLocation) {
//             const speed = getSpeed(lastLocation, currentLocation);
//             const time = 10;
//             const distance = Math.sqrt(
//                 Math.pow((lastLocation.latitude / kilometersPerDegree - currentLocation.latitude / kilometersPerDegree), 2) +
//                 Math.pow((lastLocation.longitude / kilometersPerDegree - currentLocation.longitude / kilometersPerDegree), 2)
//             );
//             const calculatedAcceleration = 2 * (distance - speed) / (time ^ 2);
//             console.log('Acceleration =', calculatedAcceleration, 'km/h/s');
//             setAcceleration(calculatedAcceleration);
//             return calculatedAcceleration;
//         }
//     };
//     const calculateScore = () => {
//         const speedLimit = 80;
//         const maxAcceleration = 20;
//         if (speed > 80) {
//             calculatedScore = calculatedScore - ((speed - speedLimit) / 10);
//         }
//         if (acceleration > 0) {
//             calculatedScore = calculatedScore - (acceleration - maxAcceleration);
//         }
//         setScore(calculatedScore);
//         return calculatedScore;
//     }


//     useEffect(() => {
//         if (currentLocation.latitude && currentLocation.longitude) {
//             if (lastLocation) {
//                 getAcceleration();
//                 calculateScore();
//             }
//             setLastLocation(currentLocation);
//         }
//     }, [currentLocation]);

//     return (
//         <div>
//             <h1>Speed and Acceleration</h1>
//             {speed !== null && <p>Speed: {speed} km/h</p>}
//             {acceleration !== null && <p>Acceleration: {acceleration} km/h/s</p>}
//             <h1>Driver Score</h1>
//             {score !== null && <p>Score: {score}</p>}
//         </div>
//     );
// };

// export default SpeedAndAccelerationComponent;