const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.get('/', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.mostrarInfosUser);

router.post('/enviar-palpite-jogo', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.enviarPalpiteJogo);

router.post('/enviar-palpite-premio', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.enviarPalpitePrêmio);

router.post('/enviar-palpite-classificado', passport.authenticate('jwt', {session: false}), authController.checarUser, userController.enviarPalpiteClassificado);

module.exports = router;
