const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
};
//middleware
app.use(cors(corsConfig));
app.options("", cors(corsConfig));
app.use(express.json());

// mongodb
const uri = process.env.DATABASE_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const divisionCollection = client.db("districtDB").collection("divisions");
    const districtCollection = client.db("districtDB").collection("districts");
    const upazilaCollection = client.db("districtDB").collection("upazilas");

    app.get("/api/divisions", async (req, res) => {
      const divisions = await divisionCollection.find({}).toArray();
      res.status(200).send({
        status: "success",
        data: divisions,
      });
    });

    app.get("/api/districts", async (req, res) => {
      const { division_id } = req.query;
      const districts = await districtCollection
        .find({ division_id: division_id })
        .toArray();
      res.status(200).send({ status: "success", data: districts });
    });

    app.get("/api/upazilas", async (req, res) => {
      const { district_id } = req.query;
      const upazilas = await upazilaCollection
        .find({ district_id: district_id })
        .toArray();
      res.status(200).send({ status: "success", data: upazilas });
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
