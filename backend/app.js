// import des packages
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require("helmet");
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Ajout des routes pour l'identification & l'authentification
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Connexion a la base de données MongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.wrl7m.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  // initialisation de la variable app qui contiendra 'express'
const app = express();
app.use(helmet());
app.use(cors());

// Cette partie configure et autorise les requêtes Multi-Origin; définit les Headers & les Methodes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Définir la fonction json comme middleware global pour l'application
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

// Enregistrement du routeur pour toutes les demandes effectuées vers /api/sauces.

app.use('/api/sauces', sauceRoutes);
// Enregistrement du routeur pour toutes les demandes effectuées vers /api/auth.
app.use('/api/auth', userRoutes);

// Permet d'exporter l'application créee (en l'occurence, elle devient accesible par le serveur.js)
module.exports = app;