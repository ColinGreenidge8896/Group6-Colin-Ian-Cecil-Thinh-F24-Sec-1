var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

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
        } else {
            console.log('Broken');
        }
        result.addEventListener("change", () => {
            report(result.state);
        });
    });
}

function report(state) {
    console.log(`Permission ${state}`);
}
function getLocation() {
    handlePermission()
    navigator.geolocation.getCurrentPosition(successfulGetLocation);
}

function successfulGetLocation(/*GeolocationPosition*/ position) {
    const coordinates = position.coords;
    console.log("Test success. Coordinates: ");
    console.log(`Latitude : ${coordinates.latitude}`);
    console.log(`Longitude : ${coordinates.longitude}`);
}

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


if ('geolocation' in navigator) {
    console.log('Geolocation is Available');
    getLocation();
} else {
    console.log('Geolocation is NOT Available');
    getLocation();
}