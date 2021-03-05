// Activation du mode STRICT de Javascript
"use strict";

// import des packages
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Fonction de Signup

exports.signup = (req, res, next) =>{
    
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email:maskEmail(req.body.email),
                password: hash
            });
            
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur crée !'}))
                .catch(error => res.status(400).json({ error}));
        })
        .catch(error => res.status(500).json({ error}));
};


// Fonction de Login

exports.login = (req,res,next) =>{
    User.findOne({ email:maskEmail(req.body.email) })
        .then(user => {
            if(!user){
                return res.status(401).json({ error: 'Utilisateur non trouvé !'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid){
                        return res.status(401).json({ error: 'Mot de passe incorrect !'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            process.env.SECRET,
                            { expiresIn: '24h'}
                        )
                        
                    });
    
                })
                .catch(error => res.status(500).json({ error}));// Problème de connexion
            
        })
        .catch(error => res.status(500).json({ error}));// Problème de connexion
};

function  maskEmail(email, reveal=false){
    let newEmail = "";
    let arobase = false;
    let valeurCodee;
    let valeurCodeeMasquee;
    let valeurReencodeeMasquee;
    for(let i=0, size=email.length; i<size; i++){
        if (email[i]=== "@"){
            newEmail +="@";
            arobase = true;
            continue;
        }
        if (arobase && email[i] === "."){
            newEmail +=".";
            continue;
        }
        valeurCodee = email.charCodeAt(i);
        if (reveal) valeurCodeeMasquee = valeurCodee-1;
        else valeurCodeeMasquee = valeurCodee +1;
        valeurReencodeeMasquee = String.fromCharCode(valeurCodeeMasquee);
        newEmail += valeurReencodeeMasquee;
    }
    return newEmail;
}
