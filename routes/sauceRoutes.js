const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/saucesCtrl');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

//CRUD___________________________________________________________

//Ajouter une sauce :
router.post('/', auth, multer, saucesCtrl.addSauce);
//Recuperer toutes les sauces
router.get('/', auth, saucesCtrl.getSauces);
//Recupérer une sauce
router.get('/:id', auth, saucesCtrl.getOneSauce);
//Mettre à jour une sauce
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
//Suprimer une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);

//================================================================

//Fonctionalité "Like / Dislike"
router.post('/:id/like', auth, saucesCtrl.likeSauce);

//Export
module.exports = router;