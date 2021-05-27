//-----------------------------------------------------
//Variables d'environement :
require('dotenv').config()
const host = process.env.DB_HOST;
const username = process.env.DB_USER;
const password = process.env.DB_PASS;

//-----------------------------------------------------
//API de base :
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const express = require('express');
const app = express();
const path = require('path');

//-----------------------------------------------------
//mongoSanitize [SECURITE]
const mongoSanitize = require('express-mongo-sanitize');

//-----------------------------------------------------
//helmet [SECURITE]
const helmet = require('helmet');

//-----------------------------------------------------
//Rate limiter [SECURITE]
const rateLimit = require('express-rate-limit');

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//Si l'api est derriere un 'reverse proxy' 
//(Heroku, Bluemix, AWS ELB, Nginx, etc)
//app.set('trust proxy', 1);
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const limiter = rateLimit({
  //100 req max par tranche de 10 minutes par IP
  windowMs: 10 * 60 * 1000,  max: 100, message:"Too many accounts created from this IP, please try again after 10 min"
});
const authLimiter = rateLimit({
  //5 req max par tranche de 1 minutes par IP ---> pour s'authentifier et créer des comptes
  windowMs: 1 * 60 * 1000,  max: 5, message:"Too many accounts created from this IP, please try again after 10 min"
});

//-----------------------------------------------------
//Connection a MongoDB
mongoose.connect('mongodb+srv://'+username+':'+password+'@'+host,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//-----------------------------------------------------
//Logique CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

//-----------------------------------------------------
//Middleware utilitaires
app.use(helmet())
app.use(express.json());//Pour parser les requètes
app.use(mongoSanitize());
app.use(limiter);
app.use('/img', express.static(path.join(__dirname, 'img')));

//-----------------------------------------------------
//Sauces ROUTES
const sauceRoutes = require('./routes/sauceRoutes')
app.use('/api/sauces', sauceRoutes);

//-----------------------------------------------------
//User ROUTES
const userRoutes = require('./routes/userRoutes')
app.use('/api/auth', authLimiter, userRoutes);

//-----------------------------------------------------
//Exports
module.exports = app;