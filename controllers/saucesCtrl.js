const Sauce = require('../models/Sauce');

//Ajouter une sauce :
exports.addSauce = (req, res, next) => {
    const sauce = new Sauce({
        ...req.body
    })
    thing.save()
        .then(() => res.status(201).json({ message : 'Sauce ajoutée !' }))
        .catch(error => res.status(400).json({ error }));
};
//Recuperer toutes les sauces
exports.getSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};
//Recupérer une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};
//Mettre à jour une sauce
exports.modifySauce = (req, res, next) => {
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
};
//Suprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Thing.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
      .catch(error => res.status(400).json({ error }));
};