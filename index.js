const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express()
require('dotenv').config()



//middle ware
app.use(cors());
app.use(express.json());


// mongo DB CRUD

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wss65wz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri);

async function run() {
     try {
          const postCollection = client.db('eSomaz').collection('post');
          const usersCollection = client.db('eSomaz').collection('users');
          const storyCollection = client.db('eSomaz').collection('story');


          app.put('/users', async (req, res) => {
               const users = req.body;
               const options = { upsert: true };
               const updatedDoc = {
                    $set: users
               }
               const result = await usersCollection.updateOne(users, updatedDoc, options);
               res.send(result);
          })
          // get user 
          app.get('/users', async (req, res) => {
               const query = {}
               const filter = usersCollection.find(query)
               const users = await filter.sort({ like: -1 }).toArray()
               res.send(users)
          })
          // update user info 
          app.put('/user', async (req, res) => {
               const email = req.query.email;
               const query = { email: email };
               const userInfo = req.body;
               const option = { upsert: true };
               const update = {
                    $set:
                    {
                         updatedPhoto: userInfo.image,
                         updatedName: userInfo.updatedName,
                         updatedEmail: userInfo.updatedEmail,
                         bio: userInfo.bio,
                         work: userInfo.work,
                         address: userInfo.address,
                         college: userInfo.college,
                         phone: userInfo.phone,
                         facebook: userInfo.facebook,
                         instagram: userInfo.instagram,
                         twitter: userInfo.twitter
                    }
               }
               const result = await usersCollection.updateOne(query, update, option);
               res.send(result);

          })
          // increase user follow 
          app.put('/user/:id', async (req, res) => {
               const id = req.params.id;
               const filter = { _id: ObjectId(id) }
               const options = { upsert: true };
               const result = await usersCollection.updateOne(filter, { $inc: { like: + 1 } }, options);
               // console.log(id);
               res.send(result);
          });

          app.get('/user/:id', async (req, res) => {
               const id = req.params.id;
               const filter = { _id: ObjectId(id) };
               const result = await usersCollection.findOne(filter);
               res.send(result)
          })
          // create post 
          app.post('/post', async (req, res) => {
               const post = req.body;
               // console.log(req.body);
               const result = await postCollection.insertOne(post)
               res.send(result)

          })
          // create story 
          app.post('/story', async (req, res) => {
               const post = req.body;
               const result = await storyCollection.insertOne(post)
               res.send(result)

          })
          // get story 
          app.get('/story', async (req, res) => {
               const query = {}
               const result = await storyCollection.find(query).toArray()
               res.send(result)

          })

          app.get('/postDetails/:id', async (req, res) => {
               const id = req.params.id;
               const query = { _id: ObjectId(id) }
               const details = await postCollection.findOne(query);
               res.send(details)
          })

          app.put('/comments/post/:id', async (req, res) => {
               const id = req.params.id;
               const filter = { _id: ObjectId(id) };
               const comment = req.body;
               // console.log(updateReview);
               const option = { upsert: true };
               const setComment = {
                    $push: {
                         comment: {
                              userPhoto: comment.userPhoto,
                              commentUserId: comment.commentUserId,
                              userName: comment.userName,
                              userEmail: comment.userEmail,
                              comment: comment.comment,
                              time: comment.time,
                              postId: comment.postId,
                         }

                    }
               }
               const result = await postCollection.updateOne(filter, setComment, option)
               res.send(result);
          })

          app.get('/post', async (req, res) => {
               const query = {}
               const post = await postCollection.find(query).sort({ $natural: -1 }).toArray();
               res.send(post)
          })
          app.get('/post/top', async (req, res) => {
               const query = {}
               const cursor = postCollection.find(query);
               const post = await cursor.sort({ like: -1 }).toArray();
               res.send(post)
          })

          app.put('/post/:id', async (req, res) => {
               const id = req.params.id;
               const filter = { _id: ObjectId(id) }
               const options = { upsert: true };

               const result = await postCollection.updateOne(filter, { $inc: { like: + 1 } }, options);
               // console.log(id);
               res.send(result);
          });
          app.put('/post/update/:id', async (req, res) => {
               const id = req.params.id;
               const filter = { _id: ObjectId(id) }
               const options = { upsert: true };
               const postInfo = req.body;
               const update = {
                    $set:{
                         post:postInfo.updateText,
                    }
               }
               const result = await postCollection.updateOne(filter,update,options);
               // console.log(id);
               res.send(result);
          });

          app.put('/post/saved/:id', async (req, res) => {
               const id = req.params.id;
               const filter = { _id: ObjectId(id) }
               const saved = req.body;
               const option = { upsert: true };
               const setSavedUser = {
                    $push: {
                         savedUser: {
                              savedEmail: saved.users

                         }

                    }
               }

               const result = await postCollection.updateOne(filter, setSavedUser, option)
               res.send(result)
          })
          app.put('/post/report/:id', async (req, res) => {
               const id = req.params.id;
               const filter = { _id: ObjectId(id) }
               const postReport = req.body;
               const option = { upsert: true };
               const setSavedUser = {
                    $push: {
                         Reports: {
                              selectReport: postReport.SelectedReports,
                              messageReport: postReport.messages,
                              reporterName: postReport.reportUser,
                              postMail: postReport.postUserMail

                         }

                    }
               }

               const result = await postCollection.updateOne(filter, setSavedUser, option)
               res.send(result)
          })

          app.delete('/post/delete/:id', async (req, res) => {
               const id = req.params.id
               const filter = { _id: ObjectId(id) }
               const result = await postCollection.deleteOne(filter)
               res.send(result)
          })

          app.get('/post/saved', async (req, res) => {
               const query = {}
               const result = await postCollection.find(query).toArray();
               res.send(result)
          })
          app.get('/post/report', async (req, res) => {
               const query = {}
               const result = await postCollection.find(query).toArray();
               res.send(result)
          })


     }
     finally {

     }
}

run().catch(err => console.log(err))


app.get('/', async (req, res) => {
     res.send('esomaz server is running')
})


app.listen(port, () => console.log(`esomaz Running on ${port} `))
 