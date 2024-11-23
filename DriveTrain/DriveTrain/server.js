'use strict';
/*const { exec } = require('child_process');*/
var path = require('path');
var express = require('express');

//// Start the backend server
//exec('cd backend && node index.js', (err, stdout, stderr) => {
//    if (err) {node indcd ex.js', (err, stdout, stderr) => {
//    if (err) {
//        console.error(`Error: ${err}`);
//        return;
//    }
//    console.log(`Backend Output: ${stdout}`);
//    console.error(`Backend Error Output: ${stderr}`);
//});

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