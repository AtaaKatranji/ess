const crypto = require('crypto');

exports.generateUniqueKey = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
};
