const bcrypt = require('bcrypt-nodejs');
//function for password hashing
module.exports = function cryptPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return reject(err);
      bcrypt.hash(password, salt, null, function (err, hash) {
        if (err) return reject(err);
        return resolve(hash);
      });
    });
  });
};