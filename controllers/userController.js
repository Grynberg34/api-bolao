const jwt = require('jsonwebtoken');
const PalpiteJogo = require('../models/PalpiteJogo');
const PalpitePrêmio = require('../models/PalpitePrêmio');

var jwtOptions = {};
jwtOptions.secretOrKey = process.env.JWT_KEY;

module.exports = {
  mostrarInfosUser: function (req,res) {
    var token = req.header('authorization').substr(7);

    jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
      res.status(400).json(decoded)
    });
  },
  enviarPalpiteJogo: async function (req,res) {
    var token = req.header('authorization').substr(7);
    var id_jogo = req.body.id_jogo;
    var s1_placar = req.body.s1_placar;
    var s2_placar = req.body.s2_placar

    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {

      var palpite = await PalpiteJogo.findOne({where: {
        jogoId: id_jogo,
        userId : decoded.id,
      }});

      if (palpite == null) {
        PalpiteJogo.create({
          jogoId: id_jogo,
          userId: decoded.id,
          s1_placar: s1_placar,
          s2_placar: s2_placar
        });

        return res.status(201).json("Palpite enviado")
      }

      else {
        PalpiteJogo.update({
          jogoId: id_jogo,
          userId: decoded.id,
          s1_placar: s1_placar,
          s2_placar: s2_placar
        }, {
          where: {
            jogoId: id_jogo,
            userId: decoded.id
          }
        });

        return res.status(201).json("Palpite atualizado")

      }

    });
  },
  enviarPalpitePrêmio: async function (req,res) {
    var token = req.header('authorization').substr(7);
    var id_prêmio = req.body.id_prêmio;
    var ganhador = req.body.ganhador;

    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {

      var palpite = await PalpitePrêmio.findOne({where: {
        prêmioId: id_prêmio,
        userId : decoded.id,
      }});

      if (palpite == null) {
        PalpitePrêmio.create({
          prêmioId: id_prêmio,
          userId : decoded.id,
          ganhador: ganhador
        });

        return res.status(201).json("Palpite enviado")
      }

      else {
        PalpitePrêmio.update({
          prêmioId: id_prêmio,
          userId : decoded.id,
          ganhador: ganhador
        }, {
          where: {
            prêmioId: id_prêmio,
            userId : decoded.id,
          }
        })

        return res.status(201).json("Palpite atualizado")

      }

    });
  }
}