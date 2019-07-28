const express = require('express');
const router = express.Router();
const multer = require('multer');

const Post = require('../models/posts');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error ("invalid mime type ");
    if(isValid){
      error = null;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name+ '-' + Date.now() + '.' + ext);
  }
});

router.post('', multer({storage: storage}).single("image"), (req, res, next)=>{
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  console.log(post);
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      post : {
        ...createdPost,
        id: createdPost._id
      }
    })
  });
});

router.put('/:id', multer({storage: storage}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  console.log(req.file);
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  console.log(post);
  Post.updateOne({_id: req.params.id}, post).then(result =>{
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
    });
  }catch(e){
    console.log(e.message);
  }
});

router.get('', (req, res, next)=>{
  // pagination
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if(pageSize && currentPage){
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery
  .then(documents => {
      fetchedPosts = documents;
      return Post.count();
  })
  .then(count => {
    res.status(200).json({
      message: "Posts fetched succesfully!",
      posts: fetchedPosts,
      maxPosts: count
    });
  });
});

module.exports = router;
