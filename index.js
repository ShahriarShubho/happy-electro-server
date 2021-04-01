const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const  cors = require('cors')
const port = 5000


const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bfpqs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productCollection = client.db(`${process.env.DB_NAME}`).collection("products"); //database product collection
  const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orders");     //database order collection
  
  //add product in database
    app.post('/addProducts', (req, res) => {
        const product = req.body
        productCollection.insertOne(product)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    //Read all product In database
    app.get('/products', (req, res) => {
        productCollection.find({})
        .toArray((err, product) => {
            res.send(product)
        })
    })

    //Delete Product In Database
    app.delete('/delete/:id', (req, res) => {
        const product = ObjectId(req.params.id)
       productCollection.deleteOne({_id : product})
       .then(result => {
           res.send(result.deleteCount > 0)
        
       })
    })

    //add order information in database
    app.post('/addOrder', (req, res) => {
        const order = req.body
        orderCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })
    
    //Read Order in Database
    app.get('/orders', (req, res) => {
        orderCollection.find({email: req.query.email})
        .toArray((err, order) => {
            res.send(order)
        })
    })
});

//server home pase data
app.get('/', (req, res) => {
  res.send('Welcome To out HappyElectro server site')
})

app.listen(process.env.PORT || port)