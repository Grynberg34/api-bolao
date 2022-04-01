const express = require('express');
const router = express.Router();
const redefinirController = require('../controllers/redefinirController');


router.get('/', function(req,res){
    res.status(200).json('Insira seu email para que um código de recuperação de senha seja enviado para você.')
});

router.post('/', redefinirController.pedirRefinicaoSenha);

router.post('/nova-senha', redefinirController.mudarSenha);

module.exports = router;
