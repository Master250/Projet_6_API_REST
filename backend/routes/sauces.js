const express = require('express');
const multer = require('multer');

const router = express.Router();
const auth = require('../middleware/auth');
const sauceCtrl = require('../controllers/sauce');

router.post('/',auth,multer, sauceCtrl.createSauce);

router.put('/:id',auth, sauceCtrl.modifySauce);

router.delete('/:id',auth, sauceCtrl.deleteSauce);

router.get('/:id', sauceCtrl.getOneSauce);

router.get('/', sauceCtrl.getAllSauces);

router.post('/:id/like',auth, sauceCtrl.likeSauces);

module.exports = router;