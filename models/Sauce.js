const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId : { type: String, required: true},//Utilisateur ayant créer la sauce
    name : { type: String, required: true},//Nom de la sauce
    manufacturer : { type: String, required: true},//Fabricant de la sauce
    description : { type: String, required: true},//Description de la sauce
    mainPepper : { type: String, required: true},//Ingrédient principale
    imageUrl : { type: String, required: true},//Url vers l'image de la sauce
    heat : { type: Number, required: true},//Nombre entre 1 et 10 décrivant la sauce
    likes : { type: Number, default: 0 },//Nombre d'utilisateurs aimant la sauce
    dislikes : { type: Number, default: 0 },//Nombre d'utilisateurs n'aimant pas la sauce
    usersLiked : { type: Array },//Tableau d'identifiants d'utilisateurs ayant aimé la sauce
    usersDisliked : { type: Array },//Tableau d'identifiants d'utilisateurs n'ayant pas aimé la sauce
})

//Export en model mongoose -> (nom, schema)
module.exports = mongoose.model('Sauce', sauceSchema);