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

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) return next(err);
          // override the cleartext password with the hashed one
          user.password = hash;
          next();
      });
  });
});

module.exports = mongoose.model('User', userSchema);