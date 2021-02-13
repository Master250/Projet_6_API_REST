const Sauce = require('../models/Sauce');
const like = require('../models/Like');
const fs = require('fs');

// ******************* Créer une sauce *********************
exports.createSauce = (req,res,next) =>{
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce =  new Sauce({   
      ...sauceObject, 
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    
  });
  sauce.save()
  .then(() => res.status(201).json({ message: 'Objet enrégistré !'}))
      
  .catch(error => res.status(400).json({ error }));
      
};

exports.modifySauce = (req, res, next) => {
        
  const sauceObject = req.file ?
  {
      ...JSON.parse(req.body.sauce),
      imageUrl:`${ req.protocol}://${ req.get('host')}/images/${ req.file.filename}`
  } : { ...req.body};
  Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id})
      .then(() =>res.status(201).json({message: 'Objet modifié !'}))
          
      .catch(error => res.status(400).json({error:error }));
  
};

exports.deleteSauce = (req, res, next) =>{
  Sauce.findOne({ _id: req.params.id })
      then(sauce => {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () =>{
              Sauce.deleteOne({ _id: req.params.id})
                  .then(() => res.status(200).json({message: 'Objet supprimé !'}))});
      })
  
      .catch(error => res.status(404).json({ error:error }));
};
exports.getOneSauce = (req, res, next) =>{
  Sauce.findOne({ _id: req.params.id})
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(404).json({error:error}));
};

exports.getAllSauces = (req,res, next) =>{
  Sauce.find()
      .then((sauces) => {res.status(200).json(sauces)})
      .catch((error) => {res.status(400).json({error:error });
      }
  );
};

exports.likeSauces = (req, res, next) => {
  let uid = req.body.userId, like = req.body.like;
  
  Sauces.findOne({ _id: req.params.id }).exec(function (error, sauce){
    let msg = "", uiL = sauce.usersLiked.indexOf(uid), uiD = sauce.usersDisliked.indexOf(uid);
    
    if(like == 0 && uiL >-1){

      sauce.likes--;
      sauce.usersLiked.splice(uiL,1);
      msg = "Unliked !";
  
    } else if(like == 0 && uiD >-1){

      sauce.dislikes--;
      sauce.usersDisliked.splice(uiD,1);
      msg = "Undisliked !";

    };

    if(like == 1){

      sauce.likes++;
      if (sauce.usersLiked.length == 0){
        sauce.usersLiked=[uid];
        
      } else{
        sauce.usersLiked.push(uid);
      }
      msg = "Like pris en compte !";
    };

    if(like == -1){

      sauce.dislikes++;
      if (sauce.usersDisliked.length == 0){
        sauce.usersDisliked=[uid];
      } else{
        sauce.usersDisliked.push(uid);
      }
      msg = "Disike pris en compte !";

    };

    sauce.save()
      .then(() => res.status(201).json({ message: msg}))
      .catch(error => res.status(400).json({ error }));

  });
};
