const Sauce = require('../models/Sauce');
const fs = require('fs');

//Ajouter une sauce :
exports.addSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        // TODO : Supression de l'extension du fichier d'origine
        imageUrl: req.protocol+'://'+req.get('host')+'/img/'+req.file.filename
    })
    sauce.save()
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
  let sauceObject;
  
  if(req.file) {//Il y a t-il une nouvelle image ?
    sauceObject = {...JSON.parse(req.body.sauce), imageUrl: req.protocol+"://"+req.get('host')+"/img/"+req.file.filename};
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        //On supprime l'ancienne image
        const filename = sauce.imageUrl.split('/img/')[1];
        fs.unlink('img/'+filename, () => {console.log('image supprimée')});
      })
      .catch(error => res.status(400).json({ error }));
  } else {//sinon...
    sauceObject = {...req.body}
  }

  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};
//Suprimer une sauce
exports.deleteSauce = (req, res, next) => {

  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      //Supression de l'image
      const filename = sauce.imageUrl.split('/img/')[1];
      fs.unlink('img/'+filename, () => {
        //Supression de l'objet dans la MongoDB
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      })
    })
    .catch(error => res.status(500).json({ error }));
};
exports.likeSauce = (req, res, next) => {
  switch (req.body.like) {

    case 0:
      Sauce.findOne({ _id: req.params.id })//Récupération de la sauce
        .then((sauce) => {
          // L'utilisateur aime déjà la sauce ?
          if (sauce.usersLiked.find((user) => user === req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: -1 },//On retrire le like
                $pull: { usersLiked: req.body.userId },//On retire l'utilisateur de la liste
                _id: req.params.id,
              }
            )
            .then(() => {res.status(201).json({ message: "Avis positif retiré !" });})
            .catch((error) => {res.status(400).json({ error: error });});
          }
          // L'utilisateur n'aime déjà pas la sauce ?
          if (sauce.usersDisliked.find((user) => user === req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },//On retire le dislike
                $pull: { usersDisliked: req.body.userId },//On retire l'utilisateur de la liste
                _id: req.params.id,
              }
            )
            .then(() => {res.status(201).json({ message: "Avis négatif retiré !" });})
            .catch((error) => {res.status(400).json({ error: error });});
          }
        })
        .catch((error) => {
          res.status(404).json({ error: error });
        });
      break;

    case 1:
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },// On ajoute un like
          $push: { usersLiked: req.body.userId },//On ajoute l'utlisateur à la liste
          _id: req.params.id,
        }
      )
      .then(() => {res.status(201).json({ message: "Sauce likée !" });})
      .catch((error) => { res.status(400).json({ error: error });});
      break;

    case -1:
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: 1 },// On ajoute un dislike
          $push: { usersDisliked: req.body.userId },//On ajoute l'utlisateur à la liste
          _id: req.params.id,
        }
      )
      .then(() => { res.status(201).json({ message: "Sauce dislikée !" }); })
      .catch((error) => {res.status(400).json({ error: error });});
      break;

    default:
      console.error("Oops ! Bad request :(");
  }
};