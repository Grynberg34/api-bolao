const passport = require('passport');
const jwt = require('jsonwebtoken');

var jwtOptions = {};
jwtOptions.secretOrKey = process.env.JWT_KEY;

module.exports = {
  autenticar: function (req,res) {
    passport.authenticate('google', {session: false}, 
    function (err, user, info){
      if (user) {
        return res.redirect('http://localhost:3000/login')
      } else {
        return res.status(400).json("Usuário com esse nome existe. Tente novamente");
      }
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