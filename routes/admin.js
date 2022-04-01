const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

router.get('/', passport.authenticate('jwt', {session: false}), authController.checarAdmin,
    function (req, res) {
        res.status(201).json('Admin')
    }
);

module.exports = router;
