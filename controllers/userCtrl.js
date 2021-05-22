require('dotenv').config()//Variables d'environement
const jwt = require('jsonwebtoken');//Module de gestion de token
const User = require('../models/User');

//S'inscrire
exports.signup = (req, res, next) => {
  new User({
    email: req.body.email,
    password: req.body.password
  })
    .save()
    .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
    .catch((error) => res.status(400).json({ error }));
};
  

//Se connecter
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })//L'utilisateur est chercher dans la MongoDB via son email (unique)
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)//Les MDP sont comparés
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(//Un token est généré avec l'id
                { userId: user._id },
                process.env.TOKEN,
                { expiresIn: '24h' }//Expire au bout de 24h
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};