const express = require('express');
const bodyParser = require('body-parser');

const app = express();
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
})

app.post('/api/posts', (req, res, next)=>{
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post added successfully'
  })
})

app.use('/api/posts', (req, res, next)=>{
  const posts = [
    {id: "1", title: "learn angular", content: "yonada triayu nalamba"},
    {id: "2", title: "learn nodejs", content: "yonada triayu nalamba"}
  ];
  res.status(200).json({
    message: "Posts fetched succesfully!",
    posts
  });
});

module.exports = app;
