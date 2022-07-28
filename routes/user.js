const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.get('/', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.mostrarInfosUser);

router.get('/jogos', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.mostrarJogosGrupo);

router.get('/classificacao', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.ordenarGrupos);

router.get('/checar-grupos', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.checarGrupos);

router.get('/oitavas', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.mostrarJogosOitavas);

router.post('/enviar-palpite-jogo', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.enviarPalpiteJogo);

router.post('/enviar-palpite-premio', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.enviarPalpitePrêmio);

module.exports = router;
