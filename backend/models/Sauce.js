// import des packages
const mongoose = require('mongoose');

// schéma de données d'une sauce
const sauceSchema = mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    heat: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    userId: { type: String, required: true },
    likes: { type: Number, required: false, default: 0},
    dislikes: {type: Number, required: false, default: 0},
    usersLiked: [{type: String, required: false, default: []}],
    usersDisliked: [{type: String, required: false, default: []}]
    
});

module.exports = mongoose.model('Sauce', sauceSchema);