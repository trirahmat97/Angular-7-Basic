const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRouters = require('./routers/posts');

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
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/api/posts",postsRouters);

module.exports = app;
