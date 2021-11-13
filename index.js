const express = require('express')
const app = express()
var cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yoxzf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("dream_house");
      const servicesCollection = database.collection("services");
      const usersCollection = database.collection("users");
      const ordersCollection = database.collection("orders");
      const reviewCollection = database.collection("review");



  // GET API 
  app.get('/services', async(req, res) =>{
    const cursor = servicesCollection.find({});
    const services = await cursor.toArray();
    res.send(services);

  });
  // GET SINGLE SERVICE
  app.get('/services/:id', async(req, res) =>{
    const id = req.params.id;
    console.log('getting specific ID', id);
    const query = {_id: ObjectId(id)};
    const service = await servicesCollection.findOne(query);
    res.json(service)
  })
  
//POST API
app.post('/addServices', async(req, res)=>{
  const service = req.body;
  console.log('Hit the post api', service);
  // create a document to insert
  const result = await servicesCollection.insertOne(service);
  console.log(result);
  res.json('Post hitted')
});

// get all service

app.get("/allServices", async (req, res) => {
  const result = await servicesCollection.find({}).toArray();
  res.json(result);
  console.log(result);
});

app.get("/productsLimit", async (req, res) => {
  const result = servicesCollection.find({}).limit(6);
  const products = await result.toArray();
  res.json(products);
  console.log(products);
});

// delete Order
app.delete("/deleteOrder/:id", async (req, res) => {
  const result = await ordersCollection.deleteOne({
    _id: ObjectId(req.params.id),
  });
  res.send(result);
});

// post orders
app.post("/addOrders", async(req, res) =>{
  const result = await ordersCollection.insertOne(req.body);
  res.send(result)
})
// all order
app.get("/allOrders", async (req, res) => {
  const result = await ordersCollection.find({}).toArray();
  res.json(result);
});

// Delete api

app.delete('/orders/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await ordersCollection.deleteOne(query);
  console.log('deleting user with id ', result);
  res.json(result);
})
// Delete api

app.delete('/allOrders/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await ordersCollection.deleteOne(query);
  console.log('deleting user with id ', result);
  res.json(result);
})

// my order
app.get("/myOrder/:email", async (req, res) => {
  console.log(req.params.email);
  const result = await ordersCollection
    .find({ email: req.params.email })
    .toArray();
  res.send(result);
});

// add review
app.post("/addReview", async(req, res)=>{
 const result = await reviewCollection.insertOne(req.body);
 res.send(result)
});

// get all review
app.get("/allReview", async (req, res) => {
  const result = await reviewCollection.find({}).toArray();
  res.json(result);
  console.log(result);
});

app.put("/statusUpdate/:id", async (req, res) => {
  const filter = { _id: ObjectId(req.params.id) };
  console.log(req.params.id);
  const result = await ordersCollection.updateOne(filter, {
    $set: {
      status: req.body.status,
    },
  });
  res.send(result);
  console.log(result);
});

app.put("/makeAdmin", async (req, res) => {
  const filter = { email: req.body.email };
  const result = await usersCollection.find(filter).toArray();
  if (result) {
    const documents = await usersCollection.updateOne(filter, {
      $set: { role: "admin" },
    });
    console.log(result);
  }
});
// check admin
app.get("/checkAdmin/:email", async (req, res) => {
  const result = await usersCollection
    .find({ email: req.params.email })
    .toArray();
  console.log(result);
  res.send(result);
});

} finally {
//   await client.close();
}
}
run().catch(console.dir);

app.get('/hello', (req, res) =>{
res.send('node server in updated')
})
app.get('/', (req, res) =>{
res.send('USER in Running');
});

app.listen(port, () =>{
  console.log('Running Master Server', port);
})