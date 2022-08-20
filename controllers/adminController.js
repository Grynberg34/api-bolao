const User = require('../models/User');
const Jogo = require('../models/Jogo');
const PalpiteJogo = require('../models/PalpiteJogo');
const PontuaçãoJogo = require('../models/PontuaçãoJogo');
const PontuaçãoPrêmio = require('../models/PontuaçãoPrêmio');
const PalpitePrêmio = require('../models/PalpitePrêmio');
const PontuaçãoClassificado = require('../models/PontuaçãoClassificado');
const Prêmio = require('../models/Prêmio');

module.exports = {
    definirResultadoJogoGrupos: async function (req,res) {
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
                pontos = 20;
            } else if ((palpites[i].s1_placar === jogo.s1_placar && palpites[i].s2_placar !== jogo.s2_placar) && (jogo.s1_placar > jogo.s2_placar) && (palpites[i].s1_placar > palpites[i].s2_placar)) {
                pontos = 14;
            } else if ((palpites[i].s1_placar !== jogo.s1_placar && palpites[i].s2_placar === jogo.s2_placar) && (jogo.s1_placar > jogo.s2_placar) && (palpites[i].s1_placar > palpites[i].s2_placar)) {
                pontos = 14;
            } else if ((palpites[i].s1_placar !== jogo.s1_placar && palpites[i].s2_placar === jogo.s2_placar) && (jogo.s2_placar > jogo.s1_placar) && (palpites[i].s2_placar > palpites[i].s1_placar)) {
                pontos = 14;
            } else if ((palpites[i].s1_placar === jogo.s1_placar && palpites[i].s2_placar !== jogo.s2_placar) && (jogo.s2_placar > jogo.s1_placar) && (palpites[i].s2_placar > palpites[i].s1_placar)) {
                pontos = 14;
            } else if ((palpites[i].s1_placar !== jogo.s1_placar && palpites[i].s2_placar !== jogo.s2_placar) && (jogo.s1_placar > jogo.s2_placar) && (palpites[i].s1_placar > palpites[i].s2_placar)) {
                pontos = 10;
            } else if ((palpites[i].s1_placar !== jogo.s1_placar && palpites[i].s2_placar !== jogo.s2_placar) && (jogo.s2_placar > jogo.s1_placar) && (palpites[i].s2_placar > palpites[i].s1_placar)) {
                pontos = 10;
            } else if ((palpites[i].s1_placar !== jogo.s1_placar && palpites[i].s2_placar !== jogo.s2_placar) && (jogo.s1_placar === jogo.s2_placar) && (palpites[i].s1_placar === palpites[i].s2_placar)) {
                pontos = 10;
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
    },
    pontuarClassificadosOitavas: async function (req,res) {
        
        var jogos = await Jogo.findAll();

        var grupos= [];

        var oitavas = [];
        
        var classificados = [];

        for (var i=0; i < jogos.length; i++) {
            if (jogos[i].id > 0 && jogos[i].id < 49) {
                grupos.push(jogos[i])
            }

            if (jogos[i].id > 48 && jogos[i].id < 57) {
                oitavas.push(jogos[i])
            }
        }

        for (var i=0; i < oitavas.length; i++) {
            classificados.push(oitavas[i].s1_id, oitavas[i].s2_id)
        }

        for (var i=0; i < grupos.length; i++) {
            if (grupos[i].s1_id === null || grupos[i].s2_id === null) {
                return res.status(400).json("Jogos da fase de grupos ainda não foram finalizados.")
            }
        }

        var users = await User.findAll({where: {
            enviado: true
        }})

        for (var i=0; i < users.length; i++) {

            var palpites = await PalpiteJogo.findAll({
                where: {
                    userId: users[i].id
                }
            })

            var palpites_oitavas = [];

            for (var e=0; e < palpites.length; e++) {
                if (palpites[e].jogoId > 48 && palpites[e].jogoId < 57) {
                    palpites_oitavas.push(palpites[e])
                }
            }

            var palpites_classificados = [];

            for (var e=0; e < palpites_oitavas.length; e++) {
                palpites_classificados.push(palpites_oitavas[e].s1_id, palpites_oitavas[e].s2_id);
            }

            for (var e=0; e < palpites_classificados.length; e++) {

                if (classificados.includes(palpites_classificados[e])) {

                    if (users[i].campeãoId === palpites_classificados[e]) {
                        await PontuaçãoClassificado.create({
                            userId: users[i].id,
                            pontos: 50,
                            fase: '16',
                            classificadoId: palpites_classificados[e]
                        })

                    } else {
                        await PontuaçãoClassificado.create({
                            userId: users[i].id,
                            pontos: 25,
                            fase: '16',
                            classificadoId: palpites_classificados[e]
                        })
                    }

                }
            }

            for (var e=0; e < oitavas.length; e++) {
                if (oitavas[e].s1_id === palpites_oitavas[e].s1_id && oitavas[e].s2_id === palpites_oitavas[e].s2_id ) {

                    if (oitavas[e].s1_id === users[i].campeãoId || oitavas[e].s2_id === users[i].campeãoId ) {
                        await PontuaçãoJogo.create({
                            jogoId: oitavas[e].id,
                            userId: users[i].id,
                            pontos: 100
                        })
                    } else {
                        await PontuaçãoJogo.create({
                            jogoId: oitavas[e].id,
                            userId: users[i].id,
                            pontos: 50
                        })
                    }

                }
            }
            
        }
        
        return res.status(201).json("Pontuação de classificados concluída com sucesso.")
    },
    pontuarClassificadosQuartas: async function (req,res) {
        
        var jogos = await Jogo.findAll();

        var oitavas= [];

        var quartas = [];
        
        var classificados = [];

        for (var i=0; i < jogos.length; i++) {
            if (jogos[i].id > 48 && jogos[i].id < 57) {
                oitavas.push(jogos[i])
            }

            if (jogos[i].id > 56 && jogos[i].id < 61) {
                quartas.push(jogos[i])
            }
        }

        for (var i=0; i < quartas.length; i++) {
            classificados.push(quartas[i].s1_id, quartas[i].s2_id)
        }

        for (var i=0; i < oitavas.length; i++) {
            if (oitavas[i].s1_id === null || oitavas[i].s2_id === null) {
                return res.status(400).json("Jogos das oitavas ainda não foram finalizados.")
            }
        }

        var users = await User.findAll({where: {
            enviado: true
        }})

        for (var i=0; i < users.length; i++) {

            var palpites = await PalpiteJogo.findAll({
                where: {
                    userId: users[i].id
                }
            })

            var palpites_quartas = [];

            for (var e=0; e < palpites.length; e++) {
                if (palpites[e].jogoId > 56 && palpites[e].jogoId < 61) {
                    palpites_quartas.push(palpites[e])
                }
            }

            var palpites_classificados = [];

            for (var e=0; e < palpites_quartas.length; e++) {
                palpites_classificados.push(palpites_quartas[e].s1_id, palpites_quartas[e].s2_id);
            }

            for (var e=0; e < palpites_classificados.length; e++) {

                if (classificados.includes(palpites_classificados[e])) {

                    if (users[i].campeãoId === palpites_classificados[e]) {
                        await PontuaçãoClassificado.create({
                            userId: users[i].id,
                            pontos: 100,
                            fase: '8',
                            classificadoId: palpites_classificados[e]
                        })

                    } else {
                        await PontuaçãoClassificado.create({
                            userId: users[i].id,
                            pontos: 50,
                            fase: '8',
                            classificadoId: palpites_classificados[e]
                        })
                    }

                }
            }

            for (var e=0; e < quartas.length; e++) {
                if (quartas[e].s1_id === palpites_quartas[e].s1_id && quartas[e].s2_id === palpites_quartas[e].s2_id ) {

                    if (quartas[e].s1_id === users[i].campeãoId || quartas[e].s2_id === users[i].campeãoId ) {
                        await PontuaçãoJogo.create({
                            jogoId: quartas[e].id,
                            userId: users[i].id,
                            pontos: 200
                        })
                    } else {
                        await PontuaçãoJogo.create({
                            jogoId: quartas[e].id,
                            userId: users[i].id,
                            pontos: 100
                        })
                    }

                }
            }
            
        }
        
        return res.status(201).json("Pontuação de classificados concluída com sucesso.")
    },
    pontuarClassificadosSemis: async function (req,res) {
        
        var jogos = await Jogo.findAll();

        var quartas= [];

        var semis = [];
        
        var classificados = [];

        for (var i=0; i < jogos.length; i++) {
            if (jogos[i].id > 56 && jogos[i].id < 61) {
                quartas.push(jogos[i])
            }

            if (jogos[i].id > 60 && jogos[i].id < 63) {
                semis.push(jogos[i])
            }
        }

        for (var i=0; i < semis.length; i++) {
            classificados.push(semis[i].s1_id, semis[i].s2_id)
        }

        for (var i=0; i < quartas.length; i++) {
            if (quartas[i].s1_id === null || quartas[i].s2_id === null) {
                return res.status(400).json("Jogos das quartas ainda não foram finalizados.")
            }
        }

        var users = await User.findAll({where: {
            enviado: true
        }})

        for (var i=0; i < users.length; i++) {

            var palpites = await PalpiteJogo.findAll({
                where: {
                    userId: users[i].id
                }
            })

            var palpites_semis = [];

            for (var e=0; e < palpites.length; e++) {
                if (palpites[e].jogoId > 60 && palpites[e].jogoId < 63) {
                    palpites_semis.push(palpites[e])
                }
            }

            var palpites_classificados = [];

            for (var e=0; e < palpites_semis.length; e++) {
                palpites_classificados.push(palpites_semis[e].s1_id, palpites_semis[e].s2_id);
            }

            for (var e=0; e < palpites_classificados.length; e++) {

                if (classificados.includes(palpites_classificados[e])) {

                    if (users[i].campeãoId === palpites_classificados[e]) {
                        await PontuaçãoClassificado.create({
                            userId: users[i].id,
                            pontos: 200,
                            fase: '4',
                            classificadoId: palpites_classificados[e]
                        })

                    } else {
                        await PontuaçãoClassificado.create({
                            userId: users[i].id,
                            pontos: 100,
                            fase: '4',
                            classificadoId: palpites_classificados[e]
                        })
                    }

                }
            }

            for (var e=0; e < semis.length; e++) {
                if (semis[e].s1_id === palpites_semis[e].s1_id && semis[e].s2_id === palpites_semis[e].s2_id ) {

                    if (semis[e].s1_id === users[i].campeãoId || semis[e].s2_id === users[i].campeãoId ) {
                        await PontuaçãoJogo.create({
                            jogoId: semis[e].id,
                            userId: users[i].id,
                            pontos: 400
                        })
                    } else {
                        await PontuaçãoJogo.create({
                            jogoId: semis[e].id,
                            userId: users[i].id,
                            pontos: 200
                        })
                    }

                }
            }
            
        }
        
        return res.status(201).json("Pontuação de classificados concluída com sucesso.")
    },
    pontuarClassificadosFinal: async function (req,res) {
        
        var jogos = await Jogo.findAll();

        var semis = [];

        var final = await Jogo.findByPk(64);

        var terceiro = await Jogo.findByPk(63);

        var classificados_final = [final.s1_id, final.s2_id];

        var classificados_terceiro = [terceiro.s1_id, terceiro.s2_id];

        for (var i=0; i < jogos.length; i++) {
            if (jogos[i].id > 60 && jogos[i].id < 63) {
                semis.push(jogos[i])
            }
        }

        for (var i=0; i < semis.length; i++) {
            if (semis[i].s1_id === null || semis[i].s2_id === null) {
                return res.status(400).json("Jogos das semis ainda não foram finalizados.")
            }
        }

        var users = await User.findAll({where: {
            enviado: true
        }})

        for (var i=0; i < users.length; i++) {

            var palpite_terceiro = await PalpiteJogo.findOne({
                where: {
                    userId: users[i].id,
                    jogoId: 63
                }
            });

            
            var palpite_final = await PalpiteJogo.findOne({
                where: {
                    userId: users[i].id,
                    jogoId: 64
                }
            });


            var palpites_classificados_final = [palpite_final.s1_id, palpite_final.s2_id];
            var palpites_classificados_terceiro = [palpite_terceiro.s1_id, palpite_terceiro.s2_id];

            for (var e=0; e < palpites_classificados_final.length; e++) {

                if (classificados_final.includes(palpites_classificados_final[e])) {

                    if (users[i].campeãoId === palpites_classificados_final[e]) {
                        await PontuaçãoClassificado.create({
                            userId: users[i].id,
                            pontos: 400,
                            fase: '2',
                            classificadoId: palpites_classificados_final[e]
                        })

                    } else {
                        await PontuaçãoClassificado.create({
                            userId: users[i].id,
                            pontos: 200,
                            fase: '2',
                            classificadoId: palpites_classificados_final[e]
                        })
                    }

                }
            }

            for (var e=0; e < palpites_classificados_terceiro.length; e++) {

                if (classificados_terceiro.includes(palpites_classificados_terceiro[e])) {

                    if (users[i].campeãoId === palpites_classificados_terceiro[e]) {
                        await PontuaçãoClassificado.create({
                            userId: users[i].id,
                            pontos: 400,
                            fase: '2.5',
                            classificadoId: palpites_classificados_terceiro[e]
                        })

                    } else {
                        await PontuaçãoClassificado.create({
                            userId: users[i].id,
                            pontos: 200,
                            fase: '2.5',
                            classificadoId: palpites_classificados_terceiro[e]
                        })
                    }

                }
            }

            if (final.s1_id === palpite_final.s1_id && final.s2_id === palpite_final.s2_id) {
                if (users[i].campeãoId === palpite_final.s1_id || users[i].campeãoId === palpite_final.s2_id) {
                    PontuaçãoJogo.create({
                        jogoId: final.id,
                        userId: users[i].id,
                        pontos: 800
                    })
                } else {
                    PontuaçãoJogo.create({
                        jogoId: final.id,
                        userId: users[i].id,
                        pontos: 400
                    })
                }
            }

            if (terceiro.s1_id === palpite_terceiro.s1_id && terceiro.s2_id === palpite_terceiro.s2_id) {
                if (users[i].campeãoId === palpite_terceiro.s1_id || users[i].campeãoId === palpite_terceiro.s2_id) {
                    await PontuaçãoJogo.create({
                        jogoId: terceiro.id,
                        userId: users[i].id,
                        pontos: 800
                    })
                } else {
                    await PontuaçãoJogo.create({
                        jogoId: terceiro.id,
                        userId: users[i].id,
                        pontos: 400
                    })
                }
            }

            if (final.s1_placar > final.s2_placar) {
                var campeão = final.s1_id;
            } else if (final.s2_placar > final.s1_placar) {
                var campeão = final.s2_id;
            } else {
                var campeão = final.vencedor;
            }

            if (users[i].campeãoId === campeão) {
                await PontuaçãoClassificado.create({
                    userId: users[i].id,
                    pontos: 800,
                    fase: '1',
                    classificadoId: campeão
                })
            }

        }
        
        return res.status(201).json("Pontuação de classificados concluída com sucesso.")
    },
    definirResultadoJogoFaseFinal: async function (req,res) {
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

        var pontos = 0
        
        if (jogo.id > 48 && jogo.id < 57) {
            pontos = 100
        } else if (jogo.id > 56 && jogo.id < 61) {
            pontos = 200
        } else if (jogo.id > 60 && jogo.id < 63) {
            pontos = 400
        } else if (jogo.id === 63) {
            pontos = 400
        } else if (jogo.id === 64) {
            pontos = 800
        }

        var palpites = await PalpiteJogo.findAll({
            where: {
                jogoId: id
            }
        });

        for (var i=0; i < palpites.length; i++) {

            var user = await User.findByPk(palpites[i].userId);

            if (palpites[i].s1_id === jogo.s1_id && palpites[i].s2_id === jogo.s2_id && palpites[i].s1_placar === jogo.s1_placar && palpites[i].s2_placar=== jogo.s2_placar) {
                if (jogo.s1_id === user.campeãoId || jogo.s2_id === user.campeãoId) {
                    PontuaçãoJogo.update({
                        pontos: pontos*2
                    }, {
                        where: {
                            userId: palpites[i].userId,
                            jogoId: palpites[i].jogoId
                        }
                    })
                } else {
                    PontuaçãoJogo.update({
                        pontos: pontos
                    }, {
                        where: {
                            userId: palpites[i].userId,
                            jogoId: palpites[i].jogoId
                        }
                    })
                }
            }
        }
    },
    pontuarPrêmios: async function (req,res) {
        var users = await User.findAll({where: {
            enviado: true
        }})

        var palpites_prêmios

        var bola_ouro = await Prêmio.findByPk(1);

        var chuteira_ouro = await Prêmio.findByPk(2);

        var palpites_bola_ouro = await PalpitePrêmio.findAll({
            where: {
                prêmioId: 1
            }
        });

        var palpites_chuteira_ouro = await PalpitePrêmio.findAll({
            where: {
                prêmioId: 2
            }
        });

        for (var i=0; i < palpites_bola_ouro.length; i++) {
            if (palpites_bola_ouro[i].ganhador === bola_ouro.ganhador) {
                await PontuaçãoPrêmio.create({
                    pontos: 400,
                    userId: palpites_bola_ouro[i].userId,
                    prêmioId: 1
                })
            }
        }

        for (var i=0; i < palpites_chuteira_ouro.length; i++) {
            if (palpites_chuteira_ouro[i].ganhador === chuteira_ouro.ganhador) {
                await PontuaçãoPrêmio.create({
                    pontos: 400,
                    userId: palpites_chuteira_ouro[i].userId,
                    prêmioId: 2
                })
            }
        }

        
        return res.status(201).json("Pontuação de prêmiações concluída com sucesso.")

    },
    resetarFaseGrupos: async function (req,res) {
        var jogos = await Jogo.findAll();

        var jogos_grupos = [];

        for (var i=0; i < jogos.length; i++) {
            if (jogos[i].id < 49) {
                jogos_grupos.push(jogos[i])
            }
        }

        for (var i=0; i < jogos_grupos.length; i++) {
            await Jogo.update({
                s1_placar: null,
                s2_placar: null,
            }, {
                where: {
                    jogoId: jogos_grupos[i].id
                }
            })
        }

        var pontos = await PontuaçãoJogo.findAll();

        var pontos_grupos = [];

        for (var i=0; i < pontos.length; i++) {
            if (pontos[i].jogoId < 49) {
                pontos_grupos.push(pontos[i])
            }
        }

        for (var i=0; i < pontos_grupos.length; i++) {
            await PontuaçãoJogo.destroy({
                where: {
                    id: pontos_grupos[i].id       
                }
            })
        }
    },
    resetarOitavas: async function (req,res) {
        var jogos = await Jogo.findAll();

        var jogos_oitavas = [];

        for (var i=0; i < jogos.length; i++) {
            if (jogos[i].id > 48 && jogos[i].id < 57) {
                jogos_oitavas.push(jogos[i])
            }
        }

        for (var i=0; i < jogos_oitavas.length; i++) {
            await Jogo.update({
                s1_placar: null,
                s2_placar: null,
                s1_id: null,
                s2_id: null,
            }, {
                where: {
                    jogoId: jogos_oitavas[i].id
                }
            })
        }

        var pontos = await PontuaçãoJogo.findAll();

        var pontos_oitavas = [];

        for (var i=0; i < pontos.length; i++) {
            if (pontos[i].jogoId > 48 && pontos[i].jogoId < 57) {
                pontos_oitavas.push(pontos[i])
            }
        }

        for (var i=0; i < pontos_oitavas.length; i++) {
            await PontuaçãoJogo.destroy({
                where: {
                    id: pontos_oitavas[i].id       
                }
            })
        }

        var pontos_classificados = await PontuaçãoClassificado.findAll({
            where: {
                fase: '16'
            }
        })

        for (var i=0; i < pontos_classificados.length; i++) {
            await PontuaçãoClassificado.destroy({
                where: {
                    id: pontos_classificados[i].id
                }
            })
        }
    },
    resetarQuartas: async function (req,res) {
        var jogos = await Jogo.findAll();

        var jogos_quartas = [];

        for (var i=0; i < jogos.length; i++) {
            if (jogos[i].id > 56 && jogos[i].id < 61) {
                jogos_quartas.push(jogos[i])
            }
        }

        for (var i=0; i < jogos_quartas.length; i++) {
            await Jogo.update({
                s1_placar: null,
                s2_placar: null,
                s1_id: null,
                s2_id: null,
            }, {
                where: {
                    jogoId: jogos_quartas[i].id
                }
            })
        }

        var pontos = await PontuaçãoJogo.findAll();

        var pontos_quartas = [];

        for (var i=0; i < pontos.length; i++) {
            if (pontos[i].jogoId > 56 && pontos[i].jogoId < 61) {
                pontos_quartas.push(pontos[i])
            }
        }

        for (var i=0; i < pontos_quartas.length; i++) {
            await PontuaçãoJogo.destroy({
                where: {
                    id: pontos_quartas[i].id       
                }
            })
        }

        var pontos_classificados = await PontuaçãoClassificado.findAll({
            where: {
                fase: '8'
            }
        })

        for (var i=0; i < pontos_classificados.length; i++) {
            await PontuaçãoClassificado.destroy({
                where: {
                    id: pontos_classificados[i].id
                }
            })
        }
    },
    resetarSemis: async function (req,res) {
        var jogos = await Jogo.findAll();

        var jogos_semis = [];

        for (var i=0; i < jogos.length; i++) {
            if (jogos[i].id > 60 && jogos[i].id < 63) {
                jogos_semis.push(jogos[i])
            }
        }

        for (var i=0; i < jogos_semis.length; i++) {
            await Jogo.update({
                s1_placar: null,
                s2_placar: null,
                s1_id: null,
                s2_id: null,
            }, {
                where: {
                    jogoId: jogos_semis[i].id
                }
            })
        }

        var pontos = await PontuaçãoJogo.findAll();

        var pontos_semis = [];

        for (var i=0; i < pontos.length; i++) {
            if (pontos[i].jogoId > 60 && pontos[i].jogoId < 63) {
                pontos_semis.push(pontos[i])
            }
        }

        for (var i=0; i < pontos_semis.length; i++) {
            await PontuaçãoJogo.destroy({
                where: {
                    id: pontos_semis[i].id       
                }
            })
        }

        var pontos_classificados = await PontuaçãoClassificado.findAll({
            where: {
                fase: '4'
            }
        })

        for (var i=0; i < pontos_classificados.length; i++) {
            await PontuaçãoClassificado.destroy({
                where: {
                    id: pontos_classificados[i].id
                }
            })
        }
    },
    resetarFinais: async function (req,res) {
        var jogos = await Jogo.findAll();

        var jogos_finais = [];

        for (var i=0; i < jogos.length; i++) {
            if (jogos[i].id > 62 && jogos[i].id < 65) {
                jogos_finais.push(jogos[i])
            }
        }

        for (var i=0; i < jogos_finais.length; i++) {
            await Jogo.update({
                s1_placar: null,
                s2_placar: null,
                s1_id: null,
                s2_id: null,
            }, {
                where: {
                    jogoId: jogos_finais[i].id
                }
            })
        }

        var pontos = await PontuaçãoJogo.findAll();

        var pontos_finais = [];

        for (var i=0; i < pontos.length; i++) {
            if (pontos[i].jogoId > 60 && pontos[i].jogoId < 63) {
                pontos_finais.push(pontos[i])
            }
        }

        for (var i=0; i < pontos_finais.length; i++) {
            await PontuaçãoJogo.destroy({
                where: {
                    id: pontos_finais[i].id       
                }
            })
        }

        var pontos_classificados_final = await PontuaçãoClassificado.findAll({
            where: {
                fase: '2'
            }
        })

        for (var i=0; i < pontos_classificados_final.length; i++) {
            await PontuaçãoClassificado.destroy({
                where: {
                    id: pontos_classificados_final[i].id
                }
            })
        }

        var pontos_classificados_terceiro = await PontuaçãoClassificado.findAll({
            where: {
                fase: '2.5'
            }
        })

        for (var i=0; i < pontos_classificados_terceiro.length; i++) {
            await PontuaçãoClassificado.destroy({
                where: {
                    id: pontos_classificados_terceiro[i].id
                }
            })
        }

        var pontos_classificados_campeão = await PontuaçãoClassificado.findAll({
            where: {
                fase: '1'
            }
        })

        for (var i=0; i < pontos_classificados_campeão.length; i++) {
            await PontuaçãoClassificado.destroy({
                where: {
                    id: pontos_classificados_campeão[i].id
                }
            })
        }

    },
    resetarPrêmios: async function (req,res) {
        var prêmios = await Prêmio.findAll();

        for (var i=0; i < prêmios.length; i++) {
            await Prêmio.update({
                ganhador: null,
            }, {
                where: {
                    id: prêmios[i].id
                }
            })
        }

        var pontuação_prêmios = await PontuaçãoPrêmio.findAll();

        for (var i=0; i < pontuação_prêmios.length; i++) {
            await PontuaçãoPrêmio.destroy({
                where: {
                    id: pontuação_prêmios[i].id
                }
            })
        }
    }
}