const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.verify(token, 'this-secret-yonada');
    req.userData = {email: decodeToken.email, userId: decodeToken.userId};
    next();
  }catch (e) {
    res.status(401).json({message: 'Auth valid!'});
  }
}
