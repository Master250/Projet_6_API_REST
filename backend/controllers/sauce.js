// Activation du mode STRICT de Javascript
"use strict";

// import des packages
const Sauce = require('../models/Sauce');
const fs = require('fs');


// ******************* Créer une sauce *********************
/*
Dans cette fonction createSauces :

Nous commençons par utiliser la fonction parse de JSON pour récupérer les données envoyées par l'utilisateur depuis le "frontend" pour construire un objet.
Nous supprimons l'ID reçu, car celui-ci sera créer automatiquement par MongoDB
Ensuite, nous appelons le constructeur Sauces qui se trouve dans les modèles pour construire l'objet en récupérant tous les paramètres qui sont présent dans la constante sauce
Finalement, nous utilisons la fonction save pour enregistrer l'objet dans la collection Sauces de la base de données MongoDB.

En retournant des erreurs avec le code d'erreur en cas d'échec.
*/
exports.createSauce = (req,res,next) =>{
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;

  const sauce =  new Sauce({   
      ...sauceObject, 
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    
  });
  sauce.save()
  .then(() => res.status(201).json({ message: 'Objet enrégistré !'}))
      
  .catch(error => res.status(400).json({ error }));
      
};

// Fonction de modification d'une sauce
/*
Dans cette fonction modifySauces :

Nous commençons par récupérer les données envoyées par l'utilisateur depuis le "frontend" pour modifier un objet.
Nous récupérons le fichier image (si une image est envoyé) pour qu'elle contienne le chemin avec le nom de fichier typé (Ex : img.jpg)

Nous mettons a jour les données reçu, avec une image ou sans.

Enfin nous mettons à jour l'objet de la base de données via la propriété save de mongoose.

Le tout en renvoyant une réponse de réussite en cas de succès, et des erreurs avec le code d'erreur en cas d'échec ;
*/
exports.modifySauce = (req, res, next) => {
        
  const sauceObject = req.file ?
  {
      ...JSON.parse(req.body.sauce),
      imageUrl:`${ req.protocol}://${ req.get('host')}/images/${ req.file.filename}`
  } : { ...req.body};
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id})
      .then(() =>res.status(200).json({message: 'Objet modifié !'}))
          
      .catch(error => res.status(400).json({error:error }));
  
};

// Fonction de suppression d'une sauce
/*
Dans cette fonction deleteSauces :

Nous appelons la fonction findOne pour récupérer l'ID unique de la sauce créé par l'utilisateur,

Dans notre bloc then, nous récupérons le fichier image dans une constante "filename" depuis l'URL "splitté",
Ensuite avec le package fs, nous allons chercher le ficher immage correspondant dans l'arbre du serveur et nous le supprimons

Enfin, via deleteOne nous supprimons l'objet dans la base de données.

Le tout en renvoyant une réponse de réussite en cas de succès, et des erreurs avec le code d'erreur en cas d'échec ;
*/
exports.deleteSauce = (req, res, next) =>{
  Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () =>{
              Sauce.deleteOne({ _id: req.params.id})
                  .then(() => res.status(200).json({message: 'Objet supprimé !'}))
                  .catch(error => res.status(400).json({ error }));
                });
      })
  
      .catch(error => res.status(404).json({ error }));
};

// Fonction de récupération d'une sauce
/*
Dans cette fonction getOneSauces :

Nous récupérons via findOne la sauce correspondant à l'ID liée dans la base de données.
En retournant des erreurs avec le code d'erreur en cas d'échec.
*/
exports.getOneSauce = (req, res, next) =>{
  Sauce.findOne({ _id: req.params.id})
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(404).json({error:error}));
};

// Fonction de récupération de la liste des Sauces

exports.getAllSauces = (req,res, next) =>{
  Sauce.find()
      .then((sauce) => {res.status(200).json(sauce)})
      .catch((error) => {res.status(400).json({error:error });
      }
  );
};

// Fonction Like/Dislike
/*Dans un premier temps, on récupère les réponses userId & like du frontend.
Ensuite on récupère le params.id pour trouver la sauce concérné par le Like/Dislike via findOne.
Si l'utilisateur annule un choix, alors on supprime son userID du tableau correspondant & on ajoute ou supprime 1 au compteur correspondant
puis on modifie le message qui sera affiché lors de l'appel de save.

Si l'utilisateur aime une sauce et que le tableau usersLiked est vide, on créer une entrée, sinon on ajoute celui-ci au tableau,
on incrémente le compteur correspondant (likes), puis on modifie le message qui sera affiché lors de l'appel de save.

Si l'utilisateur n'aime pas une sauce, et que le tableau usersDisliked est vide, on créer une entrée, sinon on ajoute celui-ci au tableau,
on incrémente le compteur correspondant(dislikes), puis on modifie le message qui sera affiché lors de l'appel de save.

En retournant des erreurs avec le code d'erreur en cas d'échec.
*/
exports.likeSauces = (req, res, next) => {

  const likeStatus = req.body.like;
  const userId = req.body.userId;
  const sauceId = req.params.id;
  Sauce.findOne({ _id: req.params.id }).then(sauce => {

    console.log(sauce.usersLiked);


    if (likeStatus === 1) {
      console.log(userId+' aime cette sauce.');
      Sauce.updateOne({ _id: sauceId },
        {$push: { usersLiked: userId }, $inc: { likes: +1 },}
      )
      .then(() => res.status(200).json({ message: 'Vous aimez cette sauce. ' }))
      .catch((error) => res.status(400).json({ error }))


    }

    if (likeStatus === -1) {
      console.log('Vous n\'aimez pas cette sauce.');
      Sauce.updateOne({ _id: sauceId },
        {$push: { usersDisliked: userId }, $inc: { dislikes: +1 },}
      )
      .then(() => res.status(200).json({ message: 'Vous n\'aimez pas cette sauce. ' }))
      .catch((error) => res.status(400).json({ error }))
    }

    if (likeStatus === 0) {
      console.log('Vous annulez votre j\'aime ou j\'aime pas.');
      const ind = sauce.usersLiked.indexOf(userId);
      if (ind > -1) {
        sauce.usersLiked.slice(ind, 1);
        Sauce.updateOne({ _id: sauceId },
          {$push: { usersLiked: {$each: [ ], $slice: ind} }, $inc: { likes: -1 },}

        )
        .then(() => res.status(200).json({ message: ' ' }))
        .catch((error) => res.status(400).json({ error }))
        
      } else if (ind === -1) {
        const indDisliked = sauce.usersDisliked.indexOf(userId);
        sauce.usersDisliked.slice(indDisliked, 1);

        Sauce.updateOne({ _id: sauceId },
          {$push: { usersDisliked: {$each: [ ], $slice: indDisliked} }, $inc: { dislikes: -1 },}

        )
        .then(() => res.status(200).json({ message: ' ' }))
        .catch((error) => res.status(400).json({ error }))
      }
    }

  });

}

