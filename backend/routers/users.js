const express = require('express');
const bcypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/users');

router.post('/signup', (req, res, next) => {
    bcypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(result => {
            res.status(201).json({
                message: 'User created!',
                result: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
    });

});

router.post('/login', (req, res, next) => {
  let fetchUser;
  User.findOne({email: req.body.email}).then(user => {
    if(!user){
      return res.status(401).json({
        message: 'Auth failed'
      });
    }
    fetchUser = user;
    return bcypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if(!result){
      return res.status(401).json({
        message: 'Auth failed'
      });
    }
    const token = jwt.sign({email: fetchUser.email, userId: fetchUser._id}, 'this-secret-yonada', {expiresIn: '1h'});
    res.status(200).json({
      token,
      expiresin: 3600,
      userId: fetchUser._id
    });
  })
  .catch (err => {
    return res.status(401).json({
      message: 'Auth failed'
    });
  });
});

module.exports = router;
