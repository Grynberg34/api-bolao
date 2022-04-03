const jwt = require('jsonwebtoken');

var jwtOptions = {};
jwtOptions.secretOrKey = process.env.JWT_KEY;

module.exports = {
  mostrarInfosUser: function (req,res,next) {
    var token = req.header('authorization').substr(7);

    jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
      res.status(400).json(decoded)
    });
  }
}