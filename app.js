const express = require('express');
const mongoose = require('mongoose');
const app = express();

//------------------------------
const userName = 'Juju'
const mdp = 'Iu0DOFbyzYss5SjL';
//------------------------------



//Connection a MongoDB
mongoose.connect('mongodb+srv://'+userName+':'+mdp+'@mabdd.wyv27.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
//Logique CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Routes
//___________________________________________________Sauces
const sauceRoutes = require('./routes/sauce_Routes')
app.use('/api/sauces', sauceRoutes);
//___________________________________________________User
const userRoutes = require('./routes/user_Routes')
app.use('/api/auth', userRoutes);
//Exports
module.exports = app;