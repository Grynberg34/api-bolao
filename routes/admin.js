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

router.post('/definir-resultado', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.definirResultadoJogo);

router.post('/resetar-resultado', passport.authenticate('jwt', {session: false}), authController.checarAdmin, adminController.resetarResultadoJogo);

module.exports = router;
