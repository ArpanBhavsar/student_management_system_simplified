//This is the entry point of Node.js applicaiton. When you run node app.js it starts the project from this file and run the code of this file.
//This is the main file which connects with other files in the folder
//For simplified version we will create the server, database connection and all routes inside this same file.

//Import the express module/library to create express server and managae the routes
const express = require("express"); //const means constant variable and in node.js the imported module is stored inside a vairable.

//Import the body-parser module/library to handle the body of HTTP requests
const bodyParser = require("body-parser");

//Import the dotenv module/library to read variables store in the .env file
require("dotenv").config();

//Import the mongodb module/library to connect with MongoDB database and handle the CRUD operations
const { MongoClient } = require("mongodb");

//Create the instance of express module to create and start the express server
const app = express();

//Use the body-parser module to get the request body in JSON format
app.use(bodyParser.json());

//Read the variables MONGO_URI and PORT from the .env file
const { MONGO_URI, PORT } = process.env;

//Create the client to connect with MongoDB. This variable will be used everytime when you want to perfrom any operation on MongoDB
const client = new MongoClient(MONGO_URI);

//Check if the connection using clien is successful with MongoDB or not and if successful all the routes will be created inside this funciton
//All the routes and code to start the express server will be inside this funciton to make sure that each route and the whole server can access the MongoDB connection.
//Created the async function to wait for the connection to establish first to receive the message.
const startServer = async () => {
  try {
    // Await the connection to MongoDB. It will wait for the connection to establish first
    await client.connect();
    //Print the success message on console once its connceted to MongoDB
    console.log("Successfully connected to MongoDB");

    //Define the db after connecting to MongoDB Database
    const db = client.db();

    // Basic Homepage Route to check if the server is running perfectly or not on the browser.
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    //Route to get all students from students collection. To retrieve the data we will use GET request.
    app.get("/students", async (req, res)=>{
        //Try catch block to try the code and print the error if any error occurs
        try{
                //Retrieve all the students using db.collection.find() and store it in students variable.
                //toArray() funciton is used to combine all data in JSON Array format.
                const students = await db.collection('students').find().toArray();
                //Send the response of students data in JSON format. 
                res.json(students);
        } 
        //Catch block to catch any error and print it on the console
        catch(error){
                res.json({error_status:'An error occured while fetching the students.', error_message: error.message});
        }
    });

    //Route to add one student to students collection. To add or create new data we will use POST request.
    app.post("/addOneStudent", async (req, res)=>{
        //Try catch block to try the code and print the error if any error occurs
        try{
                //Create student variable to call db.collection.insertOne() funtion to add one student.
                //For adding one student we will use the request body from the POST request as a data to add
                const student = await db.collection('students').insertOne(req.body);
                //Send the student data which we just added to database back to user to show success that student has been added successfully.
                res.json(student);
        }
        //Catch block to catch any error and print it on the console
        catch(error){
                res.json({error_status:'An error occured while adding one the student.', error_message: error.message});
        }
    });

    // Start the Express server using listen() function on the provided port
    app.listen(PORT, () => {
      console.log(
        `Express server started listening on port ${PORT}. \nTo access this Node.js app open URL: http://localhost:${PORT}`
      );
    });
  } catch (err) {
        //Catch and print the error on console when the error occurs while connecting with MongoDB.
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};

// Start the server
startServer();

//Type "node app.js" on terminal to run the Node.js app
//Use ctrl+c to stop the Node.js app
