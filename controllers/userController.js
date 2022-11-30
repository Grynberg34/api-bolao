const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Jogo = require('../models/Jogo');
const Seleção = require('../models/Seleção');
const PalpiteJogo = require('../models/PalpiteJogo');
const PalpitePrêmio = require('../models/PalpitePrêmio');
const PontuaçãoJogo = require('../models/PontuaçãoJogo');
const PontuaçãoClassificado = require('../models/PontuaçãoClassificado');
const PontuaçãoPrêmio = require('../models/PontuaçãoPrêmio');

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
    var vencedor = req.body.vencedor;

    if (s1_placar > 1000 || s2_placar > 1000) {
      return res.status(400).json("Número acima do máximo")
    }

    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {

      var palpite = await PalpiteJogo.findOne({where: {
        jogoId: id_jogo,
        userId : decoded.id,
      }});

      if (palpite === null) {
        await PalpiteJogo.create({
          jogoId: id_jogo,
          userId: decoded.id,
          s1_placar: s1_placar,
          s2_placar: s2_placar,
          vencedor: vencedor
        });

        return res.status(201).json("Palpite enviado")
      }

      else {
        await PalpiteJogo.update({
          jogoId: id_jogo,
          userId: decoded.id,
          s1_placar: s1_placar,
          s2_placar: s2_placar,
          vencedor: vencedor
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
  limparJogoDuplicado: async function (req,res) {
    var token = req.header('authorization').substr(7);
    var id_jogo = req.body.id_jogo;

    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {

      var palpites = await PalpiteJogo.findAll({where: {
        jogoId: id_jogo,
        userId : decoded.id,
      }});


      for (var i=0; i < palpites.length; i++) {
        if (i !== 0) {
          await PalpiteJogo.destroy({
            where: {
              id: palpites[i].id,
            }
          })
        }
      }

      return res.status(201).json("Palpite duplicado")
      

    });
  },
  enviarPalpitePrêmio: async function (req,res) {
    var token = req.header('authorization').substr(7);
    var id_prêmio = req.body.id_prêmio;
    var ganhador = req.body.ganhador;

    if (ganhador === undefined) {
      return res.status(400).json({ "mensagem" : 'Campo de nome do ganhador não pode ficar vazio' });
    }

    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {

      var palpite = await PalpitePrêmio.findOne({where: {
        prêmioId: id_prêmio,
        userId : decoded.id,
      }});

      if (palpite === null) {
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
  limparPrêmiosDuplicados: async function (req,res) {
    var token = req.header('authorization').substr(7);
    var id_prêmio = req.body.id_prêmio;

    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {

      var palpites = await PalpitePrêmio.findAll({where: {
        prêmioId: id_prêmio,
        userId : decoded.id,
      }});


      for (var i=0; i < palpites.length; i++) {
        if (i !== 0) {
          await PalpitePrêmio.destroy({
            where: {
              id: palpites[i].id,
            }
          })
        }
      }

      return res.status(201).json("Palpites duplicados deletados.")

      

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

          console.log(s1, s2)

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

          if (palpites[e].s1_placar === palpites[e].s2_placar) {
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

      if (palpitesFaseGrupos.length === 48) {
        done = true;
      }

      return res.status(201).json(done)

    });
  },
  checarOitavas: async function (req, res) {
    var token = req.header('authorization').substr(7);

    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {

      var palpites = await PalpiteJogo.findAll({
        where: {
          userId: decoded.id
        }
      });

      var palpitesOitavas = [];

      var done = false;

      for (var i=0; i < palpites.length; i++) {
        if ((palpites[i].jogoId > 48 && palpites[i].jogoId < 57) && (palpites[i].s1_placar !== null) && (palpites[i].s2_placar !== null)) {
          palpitesOitavas.push(palpites[i])
        }
      }

      if (palpitesOitavas.length === 8) {
        done = true;
      }

      return res.status(201).json(done)

    });
  },
  checarQuartas: async function (req, res) {
    var token = req.header('authorization').substr(7);

    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {

      var palpites = await PalpiteJogo.findAll({
        where: {
          userId: decoded.id
        }
      });

      var palpitesQuartas = [];

      var done = false;

      for (var i=0; i < palpites.length; i++) {
        if ((palpites[i].jogoId > 56 && palpites[i].jogoId < 61) && (palpites[i].s1_placar !== null) && (palpites[i].s2_placar !== null)) {
          palpitesQuartas.push(palpites[i])
        }
      }

      if (palpitesQuartas.length === 4) {
        done = true;
      }

      return res.status(201).json(done)

    });
  },
  checarSemis: async function (req, res) {
    var token = req.header('authorization').substr(7);

    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {

      var palpites = await PalpiteJogo.findAll({
        where: {
          userId: decoded.id
        }
      });

      var palpitesSemis = [];

      var done = false;

      for (var i=0; i < palpites.length; i++) {
        if ((palpites[i].jogoId > 60 && palpites[i].jogoId < 63) && (palpites[i].s1_placar !== null) && (palpites[i].s2_placar !== null)) {
          palpitesSemis.push(palpites[i])
        }
      }

      if (palpitesSemis.length === 2) {
        done = true;
      }

      return res.status(201).json(done)

    });
  },
  checarFinais: async function (req, res) {
    var token = req.header('authorization').substr(7);

    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {

      var palpites = await PalpiteJogo.findAll({
        where: {
          userId: decoded.id
        }
      });

      var palpitesSemis = [];

      var done = false;

      for (var i=0; i < palpites.length; i++) {
        if ((palpites[i].jogoId > 62 && palpites[i].jogoId < 65) && (palpites[i].s1_placar !== null) && (palpites[i].s2_placar !== null)) {
          palpitesSemis.push(palpites[i])
        }
      }

      var palpites_prêmios = await PalpitePrêmio.findAll({where: {
        userId: decoded.id
      }});

      if (palpitesSemis.length === 2 && palpites_prêmios.length === 2) {
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

          if (palpites[e].s1_placar === palpites[e].s2_placar) {
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

      var palpites_novos = await PalpiteJogo.findAll({
        where: {
          userId: decoded.id
        },
        include: [
          { model: Seleção, as: 's1'},
          { model: Seleção, as: 's2'},
        ],
      })

      for (var i=0; i < palpites_novos.length; i++) {
        if (palpites_novos[i].jogoId > 48 && palpites_novos[i].jogoId < 57) {
          oitavas.push(palpites_novos[i])
        }
      }

      return res.status(201).json(oitavas)

    });
  },
  mostrarJogosQuartas: async function (req,res) {
    var token = req.header('authorization').substr(7);

    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {
      var palpites = await PalpiteJogo.findAll({
        where: {
          userId: decoded.id
        },
        include: [
          { model: Seleção, as: 's1'},
          { model: Seleção, as: 's2'},
        ],
      });

      var oitavas = [];
      var quartas = [];
      
      for (var i=0; i < palpites.length; i++) {
        if (palpites[i].jogoId > 48 && palpites[i].jogoId < 57) {
          oitavas.push(palpites[i])
        }
      }

      for (var i=0; i < oitavas.length; i++) {
        if (oitavas[i].s1_placar > oitavas[i].s2_placar) {
          await PalpiteJogo.update({
            vencedor: oitavas[i].s1_id
          }, {
            where: {
              jogoId: oitavas[i].jogoId,
              userId: decoded.id
            }
          });

          oitavas[i].vencedor = oitavas[i].s1_id;
        } else if (oitavas[i].s2_placar > oitavas[i].s1_placar) {
          await PalpiteJogo.update({
            vencedor: oitavas[i].s2_id
          }, {
            where: {
              jogoId: oitavas[i].jogoId,
              userId: decoded.id
            }
          });

          oitavas[i].vencedor = oitavas[i].s2_id;
        }
      }

      var confrontos = [
        [oitavas[0].vencedor, oitavas[1].vencedor],
        [oitavas[2].vencedor, oitavas[3].vencedor],
        [oitavas[4].vencedor, oitavas[5].vencedor],
        [oitavas[6].vencedor, oitavas[7].vencedor],
      ];

      for (var i=0; i < confrontos.length; i++) {

        let palpite = await PalpiteJogo.findOne({
          where: {
            jogoId: 57+i,
            userId: decoded.id
          }
        });

        if (palpite) {
          await PalpiteJogo.update({
            s1_id: confrontos[i][0],
            s2_id: confrontos[i][1],
            jogoId: 57+i,
            userId: decoded.id
          }, {
            where: {
              jogoId: 57+i,
              userId: decoded.id
            }
          });
        } else {
          await PalpiteJogo.create({
            s1_id: confrontos[i][0],
            s2_id: confrontos[i][1],
            jogoId: 57+i,
            userId: decoded.id
          })
        }

      }

      var palpites_novos = await PalpiteJogo.findAll({
        where: {
          userId: decoded.id
        },
        include: [
          { model: Seleção, as: 's1'},
          { model: Seleção, as: 's2'},
        ],
      })

      for (var i=0; i < palpites_novos.length; i++) {
        if (palpites_novos[i].jogoId > 56 && palpites_novos[i].jogoId < 61) {
          quartas.push(palpites_novos[i])
        }
      }

      return res.status(201).json(quartas)

    })

  },
  mostrarJogosSemis: async function (req,res) {
    var token = req.header('authorization').substr(7);

    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {
      var palpites = await PalpiteJogo.findAll({
        where: {
          userId: decoded.id
        },
        include: [
          { model: Seleção, as: 's1'},
          { model: Seleção, as: 's2'},
        ],
      });

      var quartas = [];
      var semis = [];
      
      for (var i=0; i < palpites.length; i++) {
        if (palpites[i].jogoId > 56 && palpites[i].jogoId < 61) {
          quartas.push(palpites[i])
        }
      }

      for (var i=0; i < quartas.length; i++) {
        if (quartas[i].s1_placar > quartas[i].s2_placar) {
          await PalpiteJogo.update({
            vencedor: quartas[i].s1_id
          }, {
            where: {
              jogoId: quartas[i].jogoId,
              userId: decoded.id
            }
          });

          quartas[i].vencedor = quartas[i].s1_id;
        } else if (quartas[i].s2_placar > quartas[i].s1_placar) {
          await PalpiteJogo.update({
            vencedor: quartas[i].s2_id
          }, {
            where: {
              jogoId: quartas[i].jogoId,
              userId: decoded.id
            }
          });

          quartas[i].vencedor = quartas[i].s2_id;
        }
      }

      var confrontos = [
        [quartas[0].vencedor, quartas[1].vencedor],
        [quartas[2].vencedor, quartas[3].vencedor],

      ];

      for (var i=0; i < confrontos.length; i++) {

        let palpite = await PalpiteJogo.findOne({
          where: {
            jogoId: 61+i,
            userId: decoded.id
          }
        });

        if (palpite) {
          await PalpiteJogo.update({
            s1_id: confrontos[i][0],
            s2_id: confrontos[i][1],
            jogoId: 61+i,
            userId: decoded.id
          }, {
            where: {
              jogoId: 61+i,
              userId: decoded.id
            }
          });
        } else {
          await PalpiteJogo.create({
            s1_id: confrontos[i][0],
            s2_id: confrontos[i][1],
            jogoId: 61+i,
            userId: decoded.id
          })
        }

      }

      var palpites_novos = await PalpiteJogo.findAll({
        where: {
          userId: decoded.id
        },
        include: [
          { model: Seleção, as: 's1'},
          { model: Seleção, as: 's2'},
        ],
      })

      for (var i=0; i < palpites_novos.length; i++) {
        if (palpites_novos[i].jogoId > 60 && palpites_novos[i].jogoId < 63) {
          semis.push(palpites_novos[i])
        }
      }

      return res.status(201).json(semis)

    })

  },
  mostrarJogosFinais: async function (req,res) {
    var token = req.header('authorization').substr(7);

    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {
      var palpites = await PalpiteJogo.findAll({
        where: {
          userId: decoded.id
        },
        include: [
          { model: Seleção, as: 's1'},
          { model: Seleção, as: 's2'},
        ],
      });

      var semis = [];
      var finais = [];

      for (var i=0; i < palpites.length; i++) {
        if (palpites[i].jogoId > 60 && palpites[i].jogoId < 63) {
          semis.push(palpites[i])
        }
      }

      for (var i=0; i < semis.length; i++) {
        if (semis[i].s1_placar > semis[i].s2_placar) {
          await PalpiteJogo.update({
            vencedor: semis[i].s1_id
          }, {
            where: {
              jogoId: semis[i].jogoId,
              userId: decoded.id
            }
          });

          semis[i].vencedor = semis[i].s1_id;
        } else if (semis[i].s2_placar > semis[i].s1_placar) {
          await PalpiteJogo.update({
            vencedor: semis[i].s2_id
          }, {
            where: {
              jogoId: semis[i].jogoId,
              userId: decoded.id
            }
          });

          semis[i].vencedor = semis[i].s2_id;
        }
      }

      for (var i=0; i < semis.length; i++) {
        if (semis[i].s1_id !== semis[i].vencedor) {
          semis[i].perdedor = semis[i].s1_id
        } else if (semis[i].s2_id !== semis[i].vencedor) {
          semis[i].perdedor = semis[i].s2_id
        }
      }

      var confrontos = [
        [semis[0].perdedor, semis[1].perdedor],
        [semis[0].vencedor, semis[1].vencedor],

      ];

  
      for (var i=0; i < confrontos.length; i++) {

        let palpite = await PalpiteJogo.findOne({
          where: {
            jogoId: 63+i,
            userId: decoded.id
          }
        });

        if (palpite) {
          await PalpiteJogo.update({
            s1_id: confrontos[i][0],
            s2_id: confrontos[i][1],
            jogoId: 63+i,
            userId: decoded.id
          }, {
            where: {
              jogoId: 63+i,
              userId: decoded.id
            }
          });
        } else {
          await PalpiteJogo.create({
            s1_id: confrontos[i][0],
            s2_id: confrontos[i][1],
            jogoId: 63+i,
            userId: decoded.id
          })
        }

      }

      var palpites_novos = await PalpiteJogo.findAll({
        where: {
          userId: decoded.id
        },
        include: [
          { model: Seleção, as: 's1'},
          { model: Seleção, as: 's2'},
        ],
      })

      for (var i=0; i < palpites_novos.length; i++) {
        if (palpites_novos[i].jogoId > 62 && palpites_novos[i].jogoId < 65) {
          finais.push(palpites_novos[i])
        }
      }

      return res.status(201).json(finais)

    })

  },
  finalizarBolao: async function (req,res) {
    var token = req.header('authorization').substr(7);

    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {

      var palpite_final = await PalpiteJogo.findOne({where:{
        jogoId: 64,
        userId: decoded.id
      }});


      if (palpite_final.s1_placar > palpite_final.s2_placar) {

        await PalpiteJogo.update({
          vencedor: palpite_final.s1_id
        }, {
          where: {
            jogoId: 64,
            userId: decoded.id
          }
        })

        await User.update({
          campeãoId: palpite_final.s1_id,
          enviado: true

        }, {
          where: {
            id: decoded.id
          }
        })

      } else if (palpite_final.s2_placar > palpite_final.s1_placar) {

        await PalpiteJogo.update({
          vencedor: palpite_final.s2_id
        }, {
          where: {
            jogoId: 64,
            userId: decoded.id
          }
        })

        await User.update({
          campeãoId: palpite_final.s2_id,
          enviado: true

        }, {
          where: {
            id: decoded.id
          }
        })

      } else {
        await User.update({
          campeãoId: palpite_final.vencedor,
          enviado: true

        }, {
          where: {
            id: decoded.id
          }
        })
      }

      return res.status(201).json(true)

    })

  },
  mostrarPalpites: async function (req,res) {
    var token = req.header('authorization').substr(7);

    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {
      
      var palpites = await PalpiteJogo.findAll({
        where: {
          userId: decoded.id
        },
        order: [
          [{ model: Jogo }, 'data', 'asc' ]
        ],
        include: [
          { model: Seleção, as: 's1'},
          { model: Seleção, as: 's2'},
          { model: Jogo, include: [
            {model: Seleção, as: 's1'},
            {model: Seleção, as: 's2'}
          ]},
        ],
      });

      var bolao = [];
      var jogos_grupos = [];
      var oitavas = [];
      var quartas =[];
      var semis = [];
      var finais = [];

      for (var i=0; i < palpites.length; i++) {

        var pontuação = await PontuaçãoJogo.findOne({
          where: {
            userId: decoded.id,
            jogoId: palpites[i].jogoId
          }
        });

        if (!pontuação) {
          var pontos = 0;
        } else {
          var pontos = pontuação.pontos;
        }

        palpites[i].dataValues.pontos = pontos;

        if (palpites[i].jogoId > 0 && palpites[i].jogoId < 49) {
          jogos_grupos.push(palpites[i])
        } else if (palpites[i].jogoId > 48 && palpites[i].jogoId < 57) {
          oitavas.push(palpites[i])
        } else if (palpites[i].jogoId > 56 && palpites[i].jogoId < 61) {
          quartas.push(palpites[i])
        } else if (palpites[i].jogoId > 60 && palpites[i].jogoId < 63) {
          semis.push(palpites[i])
        } else if (palpites[i].jogoId > 62 && palpites[i].jogoId < 65) {
          finais.push(palpites[i])
        }
      }

      var grupos = [];

      var letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

      for (var i=0; i <letras.length; i++) {
        var grupo = {
          letra: letras[i],
          palpites: []
        }

        for (var e=0; e < jogos_grupos.length; e++) {

          if (letras[i] === jogos_grupos[e].Jogo.grupo) {
            grupo.palpites.push(jogos_grupos[e])
          }
        }

        grupos.push(grupo);

      }

      var user = await User.findOne({
        where: {
          id: decoded.id
        },
        include: Seleção
      });

      var prêmios = await PalpitePrêmio.findAll({
        where: {
          userId: decoded.id
        }
      })

      
      //PONTOS JOGOS
      
      var pontos_jogos = await PontuaçãoJogo.findAll({
        where: {
          userId: decoded.id
        }
      });
      
      var pontos_jogos_total = 0
      
      for (var i=0; i < pontos_jogos.length; i++) {
        pontos_jogos_total= pontos_jogos_total + pontos_jogos[i].pontos
      }
      
      
      // OITAVAS 
      
      var pontos_oitavas = await PontuaçãoClassificado.findAll({
        where: {
          userId: decoded.id,
          fase: '16'
        }
      });
      
      var pontos_oitavas_total = 0;
      
      for (var i=0; i < pontos_oitavas.length; i++) {
        pontos_oitavas_total = pontos_oitavas_total + pontos_oitavas[i].pontos
      }
      
      // QUARTAS

      var pontos_quartas = await PontuaçãoClassificado.findAll({
        where: {
          userId: decoded.id,
          fase: '8'
        }
      });
      
      var pontos_quartas_total = 0;
      
      for (var i=0; i < pontos_quartas.length; i++) {
        pontos_quartas_total = pontos_quartas_total + pontos_quartas[i].pontos
      }

      // SEMIS
      
      var pontos_semis = await PontuaçãoClassificado.findAll({
        where: {
          userId: decoded.id,
          fase: '4'
        }
      });

      var pontos_semis_total = 0;

      for (var i=0; i < pontos_semis.length; i++) {
        pontos_semis_total = pontos_semis_total + pontos_semis[i].pontos
      }

      // TERCEIRO
      
      var pontos_terceiro = await PontuaçãoClassificado.findOne({
        where: {
          userId: decoded.id,
          fase: '2.5'
        }
      });

      var pontos_terceiro_total = 0;
      
      if (pontos_terceiro) {
        pontos_terceiro_total = pontos_terceiro_total + pontos_terceiro.pontos;
      }

      // FINAL
      
      var pontos_final = await PontuaçãoClassificado.findOne({
        where: {
          userId: decoded.id,
          fase: '2'
        }
      });
      
      var pontos_final_total = 0;

      if (pontos_final) {
        pontos_final_total = pontos_final_total + pontos_final.pontos;
      }
      
      
      // CAMPEÃO
      
      var pontos_campeão = await PontuaçãoClassificado.findAll({
        where: {
          userId: decoded.id,
          fase: '1'
        }
      });
      
      var pontos_campeão_total = 0;
      
      for (var i=0; i < pontos_campeão.length; i++) {
        pontos_campeão_total = pontos_campeão_total + pontos_campeão[i].pontos
      }

      // PRÊMIOS
      
      var pontos_prêmios = await PontuaçãoPrêmio.findAll({
        where: {
          userId: decoded.id
        }
      });
      
      
      var pontos_prêmios_total = 0;
      
      for (var i=0; i < pontos_prêmios.length; i++) {
        pontos_prêmios_total = pontos_jogos_total + pontos_prêmios[i].pontos;
      }

      var pontos = {
        jogos: pontos_jogos_total,
        oitavas: pontos_oitavas_total,
        quartas: pontos_quartas_total,
        semis: pontos_semis_total,
        terceiro: pontos_terceiro_total,
        final: pontos_final_total,
        campeão: pontos_campeão_total,
        prêmios: pontos_prêmios_total,
        pontos: pontos_jogos_total + pontos_oitavas_total + pontos_quartas_total + pontos_semis_total + pontos_terceiro_total + pontos_final_total + pontos_campeão_total + pontos_prêmios_total
      }

      
      bolao.push(grupos, oitavas, quartas, semis, finais, user, prêmios, pontos);

      return res.status(201).json(bolao)
    
    })
  },
  mostrarUserInfo: async function (req,res) {
    var token = req.header('authorization').substr(7);

    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {

      var info = [];

      var user = await User.findOne({
        where: {
          id: decoded.id
        },
        include: Seleção
      });

      var prêmios = await PalpitePrêmio.findAll({
        where: {
          userId: decoded.id
        }
      })

      
      info.push(user, prêmios);

      return res.status(201).json(info)
    
    })
  },
  mostrarRanking: async function (req,res) {

    var users = await User.findAll({where: {
      enviado: true
    }});
    

    for (var i=0; i < users.length; i++) {

      //PONTOS JOGOS
      
      var pontos_jogos = await PontuaçãoJogo.findAll({
        where: {
          userId: users[i].id
        }
      });
      
      var pontos_jogos_total = 0
      
      for (var e=0; e < pontos_jogos.length; e++) {
        pontos_jogos_total= pontos_jogos_total + pontos_jogos[e].pontos
      }
      
      
      // CLASSIFICADOS
      
      var pontos_classificados = await PontuaçãoClassificado.findAll({
        where: {
          userId: users[i].id,
        }
      });
      
      var pontos_classificados_total = 0;
      
      for (var e=0; e < pontos_classificados.length; e++) {
        pontos_classificados_total = pontos_classificados_total + pontos_classificados[e].pontos
      }
      
      // PRÊMIOS
      
      var pontos_prêmios = await PontuaçãoPrêmio.findAll({
        where: {
          userId: users[i].id
        }
      });
      
      
      var pontos_prêmios_total = 0;
      
      for (var e=0; e < pontos_prêmios.length; e++) {
        pontos_prêmios_total = pontos_jogos_total + pontos_prêmios[e].pontos;
      }

      var pontos = pontos_jogos_total + pontos_classificados_total + pontos_prêmios_total;

      users[i].dataValues.pontos = pontos;

    }

    users.sort((a, b) => parseFloat(b.dataValues.pontos) - parseFloat(a.dataValues.pontos));

    return res.status(201).json(users)

  },
  mostrarPalpitesPorId: async function (req,res) {
    var id = req.params.id;
      
    var palpites = await PalpiteJogo.findAll({
      where: {
        userId: id
      },
      order: [
        [{ model: Jogo }, 'data', 'asc' ]
      ],
      include: [
        { model: Seleção, as: 's1'},
        { model: Seleção, as: 's2'},
        { model: Jogo, include: [
          {model: Seleção, as: 's1'},
          {model: Seleção, as: 's2'}
        ]},
      ],
    });

    var bolao = [];
    var jogos_grupos = [];
    var oitavas = [];
    var quartas =[];
    var semis = [];
    var finais = [];

    for (var i=0; i < palpites.length; i++) {

      var pontuação = await PontuaçãoJogo.findOne({
        where: {
          userId: id,
          jogoId: palpites[i].jogoId
        }
      });

      if (!pontuação) {
        var pontos = 0;
      } else {
        var pontos = pontuação.pontos;
      }

      palpites[i].dataValues.pontos = pontos;

      if (palpites[i].jogoId > 0 && palpites[i].jogoId < 49) {
        jogos_grupos.push(palpites[i])
      } else if (palpites[i].jogoId > 48 && palpites[i].jogoId < 57) {
        oitavas.push(palpites[i])
      } else if (palpites[i].jogoId > 56 && palpites[i].jogoId < 61) {
        quartas.push(palpites[i])
      } else if (palpites[i].jogoId > 60 && palpites[i].jogoId < 63) {
        semis.push(palpites[i])
      } else if (palpites[i].jogoId > 62 && palpites[i].jogoId < 65) {
        finais.push(palpites[i])
      }
    }

    var grupos = [];

    var letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    for (var i=0; i <letras.length; i++) {
      var grupo = {
        letra: letras[i],
        palpites: []
      }

      for (var e=0; e < jogos_grupos.length; e++) {

        if (letras[i] === jogos_grupos[e].Jogo.grupo) {
          grupo.palpites.push(jogos_grupos[e])
        }
      }

      grupos.push(grupo);

    }

    var user = await User.findOne({
      where: {
        id: id
      },
      include: Seleção
    });

    var prêmios = await PalpitePrêmio.findAll({
      where: {
        userId: id
      }
    })

    
    //PONTOS JOGOS
    
    var pontos_jogos = await PontuaçãoJogo.findAll({
      where: {
        userId: id
      }
    });
    
    var pontos_jogos_total = 0
    
    for (var i=0; i < pontos_jogos.length; i++) {
      pontos_jogos_total= pontos_jogos_total + pontos_jogos[i].pontos
    }
    
    
    // OITAVAS 
    
    var pontos_oitavas = await PontuaçãoClassificado.findAll({
      where: {
        userId: id,
        fase: '16'
      }
    });
    
    var pontos_oitavas_total = 0;
    
    for (var i=0; i < pontos_oitavas.length; i++) {
      pontos_oitavas_total = pontos_oitavas_total + pontos_oitavas[i].pontos
    }
    
    // QUARTAS

    var pontos_quartas = await PontuaçãoClassificado.findAll({
      where: {
        userId: id,
        fase: '8'
      }
    });
    
    var pontos_quartas_total = 0;
    
    for (var i=0; i < pontos_quartas.length; i++) {
      pontos_quartas_total = pontos_quartas_total + pontos_quartas[i].pontos
    }

    // SEMIS
    
    var pontos_semis = await PontuaçãoClassificado.findAll({
      where: {
        userId: id,
        fase: '4'
      }
    });

    var pontos_semis_total = 0;

    for (var i=0; i < pontos_semis.length; i++) {
      pontos_semis_total = pontos_semis_total + pontos_semis[i].pontos
    }

      // TERCEIRO
      
      var pontos_terceiro = await PontuaçãoClassificado.findOne({
        where: {
          userId: id,
          fase: '2.5'
        }
      });

      var pontos_terceiro_total = 0;
      
      if (pontos_terceiro) {
        pontos_terceiro_total = pontos_terceiro_total + pontos_terceiro.pontos;
      }

      // FINAL
      
      var pontos_final = await PontuaçãoClassificado.findOne({
        where: {
          userId: id,
          fase: '2'
        }
      });
      
      var pontos_final_total = 0;

      if (pontos_final) {
        pontos_final_total = pontos_final_total + pontos_final.pontos;
      }
      
      
      // CAMPEÃO
      
      var pontos_campeão = await PontuaçãoClassificado.findAll({
        where: {
          userId: id,
          fase: '1'
        }
      });
      
      var pontos_campeão_total = 0;
      
      for (var i=0; i < pontos_campeão.length; i++) {
        pontos_campeão_total = pontos_campeão_total + pontos_campeão[i].pontos
      }

      // PRÊMIOS
      
      var pontos_prêmios = await PontuaçãoPrêmio.findAll({
        where: {
          userId: id
        }
      });
      
      
      var pontos_prêmios_total = 0;
      
      for (var i=0; i < pontos_prêmios.length; i++) {
        pontos_prêmios_total = pontos_jogos_total + pontos_prêmios[i].pontos;
      }

      var pontos = {
        jogos: pontos_jogos_total,
        oitavas: pontos_oitavas_total,
        quartas: pontos_quartas_total,
        semis: pontos_semis_total,
        terceiro: pontos_terceiro_total,
        final: pontos_final_total,
        campeão: pontos_campeão_total,
        prêmios: pontos_prêmios_total,
        pontos: pontos_jogos_total + pontos_oitavas_total + pontos_quartas_total + pontos_semis_total + pontos_terceiro_total + pontos_final_total + pontos_campeão_total + pontos_prêmios_total
      }

    
    bolao.push(grupos, oitavas, quartas, semis, finais, user, prêmios, pontos);

    return res.status(201).json(bolao)
    
  },
  mostrarTodosJogos: async function (req,res) {
    var jogos = await Jogo.findAll({
      include: [
        { model: Seleção, as: 's1'},
        { model: Seleção, as: 's2'},

        ],
        order: [
          ['data', 'asc' ]
        ]
    });

    for (var i=0; i < jogos.length; i++) {

      if (jogos[i].s1 === null) {
        jogos[i].dataValues.s1 = {
          nome: "A definir"
        }
      }

      if (jogos[i].s2 === null) {
        jogos[i].dataValues.s2 = {
          nome: "A definir"
        }
      }

    }

    var todos_jogos = []
    var grupos = [];
    var oitavas = [];
    var quartas = [];
    var semis = [];
    var finais = [];

    for (var i=0; i < jogos.length; i++) {
      if (jogos[i].id > 0 && jogos[i].id < 49) {
        grupos.push(jogos[i])
      } else if (jogos[i].id > 48 && jogos[i].id < 57) {
        oitavas.push(jogos[i])
      } else if (jogos[i].id > 56 && jogos[i].id < 61) {
        quartas.push(jogos[i])
      } else if (jogos[i].id > 60 && jogos[i].id < 63) {
        semis.push(jogos[i])
      } else if (jogos[i].id > 62 && jogos[i].id < 65) {
        finais.push(jogos[i])
      }
    }

    todos_jogos.push(grupos, oitavas, quartas, semis, finais)

    return res.status(201).json(todos_jogos)
  },
  mostrarPalpitesPorJogo: async function (req,res) {
    var id = req.params.id;

    var jogo = await Jogo.findOne({
      where: {
        id: id
      }, 
      include: [
        { model: Seleção, as: 's1'},
        { model: Seleção, as: 's2'},
      ],
    });

    if (jogo.s1 === null) {
      jogo.dataValues.s1 = {
        nome: "A definir"
      }
    }

    if (jogo.s2 === null) {
      jogo.dataValues.s2 = {
        nome: "A definir"
      }
    }

    var palpites = await PalpiteJogo.findAll({
      where: {
        jogoId: jogo.id
      },
      include: [
        { model: User },
      ],
      order: [
        [{ model: User}, 'nome', 'asc' ]
      ],
    })

    for (var i=0; i < palpites.length; i++) {

      if (palpites[i].User.enviado === false) {
        palpites.splice(i, 1)
      }
    }

    jogo.dataValues.palpites = palpites;

    return res.status(201).json(jogo)
  },
  mostrarPalpitesPorJogoFaseFinal: async function (req,res) {
    var id = req.params.id;

    var jogo = await Jogo.findOne({
      where: {
        id: id
      }, 
      include: [
        { model: Seleção, as: 's1'},
        { model: Seleção, as: 's2'},
      ],
    });

    if (jogo.s1 === null) {
      jogo.dataValues.s1 = {
        nome: "A definir"
      }
    }

    if (jogo.s2 === null) {
      jogo.dataValues.s2 = {
        nome: "A definir"
      }
    }

    var palpites = await PalpiteJogo.findAll({
      where: {
        jogoId: jogo.id
      },
      include: [
        { model: Seleção, as: 's1'},
        { model: Seleção, as: 's2'},
        { model: User },
      ],
      order: [
        [{ model: User}, 'nome', 'asc' ]
      ],
    });

    jogo.dataValues.palpites = palpites;

    return res.status(201).json(jogo)
  }
}