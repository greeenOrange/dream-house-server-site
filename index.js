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

      app.get('/orders', async(req, res) =>{
        const cursor = ordersCollection.find({});
        const services = await cursor.toArray();
        res.send(services); 
      })

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
  // console.log(result);
  res.json('Post hitted')
});

// get all service
app.get("/allServices", async (req, res) => {
  const result = await servicesCollection.find({}).toArray();
  res.json(result);
  // console.log(result);
});

app.get("/productsLimit", async (req, res) => {
  const result = servicesCollection.find({}).limit(6);
  const products = await result.toArray();
  res.json(products);
  // console.log(products);
});

// delete Order
app.delete("/orders/:id", async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  const query = { _id: ObjectId(id) };
  const result = await ordersCollection.deleteOne(query);
  console.log(result);
  res.send(result);
});

// delete servieces
app.delete("/services/:id", async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  const query = { _id: ObjectId(id) };
  const result = await servicesCollection.deleteOne(query);
  console.log(result);
  res.send(result);
});

app.post("/orders", async(req, res) =>{
  const order = req.body
  const result = await ordersCollection.insertOne(order);
  res.send(result)
})
// my order
app.get("/orders/:email", async (req, res) => {
  console.log(req.params.email);
  const result = await ordersCollection
    .find({ email: req.params.email })
    .toArray();
  res.send(result);
});

// add review
app.post("/review", async(req, res)=>{
 const result = await reviewCollection.insertOne(req.body);
 res.send(result)
});

// add users
app.post("/addUserInfo", async (req, res) => {
  console.log("req.body");
  const result = await usersCollection.insertOne(req.body);
  res.send(result);
  console.log(result);
});

// get all review
app.get("/review", async (req, res) => {
  const cursor = reviewCollection.find({})
  const result = await cursor.toArray()
  res.json(result);
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
});

app.put("/makeAdmin", async (req, res) => {
  const filter = { email: req.body.email };
  const result = await usersCollection.find(filter).toArray();
  if (result) {
    const documents = await usersCollection.updateOne(filter, {
      $set: { role: "admin" },
    });
    console.log(documents);
  }
});
// check admin
app.get("/checkAdmin/:email", async (req, res) => {
  const result = await usersCollection.find({ email: req.params.email }).toArray();
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