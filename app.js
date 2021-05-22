require('dotenv').config()//Variables d'environement

const express = require('express');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const app = express();
const path = require('path');

//-Variables-d'environements-MGdb--
const host = process.env.DB_HOST;
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
//---------------------------------
//Connection a MongoDB
mongoose.connect('mongodb+srv://'+username+':'+password+'@'+host,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Logique CORS pour autoriser l'accès de n'importe où
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Middleware utilitaires
app.use(express.json());//Pour parser les requètes
app.use('/img', express.static(path.join(__dirname, 'img')));

//Routes
//___________________________________________________Sauces
const sauceRoutes = require('./routes/sauceRoutes')
app.use('/api/sauces', sauceRoutes);
//___________________________________________________User
const userRoutes = require('./routes/userRoutes')
app.use('/api/auth', userRoutes);
//Exports
module.exports = app;