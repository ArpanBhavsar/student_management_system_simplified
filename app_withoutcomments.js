const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const app = express();

app.use(bodyParser.json());

const { MONGO_URI, PORT } = process.env;

const client = new MongoClient(MONGO_URI);

const startServer = async () => {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB");

    const db = client.db();

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.get("/students", async (req, res) => {
      try {
        const students = await db.collection("students").find().toArray();
        res.json(students);
      } catch (error) {
        res.json({
          error_status: "An error occured while fetching the students.",
          error_message: error.message,
        });
      }
    });

    app.post("/addOneStudent", async (req, res) => {
      try {
        const student = await db.collection("students").insertOne(req.body);
        res.json(student);
      } catch (error) {
        res.json({
          error_status: "An error occured while adding one the student.",
          error_message: error.message,
        });
      }
    });

    app.put("/updateOneStudent/:student_id", async (req, res) => {
      try {
        const studentUpdate = await db
          .collection("students")
          .updateOne(
            { student_id: parseInt(req.params.student_id) },
            { $set: req.body }
          );
        res.json(studentUpdate);
      } catch (error) {
        res.json({
          error_status: "An error occured while updaing one student.",
          error_message: error.message,
        });
      }
    });

    app.delete("/deleteOneStudent/:student_id", async (req, res) => {
      try {
        const deleteStudent = await db
          .collection("students")
          .deleteOne({ student_id: parseInt(req.params.student_id) });
        res.json(deleteStudent);
      } catch (error) {
        res.json({
          error_status: "An error occured while deleting one student.",
          error_message: error.message,
        });
      }
    });

    app.listen(PORT, () => {
      console.log(
        `Express server started listening on port ${PORT}. \nTo access this Node.js app open URL: http://localhost:${PORT}`
      );
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};

startServer();
