const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express()
require('dotenv').config()


//middle ware
app.use(cors());
app.use(express.json());





const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wss65wz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri);

async function run(){
     try{
          const postCollection = client.db('eSomaz').collection('post');
          const usersCollection = client.db('eSomaz').collection('users');

          app.put('/users', async (req, res) => {
               const users = req.body;
               const options = { upsert: true };
               const updatedDoc = {
                   $set: users
               }
               const result = await usersCollection.updateOne(users, updatedDoc, options);
               res.send(result);
           })

           app.post('/post', async(req,res)=>{
               const post = req.body;
               const publish = await postCollection.insertOne(post)
               res.send(publish)
           })

           app.get('/post', async(req,res)=>{
               const query = {}
               const post = await postCollection.find(query).sort({$natural:-1}).toArray();
               res.send(post)
           })

           app.put('/post/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
       
            const result = await postCollection.updateOne(filter, { $inc: { like: + 1 } },options);
            // console.log(id);
            res.send(result);
        });

         
     }
     finally{

     }
}

run().catch(err => console.log(err))


app.get('/', async(req,res) =>{
     res.send('eSomaz server is running')
})

app.listen(port, () => console.log(`eSomaz Running on ${port} `))