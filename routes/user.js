const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

router.get('/', passport.authenticate('jwt', {session: false}), authController.checarUser,
    function (req, res) {
        res.status(201).json('User')
    }
);

module.exports = router;
