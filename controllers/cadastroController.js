const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports= {

    cadastrar: async function (req,res) {
        var nome = req.body.nome;
        var email = req.body.email;
        var password = req.body.password;
        var repeat = req.body.repeatpassword;

        if (password == null || email == null) {
            return res.status(400).json("Não deixe o campo de senha ou email vazio")
        } 

        if (password == repeat) {

            var hashed = bcrypt.hashSync(password, 10);
            try {
                await User.create({ nome: nome, email: email, password: hashed, token_redefinir: null });
                return res.status(201).json('Cadastro efetuado.');
            }
            catch(err){
                console.log(err)
                return res.status(400).json('Tente novamente.');
            }
                
        }
        else return res.status(400).json('Senhas não coincidem.');
    }
}
