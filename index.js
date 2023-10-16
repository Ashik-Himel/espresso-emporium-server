const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5001;

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xeaidsx.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const coffeeCollection = client.db('espresso-emporium').collection('coffees');

    app.get('/coffees', async(req, res) => {
      const result = await coffeeCollection.find().toArray();
      res.send(result);
    })
    app.get('/coffees/:id', async(req, res) => {
      const filter = {_id: new ObjectId(req.params.id)};
      const result = await coffeeCollection.findOne(filter);
      res.send(result);
    })
    app.post('/coffees', async(req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    })
    app.put('/coffees/:id', async(req, res) => {
      const filter = {_id: new ObjectId(req.params.id)};
      const updatedCoffee = {
        $set: req.body
      };
      const option = {upsert: false};
      const result = await coffeeCollection.updateOne(filter, updatedCoffee, option);
      res.send(result)
    })
    app.delete('/coffees/:id', async(req, res) => {
      const filter = {_id: new ObjectId(req.params.id)}
      const result = await coffeeCollection.deleteOne(filter);
      res.send(result);
      console.log(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Database connected with MongoDB Atlas!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send("Welcome to Espresso Emporium's server!");
})
app.listen(port, () => {
  console.log(`Server is running in ${port} port!`);
})

// Export the Express API
module.exports = app;