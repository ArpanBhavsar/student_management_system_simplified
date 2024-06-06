//This is the entry point of Node.js applicaiton. When you run node app.js it starts the project from this file and run the code of this file.
//This is the main file which connects with other files in the folder
//For simplified version we will create the server, database connection and all routes inside this same file.

//Import the express module/library to create express server and managae the routes
const express = require('express'); //const means constant variable and in node.js the imported module is stored inside a vairable.

//Import the body-parser module/library to handle the body of HTTP requests
const bodyParser = require('body-parser'); 

//Import the dotenv module/library to read variables store in the .env file 
require('dotenv').config();

//Import the mongoose module/library to connect with MongoDB database and handle the CRUD operations
const mongoose = require('mongoose');

//Create the instance of express module to create and start the express server
const app = express();

//Read the variables MONGO_URI and PORT from the .env file
const {MONGO_URI, PORT} = process.env;

//Basic Homepage Route to check if the server is running perfectly or not on the browser.
app.use('/', (req, res) =>{
        res.send("Hello World!");
});

//Start the Express server using listen() funciton on port 3000
app.listen(PORT || 3000, ()=>{
        console.log(`Express server started listening on port ${PORT}. \nTo access this Node.js app open URL: http://localhost:${PORT}`)
});


//Type "node app.js" on terminal to run the Node.js app
//Use ctrl+c to stop the Node.js app