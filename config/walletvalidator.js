const expressJoi = require('express-joi');

const createWallet = {
  userIdentity: expressJoi.Joi.types.String().alphanum().min(1).max(25),
  password: expressJoi.Joi.types.String().alphanum().min(1).max(25),
  //passphrase: expressJoi.Joi.types.String().min(2).max(100)
};

module.exports = {
    createWallet
}
