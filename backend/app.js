const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/posts');
const mongoose = require('mongoose');

const app = express();

//"mongodb+srv://tra:tra260397bew@cluster0-21olw.mongodb.net/node-angular?retryWrites=true&w=majority"
const urlDB = "mongodb://127.0.0.1:27017/node-angular";
mongoose.connect(urlDB, {
    useNewUrlParser: true
  })
.then(() => {
  console.log('connect');
})
.catch(() => {
  console.log('disconnect')
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next)=>{
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post('/api/posts', (req, res, next)=>{
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  console.log(post);
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    })
  });
})

app.delete("/api/posts/:id", async (req, res, next)=>{
  try{
    console.log(req.params.id);
    const post = await Post.findByIdAndDelete({_id: req.params.id});
    if(!post){
     return  res.status(400).json({
        message: 'filled'
      });
    }
    res.status(200).json({
      message: "success Dellet!"
    });
  }catch(e){
    console.log(e.message);
  }
});

app.use('/api/posts', (req, res, next)=>{
  Post.find()
  .then(data => {
    res.status(200).json({
      message: "Posts fetched succesfully!",
      posts: data
    });
  });
});
module.exports = app;
