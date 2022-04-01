const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.status(201).json('Seja bem-vindo!')
});


module.exports = router;
