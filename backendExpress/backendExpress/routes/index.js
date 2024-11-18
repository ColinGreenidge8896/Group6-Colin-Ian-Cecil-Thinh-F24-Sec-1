var express = require('express');
var router = express.Router();

// testing code
/*
navigator.permissions = "granted";
function handlePermission() {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
            report(result.state);
            geoBtn.style.display = "none";
        } else if (result.state === "prompt") {
            report(result.state);
            geoBtn.style.display = "none";
            navigator.geolocation.getCurrentPosition(
                revealPosition,
                positionDenied,
                geoSettings,
            );
        } else if (result.state === "denied") {
            report(result.state);
            geoBtn.style.display = "inline";
        }
        result.addEventListener("change", () => {
            report(result.state);
        });
    });
}

function report(state) {
    console.log(`Permission ${state}`);
}

handlePermission();

navigator.geolocation.getCurrentPosition(success);
function success(pos) {
    console.log("pos lat = ", `Latitude : ${crd.latitude}`);
    console.log("pos long = ", `Longitude : ${crd.longitude}`);
}
*/

/* GET home page. */
router.get('/', function (req, res, next) {
    
    res.render('index', { title: "Express" });
    
});

module.exports = router;


//const geoGetLocation = () => {
//    if (navigator.geolocation) {
//        navigator.geolocation.getCurrentPosition(success, error, geoOptions);
//    } else {
//        console.log("Geolocation services are not supported by your web browser.");
//    }
//}


// test sample code
//const success = (position) => {
//    const latitude = position.coords.latitude;
//    const longitude = position.coords.longitude;
//    const altitude = position.coords.altitude;
//    const accuracy = position.coords.accuracy;
//    console.log(`lat: ${latitude} long: ${longitude}`);
//}

//const error = (error) => {
//    console.log(`Unable to retrieve your location due to ${error.code}: ${error.message}`);
//}

//const geoOptions = {
//    enableHighAccuracy: true,
//    maximumAge: 30000,
//    timeout: 27000
//};