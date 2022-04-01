const express = require('express');
const cadastroController = require('../controllers/cadastroController');
const router = express.Router();

router.post('/', cadastroController.cadastrar);

module.exports = router;
