const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.orv8anl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const placeCollection = client.db('exploreAura').collection('places');


    app.get("/touristPlace", async (req, res) => {
      const cursor = placeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.post("/touristPlace", async (req, res) => {
      const newPlace = req.body;
      const result = await placeCollection.insertOne(newPlace);
      res.send(result);
      console.log(newPlace)
    })

    app.get("/touristPlace/:email", async (req, res) => {
      console.log(req.params.email)
      const result = await placeCollection.find({ user_email: req.params.email }).toArray();
      res.send(result);

    })

    // for update
    app.get("/touristPlaces/:idx", async (req, res) => {
      const id = req.params.idx;
      console.log(id)
      const query = { _id: new ObjectId(id) }
      const result = await placeCollection.findOne(query);
      res.send(result)
    })

    // updated field
    app.put("/touristPlace/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedPLace = req.body;
      const place = {
        $set: {
          tourists_spot_name: updatedPLace.tourists_spot_name,
          country_name: updatedPLace.country_name,
          location: updatedPLace.location,
          image: updatedPLace.image,
          seasonality: updatedPLace.seasonality,
          averageCost: updatedPLace.averageCost,
          travel_time: updatedPLace.travel_time,
          totalVisitorsPerYear: updatedPLace.totalVisitorsPerYear,
          short_description: updatedPLace.short_description
        },
      };
      const result = await placeCollection.updateOne(filter, place, options);
      res.send(result)
    })

    app.delete("/touristPlace/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await placeCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get("/", (req, res) => {
  res.send("hello world")
})
app.listen(port, () => {
  console.log(`server is running on port: ${port}`)
})