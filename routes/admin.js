const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');

router.get('/', passport.authenticate('jwt', {session: false}), authController.checarAdmin,
    function (req, res) {
        res.status(201).json('Admin')
    }
);

router.post('/definir-resultado-grupos', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.definirResultadoJogoGrupos);

router.post('/resetar-resultado', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.resetarResultadoJogo);

router.post('/classificados-oitavas', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.pontuarClassificadosOitavas);

router.post('/classificados-quartas', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.pontuarClassificadosQuartas);

router.post('/classificados-semis', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.pontuarClassificadosSemis);

router.post('/classificados-finais', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.pontuarClassificadosFinal);

router.post('/definir-resultado-fase-final', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.definirResultadoJogoFaseFinal);

router.post('/pontuar-premios', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.pontuarPrêmios);

module.exports = router;
