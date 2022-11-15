const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.get('/', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.mostrarInfosUser);

router.get('/jogos', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.mostrarJogosGrupo);

router.get('/classificacao', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.ordenarGrupos);

router.get('/checar-grupos', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.checarGrupos);

router.get('/checar-oitavas', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.checarOitavas);

router.get('/checar-quartas', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.checarQuartas);

router.get('/checar-semis', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.checarSemis);

router.get('/checar-finais', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.checarFinais);

router.get('/oitavas', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.mostrarJogosOitavas);

router.get('/quartas', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.mostrarJogosQuartas);

router.get('/semis', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.mostrarJogosSemis);

router.get('/finais', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.mostrarJogosFinais);

router.post('/enviar-palpite-jogo', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.enviarPalpiteJogo);

router.post('/limpar-jogo-duplicado', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.limparJogoDuplicado);

router.post('/enviar-palpite-premio', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.enviarPalpitePrêmio);

router.post('/limpar-premios-duplicados', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.limparPrêmiosDuplicados);

router.get('/finalizar', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.finalizarBolao);

router.get('/mostrar-palpites', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.mostrarPalpites);

router.get('/ranking', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.mostrarRanking);

router.get('/ranking/:id', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.mostrarPalpitesPorId);

router.get('/todos-jogos', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.mostrarTodosJogos);

router.get('/todos-jogos/grupos/:id', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.mostrarPalpitesPorJogo);

router.get('/todos-jogos/fase-final/:id', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.mostrarPalpitesPorJogoFaseFinal);

module.exports = router;
