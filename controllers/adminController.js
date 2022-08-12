const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Jogo = require('../models/Jogo');
const Seleção = require('../models/Seleção');
const PalpiteJogo = require('../models/PalpiteJogo');
const PontuaçãoJogo = require('../models/PontuaçãoJogo');
const PalpitePrêmio = require('../models/PalpitePrêmio');

module.exports = {
    definirResultadoJogo: async function (req,res) {
        var id = req.body.id;
        var s1_placar = req.body.s1_placar;
        var s2_placar = req.body.s2_placar;

        await Jogo.update({
            s1_placar: s1_placar,
            s2_placar: s2_placar
        }, {
            where: {
                id: id
            }
        });


        var jogo = await Jogo.findByPk(id);

        var palpites = await PalpiteJogo.findAll({
            where: {
                jogoId: id
            }
        });

        for (var i=0; i < palpites.length; i++) {

            var user = await User.findByPk(palpites[i].userId);

            var campeãoId = user.campeãoId;

            var pontos = 0;
            
            if (palpites[i].s1_placar === jogo.s1_placar && palpites[i].s2_placar === jogo.s2_placar) { 
                pontos = 10;
            } else if ((palpites[i].s1_placar === jogo.s1_placar && palpites[i].s2_placar !== jogo.s2_placar) && (jogo.s1_placar > jogo.s2_placar)) {
                pontos = 7;
            } else if ((palpites[i].s1_placar !== jogo.s1_placar && palpites[i].s2_placar === jogo.s2_placar) && (jogo.s2_placar > jogo.s1_placar)) {
                pontos = 7;
            } else if ((palpites[i].s1_placar !== jogo.s1_placar && palpites[i].s2_placar !== jogo.s2_placar) && (jogo.s1_placar > jogo.s2_placar) && (palpites[i].s1_placar > palpites[i].s2_placar)) {
                pontos = 5;
            } else if ((palpites[i].s1_placar !== jogo.s1_placar && palpites[i].s2_placar !== jogo.s2_placar) && (jogo.s2_placar > jogo.s1_placar) && (palpites[i].s2_placar > palpites[i].s1_placar)) {
                pontos = 5;
            } else if ((palpites[i].s1_placar !== jogo.s1_placar && palpites[i].s2_placar !== jogo.s2_placar) && (jogo.s1_placar === jogo.s2_placar) && (palpites[i].s1_placar === palpites[i].s2_placar)) {
                pontos = 5;
            } else {
                pontos = 0;
            }

            if (jogo.s1_id === campeãoId || jogo.s2_id === campeãoId) {
                pontos = pontos * 2;
            }
            
            await PontuaçãoJogo.create({
                jogoId: id,
                userId: palpites[i].userId,
                pontos: pontos
            });
            
        }

        return res.status(201).json("Resultado definido")
    },
    resetarResultadoJogo: async function (req,res) {
        var id = req.body.id;

        await PontuaçãoJogo.destroy({
            where: {
                jogoId: id
            }
        });

        return res.status(201).json("Resultado resetado")
    }
}