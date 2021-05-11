const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user_Ctrl');

//S'inscrire
router.post('/signup', userCtrl.signup);
//Se connecter
router.post('/login', userCtrl.login);


module.exports = router;