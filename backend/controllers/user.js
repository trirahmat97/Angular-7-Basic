const bcypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

exports.createUser = (req, res, next) => {
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
            message: 'Invalid authentication credentials!'
          })
      });
  });
}

exports.userLogin = (req, res, next) => {
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
    const token = jwt.sign({email: fetchUser.email, userId: fetchUser._id}, process.env.JWT_KEY, {expiresIn: '1h'});
    res.status(200).json({
      token,
      expiresin: 3600,
      userId: fetchUser._id
    });
  })
  .catch (err => {
    return res.status(401).json({
      message: 'Invalid authentication credentials!'
    });
  });
}
