const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

router.get('/google', authController.autenticar);

router.post('/google/signin', authController.gerarTokenGoogle);

module.exports = router;