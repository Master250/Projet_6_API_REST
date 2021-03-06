// Activation du mode STRICT de Javascript
"use strict";

// import des packages
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Fonction de Signup
/*
Dans cette fonction singup :

nous appelons la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de « saler » le mot de passe 10 fois. 
Plus la valeur est élevée, plus l'exécution de la fonction sera longue, et plus le hachage sera sécurisé.

il s'agit d'une fonction asynchrone qui renvoie une Promise dans laquelle nous recevons le hash généré ;

dans notre bloc then , nous créons un utilisateur et l'enregistrons dans la base de données, en renvoyant une réponse de réussite en cas de succès, 
et des erreurs avec le code d'erreur en cas d'échec ;
*/

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
/*
nous utilisons la fonction sign de jsonwebtoken pour encoder un nouveau token ;

ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token) ;

nous utilisons une chaîne secrète de développement temporaire RANDOM_SECRET_KEY pour encoder notre token 
(à remplacer par une chaîne aléatoire beaucoup plus longue pour la production) ;

nous définissons la durée de validité du token à 24 heures. L'utilisateur devra donc se reconnecter au bout de 24 heures ;

nous renvoyons le token au front-end avec notre réponse.
*/
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
