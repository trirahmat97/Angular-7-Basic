const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'this-secret-yonada');
    next();
  }catch (e) {
    res.status(401).json({message: 'Auth valid!'});
  }
}
