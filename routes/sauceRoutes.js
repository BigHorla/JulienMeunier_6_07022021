const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/saucesCtrl');
const auth = require('../middleware/auth');

//Ajouter une sauce :
router.post('/', auth, saucesCtrl.addSauce);
//Recuperer toutes les sauces
router.get('/', auth, saucesCtrl.getSauces);
//Recupérer une sauce
router.get('/:id', auth, saucesCtrl.getOneSauce);
//Mettre à jour une sauce
router.put('/:id', auth, saucesCtrl.modifySauce);
//Suprimer une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);

//Export
module.exports = router;