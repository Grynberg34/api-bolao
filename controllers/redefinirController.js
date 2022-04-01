const User = require('../models/User');
const nodemailer = require ('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
}));

module.exports= {

    pedirRefinicaoSenha: function (req,res) {
        var email = req.body.email;
        var code = uuidv4();
        
        User.findOne({ where: {email: email} }).then(user => {
            if (!user) {
                return res.status(400).json("Não foi encontrada nenhuma conta com esse email.")
            }   
            
            if (user) {
                user.update({
                    token_redefinir: code
                })

                var mailOptions = {
                    from: process.env.MAILER_MAIL,
                    to: `${email}`,
                    subject: 'Criar Nova Senha ',
                    text: `Use este código para criar uma nova senha: ${code}`
                };
                
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                return res.status(200).json('Código enviado ao email.')
            }
        })
        .catch(function(err){
            console.log(err)
            res.redirect('/redefinir')
        });
    },

    mudarSenha: function (req,res) {
        var emailcode = req.body.code;
        var password = req.body.password;
        var repeat = req.body.repeatpassword;
        var hashedpassword = bcrypt.hashSync(password, 10);
        if (password == repeat){

            User.findOne({ where: {token_redefinir: emailcode} }).then(user => {
                if (!user) {
                   return res.status(400).json('Código errado. Tente novamente.')
                }

                if (user) {
                    user.update({
                        password: hashedpassword,
                        token_redefinir: null
                    })

                    return res.status(200).json('Senha alterada com sucesso.')
                }

            })
            .catch(function(err){
                console.log(err)
                res.redirect('/redefinir')
            });

        } 
        else return res.status(400).json('Senhas não coincidem.')
    }
    
}
