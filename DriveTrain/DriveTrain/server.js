'use strict';
var path = require('path');
var express = require('express');

var app = express();

// Serve static files from the React app
var staticPath = path.join(__dirname, 'frontend/build');
app.use(express.static(staticPath));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

// Allows you to set port in the project properties.
app.set('port', process.env.PORT || 3001);

var server = app.listen(app.get('port'), function () {
    console.log('Server is listening on port ' + app.get('port'));
});