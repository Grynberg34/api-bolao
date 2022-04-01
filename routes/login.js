const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');


router.get('/', function(req,res){
    res.status(200).json('Insira email e senha para realizar o login')
});

router.post('/', loginController.login);

module.exports = router;
