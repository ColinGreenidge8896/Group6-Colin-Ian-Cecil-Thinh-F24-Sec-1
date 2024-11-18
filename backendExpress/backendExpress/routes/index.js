var express = require('express');
var router = express.Router();

// testing code

//unknown how this will work or if it will even remain in this file
const speedLimitApiUrl = 'https://roads.googleapis.com/v1/speedLimits?path=';
const apiKey = '&key=YOUR_API_KEY';
function getSpeedLimit(path) {
    // unfinished
    // example of var passed: path = '38.75807927603043,-9.03741754643809';
    fetch(speedLimitApiUrl + path + apiKey).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .then(data => {
            const speedLimit = data.speedLimits.speedLimit
            console.log(data);
            console.log(speedLimit);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



/* GET home page. */
router.get('/', function (req, res, next) {
    
    res.render('index', { title: "Express" });
    
});

module.exports = router;
