// import des packages
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//schéma de données pour un utilisateur
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

// Nous verifions ensuite que l'adresse mail est unique dans la base de donnée
userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User', userSchema);