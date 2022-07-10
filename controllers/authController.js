const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

var jwtOptions = {};
jwtOptions.secretOrKey = process.env.JWT_KEY;

module.exports = {
  autenticar: function (req,res) {
    passport.authenticate('google', {session: false}, 
    function (err, user, info){
      if (user) {
        var payload = { id: user.id, tipo_conta: user.tipo_conta };
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        return res.status(200).json({ "mensagem" : 'Token gerado', token: token });
      } else {
        return res.status(400).json("Usuário com esse nome existe. Tente novamente");
      }
    }) (req, res)
  },
  gerarTokenGoogle: async function (req, res) {
    var googleID = req.body.googleID;
    var name = req.body.name;

    User.findOrCreate( {where: { google_id: googleID }, 
      defaults : {
        nome: name
      }
    }).then(function (user) {
      if (user[0]) {
        var payload = { id: user[0].id, tipo_conta: user[0].tipo_conta };
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        return res.status(200).json({ "mensagem" : 'Token gerado', token: token });
      }
    }).catch(function(err){
      console.log(err)
      return res.status(400).json("Usuário com esse nome existe. Tente novamente");
    });
  },
  checarUser: function (req,res,next) {
    var token = req.header('authorization').substr(7);

    jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
      console.log(decoded.tipo_conta)
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