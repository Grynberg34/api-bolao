const jwt = require('jsonwebtoken');
const Jogo = require('../models/Jogo');
const Seleção = require('../models/Seleção');
const PalpiteJogo = require('../models/PalpiteJogo');
const PalpitePrêmio = require('../models/PalpitePrêmio');
const PalpiteClassificado = require('../models/PalpiteClassificado');

var jwtOptions = {};
jwtOptions.secretOrKey = process.env.JWT_KEY;

module.exports = {
  mostrarInfosUser: function (req,res) {
    var token = req.header('authorization').substr(7);

    jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
      res.status(200).json(decoded)
    });
  },


  mostrarJogosGrupo: async function (req, res) {

    var letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    var grupos = [];

    for (var i=0; i < letras.length; i++) {
      
      var grupo = {
        letra: letras[i],
        jogos: []
      }

      var jogos = await Jogo.findAll({
        include: [
          { model: Seleção, as: 's1'},
          { model: Seleção, as: 's2'},
        ],
        where: {
          grupo: letras[i]
        }
      });

      grupo.jogos = jogos;

      grupos.push(grupo)

    }

    res.status(200).json(grupos)

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
        await PalpiteJogo.create({
          jogoId: id_jogo,
          userId: decoded.id,
          s1_placar: s1_placar,
          s2_placar: s2_placar
        });

        return res.status(201).json("Palpite enviado")
      }

      else {
        await PalpiteJogo.update({
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
        await PalpitePrêmio.create({
          prêmioId: id_prêmio,
          userId : decoded.id,
          ganhador: ganhador
        });

        return res.status(201).json("Palpite enviado")
      }

      else {
        await PalpitePrêmio.update({
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
  },
  enviarPalpiteClassificado: async function (req,res) {
    var token = req.header('authorization').substr(7);
    var sel_id = req.body.sel_id;
    var fase = req.body.fase; 

    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {

      await PalpiteClassificado.create({
        seleçãoId: sel_id,
        userId : decoded.id,
        fase: fase
      });

      return res.status(201).json("Palpite enviado")

    });
  },
  ordenarGrupos: async function (req, res) {
    var token = req.header('authorization').substr(7);

    var letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {

      var grupos = [];

      for (var i = 0; i < letras.length; i++) {
        var palpites = await PalpiteJogo.findAll({
          include: [
            { model: Jogo, 
            where: {
              grupo: letras[i]
            }}
          ],
          where: {
            userId: decoded.id
          }}
        );

        var grupo = [];

        var seleções = await Seleção.findAll({
          where: {
            grupo: letras[i]
          }
        });

        for (var a=0; a < seleções.length; a++) {
          seleções[a].golsPro = 0;
          seleções[a].golsContra = 0;
          seleções[a].saldo = 0;
          seleções[a].pontos = 0;
        }

        for (var e=0; e < palpites.length; e++) {

          var s1 = seleções.find(x => x.id === palpites[e].Jogo.s1_id)
          var s2 = seleções.find(x => x.id === palpites[e].Jogo.s2_id)

          console.log(s1.pontos)

          s1.golsPro = s1.golsPro + palpites[e].s1_placar;
          s1.golsContra = s1.golsContra + palpites[e].s2_placar;
          s1.saldo = s1.golsPro - s1.golsContra;

          s2.golsPro = s2.golsPro + palpites[e].s2_placar;
          s2.golsContra = s2.golsContra + palpites[e].s1_placar;
          s2.saldo = s2.golsPro - s2.golsContra;

          if (palpites[e].s1_placar > palpites[e].s2_placar) {
            s1.pontos = s1.pontos + 3
          }

          if (palpites[e].s1_placar < palpites[e].s2_placar) {
            s2.pontos = s2.pontos + 3
          }

          if (palpites[e].s1_placar = palpites[e].s2_placar) {
            s1.pontos = s1.pontos + 1
            s2.pontos = s2.pontos + 1

          }

        }

      }

      return res.status(201).json(grupos)

    });

  }
}