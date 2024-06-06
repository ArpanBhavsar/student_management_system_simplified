// Import the express module/library to create express server and manage the routes
const express = require("express");

// Import the body-parser module/library to handle the body of HTTP requests
const bodyParser = require("body-parser");

// Import the dotenv module/library to read variables stored in the .env file
require("dotenv").config();

// Import the mongodb module/library to connect with MongoDB database and handle the CRUD operations
const { MongoClient } = require("mongodb");

// Create the instance of express module to create and start the express server
const app = express();

// Use body-parser middleware
app.use(bodyParser.json());

// Read the variables MONGO_URI and PORT from the .env file
const { MONGO_URI, PORT = 3000 } = process.env;

console.log("MONGO_URI:", MONGO_URI);
console.log("PORT:", PORT);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(MONGO_URI);
      async function run() {
        try {
          // Connect the client to the server	(optional starting in v4.7)
          await client.connect();
          // Send a ping to confirm a successful connection
          await client.db("admin").command({ ping: 1 });
          console.log("Pinged your deployment. You successfully connected to MongoDB!");
        } finally {
          // Ensures that the client will close when you finish/error
          await client.close();
        }
      }
      run().catch(console.dir);
      

// Type "node app.js" on terminal to run the Node.js app
// Use ctrl+c to stop the Node.js app
