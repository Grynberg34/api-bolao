const passport = require('passport');
const jwt = require('jsonwebtoken');

var jwtOptions = {};
jwtOptions.secretOrKey = process.env.JWT_KEY;

module.exports = {
  autenticar: function (req,res) {
    passport.authenticate('google', {session: false}, 
    function (err, user, info){
      var payload = { id: user.id, tipo_conta: user.tipo_conta };
      var token = jwt.sign(payload, jwtOptions.secretOrKey);
      return res.status(200).json({ "mensagem" : 'Token gerado', token: token });
    }) (req, res)
  },
  checarUser: function (req,res,next) {
    var token = req.header('authorization').substr(7);

    jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
      if (err) {
        console.log(err)
        res.status(400).json("Token falso")
      }
      else if (decoded.tipo_conta == 'admin') {
        res.redirect('/admin')
      }
      else if (decoded.tipo_conta == 'user') {
        next()
      }
    });
  },
  checarAdmin: function (req,res,next) {
    var token = req.header('authorization').substr(7);

    jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
      if (err) {
        console.log(err)
        res.status(400).json("Token falso")
      }
      else if (decoded.tipo_conta == 'admin') {
        next()
      }
      else if (decoded.tipo_conta == 'user') {
        res.redirect('/user')
      }
    });
  }
}