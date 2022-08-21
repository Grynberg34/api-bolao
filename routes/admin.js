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

router.get('/classificados-oitavas', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.pontuarClassificadosOitavas);

router.get('/classificados-quartas', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.pontuarClassificadosQuartas);

router.get('/classificados-semis', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.pontuarClassificadosSemis);

router.get('/classificados-finais', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.pontuarClassificadosFinal);

router.post('/definir-resultado-fase-final', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.definirResultadoJogoFaseFinal);

router.post('/pontuar-premios', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.pontuarPrêmios);

router.get('/resetar-grupos', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.resetarFaseGrupos);

router.get('/resetar-oitavas', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.resetarOitavas);

router.get('/resetar-quartas', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.resetarQuartas);

router.get('/resetar-semis', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.resetarSemis);

router.get('/resetar-finais', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.resetarFinais);

router.get('/resetar-premios', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.resetarPrêmios);

router.post('/resetar-usuario', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.resetarUsuário);

module.exports = router;
