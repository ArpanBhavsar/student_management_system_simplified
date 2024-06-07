//This is the entry point of Node.js applicaiton. When you run node app.js it starts the project from this file and run the code of this file.
//This is the main file which connects with other files in the folder
//For simplified version we will create the server, database connection and all routes inside this same file.

//Import the express module/library to create express server and managae the routes
const express = require("express"); //const means constant variable and in node.js the imported module is stored inside a vairable.

//Import the body-parser module/library to handle the body of HTTP requests
const bodyParser = require("body-parser");

//Import the path module to handle the folder and file path for views
const path = require("path");

//Import the dotenv module/library to read variables store in the .env file
require("dotenv").config();

//Import the mongodb module/library to connect with MongoDB database and handle the CRUD operations
const { MongoClient } = require("mongodb");
const { title } = require("process");

//Create the instance of express module to create and start the express server
const app = express();

//Use the body-parser module to get the request body in JSON format
app.use(bodyParser.json());

//Set the view engine or Template Engine to EJS
app.set('view engine', 'ejs');

//Set the path to views folder to help server find the location of ejs files
app.set('views', path.join(__dirname, 'views'))

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
    app.get("/students", async (req, res) => {
      //Try catch block to try the code and print the error if any error occurs
      try {
        //Retrieve all the students using db.collection.find() and store it in students variable.
        //toArray() funciton is used to combine all data in JSON Array format.
        const students = await db.collection("students").find().toArray();
        // //Send the response of students data in JSON format.
        // res.json(students);
        //Connect the index.ejs to show the students data dynamically on Webpage
        res.render('index', {title: "Student Management System", students: students});
      } catch (error) {
        //Catch block to catch any error and print it on the console
        res.json({
          error_status: "An error occured while fetching the students.",
          error_message: error.message,
        });
      }
    });

    //Route to add one student to students collection. To add or create new data we will use POST request.
    app.post("/addOneStudent", async (req, res) => {
      //Try catch block to try the code and print the error if any error occurs
      try {
        // Create student variable to call db.collection.insertOne() funtion to add one student.
        // For adding one student we will use the request body from the POST request as a data to add
        const student = await db.collection("students").insertOne(req.body);
        //Send the student data which we just added to database back to user to show success that student has been added successfully.
        // res.json(student);
        // Redirect to /students routes to show all students
        res.redirect("/students");
      } catch (error) {
        //Catch block to catch any error and print it on the console
        res.json({
          error_status: "An error occured while adding one the student.",
          error_message: error.message,
        });
      }
    });

    //Route to add many student to students collection. To add or create new data we will use POST request.
    app.post("/addManyStudent", async (req, res) => {
        //Try catch block to try the code and print the error if any error occurs
        try {
          //Create students variable to call db.collection.insertMany() funtion to add many student.
          //For adding many student we will use the request body from the POST request as a data to add
          const student = await db.collection("students").insertMany(req.body);
          //Send the student data which we just added to database back to user to show success that student has been added successfully.
          res.json(student);
        } catch (error) {
          //Catch block to catch any error and print it on the console
          res.json({
            error_status: "An error occured while adding one the student.",
            error_message: error.message,
          });
        }
      });

    //Route to update one student in students collection. To update the data we will use PUT request.
    app.put("/updateOneStudent/:student_id", async (req, res) => {
      //Try catch block to try the code and print the error if any error occurs
      try {
        //Create studentUpdate variable to call db.collection.updateOne() funciton to update one student.
        //Same as insertOne we will take JSON req body for student data and from the URL we will take the student_id as query. It can be accessed using req.params
        const studentUpdate = await db
          .collection("students")
          .updateOne(
            { student_id: parseInt(req.params.student_id) },
            { $set: req.body }
          );
        //Send the response in JSON
        res.json(studentUpdate);
      } catch (error) {
        //Catch block to catch any error and print it on the console
        res.json({
          error_status: "An error occured while updaing one student.",
          error_message: error.message,
        });
      }
    });

    //Route to update many student in students collection. To update the data we will use PUT request.
    app.put("/updateManyStudent/:batch_year", async (req, res) => {
        //Try catch block to try the code and print the error if any error occurs
        try {
          //Create studentUpdate variable to call db.collection.updateOne() funciton to update one student.
          //Same as insertOne we will take JSON req body for student data and from the URL we will take the student_id as query. It can be accessed using req.params
          const studentUpdate = await db
            .collection("students")
            .updateMany(
              { batch_year: req.params.batch_year },
              { $set: req.body }
            );
          //Send the response in JSON
          res.json(studentUpdate);
        } catch (error) {
          //Catch block to catch any error and print it on the console
          res.json({
            error_status: "An error occured while updaing one student.",
            error_message: error.message,
          });
        }
      });

    //Route to delete one student in students collection. To delete the data we will use DELETE request.
    app.post("/deleteOneStudent/:student_id", async (req, res) => {
      //Try catch block to try the code and print the error if any error occurs
      try {
        //Create deleteStudent variable to call the db.collection.deleteOne() funciton to delete one student based on student id.
        //From the URL we will take the student_id as query. It can be accessed using req.params to delete student based on student_id
        const deleteStudent = await db.collection('students').deleteOne({student_id: parseInt(req.params.student_id)});
        //Send the response in JSON
        res.redirect('/students');

      } catch (error) {
        //Catch block to catch any error and print it on the console
        res.json({
          error_status: "An error occured while deleting one student.",
          error_message: error.message,
        });
      }
    });

    //Route to show user form to add new Student
    app.get('/newStudent', (req, res)=>{
        //Render the new_student.ejs file to show user form
        res.render('new_student');
    });

    //Route to show user form to update Student
    app.get('/updateStudent/:student_id', async (req, res)=>{
        try{
                const student = await db.collection('students').find({student_id: parseInt(req.params.student_id)}).toArray();
                // res.json(student[0]);
                //Render the new_student.ejs file to show user form
                res.render('update_student', {student: student[0]});
        }
        catch (error){
            //Catch block to catch any error and print it on the console
        res.json({
                error_status: "An error occured while deleting one student.",
                error_message: error.message,
              });    
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
