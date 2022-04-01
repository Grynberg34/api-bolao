const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

var jwtOptions = {};
jwtOptions.secretOrKey = process.env.JWT_KEY;

module.exports= {

    login: function (req,res) {
        var email = req.body.email;
        var password = req.body.password;
      
        User.findOne({ where :{email: email}})
        .then(function(user){

            if (user) {
                bcrypt.compare(password, user.password, function(err, isMatch) {
                    if(isMatch){
                    var payload = { id: user.id, tipo_conta: user.tipo_conta };
                    var token = jwt.sign(payload, jwtOptions.secretOrKey);
                    return res.status(200).json({ "mensagem" : 'Token gerado', token: token });
                    } 
                    else {
                        return res.status(400).json({ "mensagem" : 'Senha incorreta' });
                    }
                })
            }
            else {
                return res.status(400).json({ "mensagem": 'Usuário não encontrado' });
            }
        })
        .catch(function(err){
            console.log(err)
            res.redirect('/login')
        });
    }
}
