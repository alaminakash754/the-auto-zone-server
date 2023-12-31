const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i6c2rzu.mongodb.net/?retryWrites=true&w=majority`;


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
    // await client.connect();

    const motoCollection = client.db('motoDB').collection('moto');
    const userCollection = client.db('motoDB').collection('user');
    const cartCollection = client.db('motoDB').collection('cart');



    app.get('/motos', async (req, res) => {
      const cursor = motoCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/motos/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await motoCollection.findOne(query);
      res.send(result);
    })

    app.get('/motos/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await motoCollection.findOne(query);
      res.send(result);
    })

    app.put('/motos/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedBrand = req.body;
      const brand = {
        $set: {
          select: updatedBrand.select,
          brand: updatedBrand.brand,
          name: updatedBrand.name,
          image: updatedBrand.image,
          price: updatedBrand.price,
          rating: updatedBrand.rating
        }
      }
      const result = await motoCollection.updateOne(filter, brand, options);
      res.send(result);
    })



    app.get('/eachbrand/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await motoCollection.findOne(query);
      res.send(result);
    })

    app.post('/motos', async (req, res) => {
      const newItems = req.body;
      console.log(newItems);
      const result = await motoCollection.insertOne(newItems);
      res.send(result);
    })

    // user related API
    app.post('/user', async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    })


    // cart related api
    app.post('/cart', async (req, res) => {
      const cartItems = req.body;
      console.log(cartItems);
      const result = await cartCollection.insertOne(cartItems);
      res.send(result);
    })

    app.get('/cart', async (req, res) => {
      console.log(req.query.email);
       let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('The Auto Zone server is running')
});

app.listen(port, () => {
  console.log(`The Auto Zone server is running on port: ${port}`)
})
