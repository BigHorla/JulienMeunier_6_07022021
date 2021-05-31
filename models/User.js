const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const bcrypt = require('bcrypt');
const regex = new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,120})$/);
const SALT_WORK_FACTOR = 10;

/* 
Validation du mot de passe
Règles:
- entre 8 et 120 signes
- pas d'espace
- au minimum une lettre minuscule
- au minimum une lettre majuscule
- au minimum un chiffre
- au minimum un des symboles suivant $ @ % * + - _ ! 
*/

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, match :[regex, 'invalid password ! Rules : 8-120 chars, no spaces, must contain at least one a-z char, one a-z char, one digit, one of the folowing chars:$ @ % * + - _ !']},
});

userSchema.plugin(uniqueValidator);

userSchema.pre('save', function(next) {
  const user = this;

  // S'il est nouveau ou modifié : le mdp est hashé et salé
  if (!user.isModified('password')) return next();

  // Préparation du salage
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) return next(err);

      // Hashage avec le salage
      bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) return next(err);
          // Remplacement du mdp en claire par celui hashé
          user.password = hash;
          next();
      });
  });
});

module.exports = mongoose.model('User', userSchema);