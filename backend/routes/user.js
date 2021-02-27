// import des packages
const express = require('express');
const userCtrl = require('../controllers/user');

// Initialisation du routeur
const router = express.Router();

// Définition des routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;