const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

router.get('/google',
  passport.authenticate('google', {session: false})
);

router.get('/google/callback', authController.autenticar);


module.exports = router;