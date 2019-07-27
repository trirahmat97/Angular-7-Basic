const express = require('express');
const router = express.Router();
const Post = require('../models/posts');

router.post('', (req, res, next)=>{
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
});

router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post).then(result =>{
    console.log(result);
    res.status(200).json({message: 'Update Success!'});
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post){
      return res.status(200).json(post);
    }else{
      res.status(404).json({
        message: 'data note fund'
      });
    }
  })
});

router.delete("/:id", async (req, res, next)=>{
  try{
    const post = await Post.findByIdAndDelete({_id: req.params.id});
    if(!post){
     return  res.status(400).json({
        message: 'filled'
      })
    }
    res.status(200).json({
      message: "success Dellet!"
    })
    // console.log(req.params.id);
    // Post.deleteOne({_id: req.params.idPost}).then(result =>{
    // console.log(result);
    // res.status(200).json({
    //   message: 'Post Delete!'
    // });
  // });
  }catch(e){
    console.log(e.message);
  }
});

router.get('', (req, res, next)=>{
  Post.find()
  .then(data => {
    res.status(200).json({
      message: "Posts fetched succesfully!",
      posts: data
    });
  });
});

module.exports = router;
