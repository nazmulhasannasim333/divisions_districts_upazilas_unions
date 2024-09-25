const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const port = process.env.PORT || 5000;

const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
};

// middleware
app.use(cors(corsConfig));
app.options("", cors(corsConfig));
app.use(express.json());

// Routes to serve JSON from local files
app.get("/api/divisions", (req, res) => {
  const filePath = path.join(__dirname, "data", "divisions.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send({
        status: "error",
        message: "Unable to fetch divisions",
      });
    }
    res.status(200).send({
      status: "success",
      data: JSON.parse(data),
    });
  });
});

app.get("/api/districts", (req, res) => {
  const { division_id } = req.query;
  const filePath = path.join(__dirname, "data", "districts.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send({
        status: "error",
        message: "Unable to fetch districts",
      });
    }

    const districts = JSON.parse(data).filter(
      (district) => district.division_id === division_id
    );

    res.status(200).send({
      status: "success",
      data: districts,
    });
  });
});

app.get("/api/upazilas", (req, res) => {
  const { district_id } = req.query;
  const filePath = path.join(__dirname, "data", "upazilas.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send({
        status: "error",
        message: "Unable to fetch upazilas",
      });
    }

    const upazilas = JSON.parse(data).filter(
      (upazila) => upazila.district_id === district_id
    );

    res.status(200).send({
      status: "success",
      data: upazilas,
    });
  });
});

app.get("/api/unions", (req, res) => {
  const { upazilla_id } = req.query;
  const filePath = path.join(__dirname, "data", "unions.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send({
        status: "error",
        message: "Unable to fetch unions",
      });
    }

    const unions = JSON.parse(data).filter(
      (union) => union.upazilla_id === upazilla_id
    );

    res.status(200).send({
      status: "success",
      data: unions,
    });
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
