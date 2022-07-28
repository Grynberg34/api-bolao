const jwt = require('jsonwebtoken');
const Jogo = require('../models/Jogo');
const Seleção = require('../models/Seleção');
const PalpiteJogo = require('../models/PalpiteJogo');
const PalpitePrêmio = require('../models/PalpitePrêmio');

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
    var s2_placar = req.body.s2_placar;

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

        var grupo = {
          letra: letras[i],
          classificacao: []

        };

        var seleções = await Seleção.findAll({
          where: {
            grupo: letras[i]
          }
        });

        for (var a=0; a < seleções.length; a++) {
          seleções[a].dataValues.golsPro = 0;
          seleções[a].dataValues.golsContra = 0;
          seleções[a].dataValues.saldo = 0;
          seleções[a].dataValues.pontos = 0;
        }

        for (var e=0; e < palpites.length; e++) {

          var s1 = seleções.find(x => x.id === palpites[e].Jogo.s1_id)
          var s2 = seleções.find(x => x.id === palpites[e].Jogo.s2_id)

          s1.dataValues.golsPro = s1.dataValues.golsPro + palpites[e].s1_placar;
          s1.dataValues.golsContra = s1.dataValues.golsContra + palpites[e].s2_placar;
          s1.dataValues.saldo = s1.dataValues.golsPro - s1.dataValues.golsContra;

          s2.dataValues.golsPro = s2.dataValues.golsPro + palpites[e].s2_placar;
          s2.dataValues.golsContra = s2.dataValues.golsContra + palpites[e].s1_placar;
          s2.dataValues.saldo = s2.dataValues.golsPro - s2.dataValues.golsContra;

          if (palpites[e].s1_placar > palpites[e].s2_placar) {
            s1.dataValues.pontos = s1.dataValues.pontos + 3
          }

          if (palpites[e].s1_placar < palpites[e].s2_placar) {
            s2.dataValues.pontos = s2.dataValues.pontos + 3
          }

          if (palpites[e].s1_placar == palpites[e].s2_placar) {
            s1.dataValues.pontos = s1.dataValues.pontos + 1
            s2.dataValues.pontos = s2.dataValues.pontos + 1

          }

        }

        grupo.classificacao = seleções;

        grupo.classificacao.sort((a, b) => parseFloat(b.dataValues.pontos) - parseFloat(a.dataValues.pontos) 
        || parseFloat(b.dataValues.saldo) - parseFloat(a.dataValues.saldo)
        || parseFloat(b.dataValues.golsPro) - parseFloat(a.dataValues.golsPro)
        || parseFloat(a.dataValues.golsContra) - parseFloat(b.dataValues.golsContra));


        grupos.push(grupo)

      }

      return res.status(201).json(grupos)

    });

  },
  checarGrupos: async function (req, res) {
    var token = req.header('authorization').substr(7);

    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {

      var palpites = await PalpiteJogo.findAll({
        where: {
          userId: decoded.id
        }
      });

      var palpitesFaseGrupos = [];

      var done = false;

      for (var i=0; i < palpites.length; i++) {
        if (palpites[i].jogoId > 0 && palpites[i].jogoId < 49) {
          palpitesFaseGrupos.push(palpites[i])
        }
      }

      if (palpitesFaseGrupos.length == 48) {
        done = true;
      }

      return res.status(201).json(done)

    });
  },
  mostrarJogosOitavas: async function (req, res) {
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

        var grupo = {
          letra: letras[i],
          classificacao: []

        };

        var seleções = await Seleção.findAll({
          where: {
            grupo: letras[i]
          }
        });

        for (var a=0; a < seleções.length; a++) {
          seleções[a].dataValues.golsPro = 0;
          seleções[a].dataValues.golsContra = 0;
          seleções[a].dataValues.saldo = 0;
          seleções[a].dataValues.pontos = 0;
        }

        for (var e=0; e < palpites.length; e++) {

          var s1 = seleções.find(x => x.id === palpites[e].Jogo.s1_id)
          var s2 = seleções.find(x => x.id === palpites[e].Jogo.s2_id)

          s1.dataValues.golsPro = s1.dataValues.golsPro + palpites[e].s1_placar;
          s1.dataValues.golsContra = s1.dataValues.golsContra + palpites[e].s2_placar;
          s1.dataValues.saldo = s1.dataValues.golsPro - s1.dataValues.golsContra;

          s2.dataValues.golsPro = s2.dataValues.golsPro + palpites[e].s2_placar;
          s2.dataValues.golsContra = s2.dataValues.golsContra + palpites[e].s1_placar;
          s2.dataValues.saldo = s2.dataValues.golsPro - s2.dataValues.golsContra;

          if (palpites[e].s1_placar > palpites[e].s2_placar) {
            s1.dataValues.pontos = s1.dataValues.pontos + 3
          }

          if (palpites[e].s1_placar < palpites[e].s2_placar) {
            s2.dataValues.pontos = s2.dataValues.pontos + 3
          }

          if (palpites[e].s1_placar == palpites[e].s2_placar) {
            s1.dataValues.pontos = s1.dataValues.pontos + 1
            s2.dataValues.pontos = s2.dataValues.pontos + 1

          }

        }

        grupo.classificacao = seleções;

        grupo.classificacao.sort((a, b) => parseFloat(b.dataValues.pontos) - parseFloat(a.dataValues.pontos) 
        || parseFloat(b.dataValues.saldo) - parseFloat(a.dataValues.saldo)
        || parseFloat(b.dataValues.golsPro) - parseFloat(a.dataValues.golsPro)
        || parseFloat(a.dataValues.golsContra) - parseFloat(b.dataValues.golsContra));


        grupos.push(grupo)

      }

      var oitavas = [];

      var confrontos = [
        [grupos[0].classificacao[0], grupos[1].classificacao[1]],
        [grupos[2].classificacao[0], grupos[3].classificacao[1]],
        [grupos[4].classificacao[0], grupos[5].classificacao[1]],
        [grupos[6].classificacao[0], grupos[7].classificacao[1]],
        [grupos[1].classificacao[0], grupos[0].classificacao[1]],
        [grupos[3].classificacao[0], grupos[2].classificacao[1]],
        [grupos[5].classificacao[0], grupos[4].classificacao[1]],
        [grupos[7].classificacao[0], grupos[6].classificacao[1]],
      ]

      for (var i=0; i < confrontos.length; i++) {

        let palpite = await PalpiteJogo.findOne({
          where: {
            jogoId: 49+i,
            userId: decoded.id
          }
        });

        if (palpite) {
          await PalpiteJogo.update({
            s1_id: confrontos[i][0].id,
            s2_id: confrontos[i][1].id,
            jogoId: 49+i,
            userId: decoded.id
          }, {
            where: {
              jogoId: 49+i,
              userId: decoded.id
            }
          });
        } else {
          await PalpiteJogo.create({
            s1_id: confrontos[i][0].id,
            s2_id: confrontos[i][1].id,
            jogoId: 49+i,
            userId: decoded.id
          })
        }


      }

      var palpites_todos = await PalpiteJogo.findAll({
        where: {
          userId: decoded.id
        },
        include: [
          { model: Seleção, as: 's1'},
          { model: Seleção, as: 's2'},
        ],
      })

      for (var i=0; i < palpites_todos.length; i++) {
        if (palpites_todos[i].jogoId > 48 && palpites_todos[i].jogoId < 57) {
          oitavas.push(palpites_todos[i])
        }
      }

      return res.status(201).json(oitavas)

    });
  }
}