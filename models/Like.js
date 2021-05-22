const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
    userId : { type: String, required: true},//Utilisateur
    like : { type: Number, required: true},// 1 = Like / 0 = Neutre / -1 = Dislike
})

//Export en model mongoose -> (nom, schema)
module.exports = mongoose.model('Sauce', likeSchema);