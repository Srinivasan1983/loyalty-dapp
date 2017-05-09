const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const config   = require("../config/database");
const user     = require("./user.js");
const uniqueValidator = require('mongoose-unique-validator');
const APIError = require('../config/APIError');
const lightWallet = require('eth-lightwallet');
const Web3 = require('web3');
const web3 = new Web3();
const HookedWeb3Provider = require('hooked-web3-provider');
const keyStore = lightWallet.keystore;
const encryptionHDPath = "m/0'/0'/2'";
const web3config = require('../config/web3-config');
const provider = new web3.providers.HttpProvider(web3config.gethUrl);
web3.setProvider(new web3.providers.HttpProvider(web3config.gethUrl));



//var ks = localStorage.getItem('keystore');
	//if (ks) {
	//	ks = lightWallet.keystore.deserialize(ks);
//}




//define all scheme
const WalletSchema = mongoose.Schema({
  keyPassword: String,
  userIdentity: {
    type: String,
    index: true,
    unique:true
  },
  type: Number,
  addressName: String,
  WIFKey: String,
  passphrase:String,
  firstAddress: String,
  balance: { type: Number, default: 0 },
  //balanceSat: { type: Number, default: 0 },
  //totalReceived: { type: Number, default: 0 },
  //totalReceivedSat: { type: Number, default: 0 },
  //totalSent: { type: Number, default: 0 },
  //totalSentSat: { type: Number, default: 0 },
  //unconfirmedBalance: { type: Number, default: 0 },
  //unconfirmedTxApperances: { type: Number, default: 0 },
  //txApperances: { type: Number, default: 0 },
  //transactions: [
  //  { txid: String },
  //  { confirmations: String },
  //  { amount: Number },
  //  { fee: Number },
  //  { status: Number },
  //  { createAt: { type: Date, default: new Date() } }
  //],
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() }
});

WalletSchema.plugin(uniqueValidator);

WalletSchema.statics = {

  getWalletById(id) {
    return this.findById(id)
      .exec()
      .then((callback) => {
        if (callback) {
          return callback;
        }
      })
      .catch(() => {
        const err = new APIError('No such wallet exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }


}

const UserWallet = module.exports = mongoose.model('UserWallet', WalletSchema);

module.exports.addNewUserWallet = function(newUserWallet, callback) {

  var keyPassword = newUserWallet.keyPassword;
  var passphrase = newUserWallet.passphrase = keyStore.generateRandomSeed();
  var salt       = keyStore.generateSalt();

  keyStore.createVault({
      password : keyPassword,
      salt:salt,
      passphrase : passphrase
  }, function(err, ks) {
      if (err) {
            return callback(err);
          }
      ks.passwordProvider = function(callback) {
            callback(null, keyPassword);
          }
      ks.keyFromPassword(keyPassword, function (err, pwDerivedKey) {
          if (err) {
                return callback(err);
              }
             const firstAddress = newUserWallet.firstAddress = getAddress(ks, pwDerivedKey);
             const WIFKey = newUserWallet.WIFKey = ks.exportPrivateKey(firstAddress, pwDerivedKey);
             const data = new Buffer(ks.getSeed(pwDerivedKey)+";"+ks.salt).toString('base64');
             console.log("data "+data);
             console.log(firstAddress + " created")
             var pubKey = getEncryptionKey(ks, pwDerivedKey);
             console.log(pubKey);
             switchToHooked3(ks);
             var keyStoreString = ks.serialize();
          //   console.log(keyStoreString);
             var balance = newUserWallet.balance = getUserBalance(firstAddress);
             console.log("Your Balance " + balance);
             newUserWallet.save(callback);
          //callback(null, firstAddress, balance);
      });
  });
}

function getAddress(keystore, pwDerivedKey) {
    var address;
    address = keystore.getAddresses()[0];
    if (!address) {
        keystore.generateNewAddress(pwDerivedKey, 1);
    }
    return '0x' + keystore.getAddresses()[0];
}

function getEncryptionKey(keystore, pwDerivedKey) {
    try {
        keystore.getPubKeys(encryptionHDPath);
    } catch (e) {
        keystore.addHdDerivationPath(encryptionHDPath, pwDerivedKey, {
            curve: 'curve25519',
            purpose: 'asymEncrypt'
        });
        keystore.generateNewEncryptionKeys(pwDerivedKey, 1, encryptionHDPath);
    }
    return '0x' + keystore.getPubKeys(encryptionHDPath)[0];
}


function switchToHooked3(_keystore){
      //  console.log("switchToHooked3");
      //  console.log(_keystore);
        var web3Provider = new HookedWeb3Provider({
          host: web3config.gethUrl, // check what using in truffle.js
          transaction_signer: _keystore
        });

        web3.setProvider(web3Provider);
}

function getUserBalance(address) {
	return web3.fromWei(web3.eth.getBalance(address).toNumber(), 'ether');
}



/**module.exports.addUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
       bcrypt.hash( newUser.password, salt, function(err, hash) {
         if(err) throw err;
         newUser.password = hash;
         newUser.save(callback);

       });
   });
}

module.exports.comparePassword = function(candidatePassword,hash, callback ) {
    bcrypt.compare(candidatePassword, hash, (err,isMatch)=> {
        if(err) throw err;
        callback(null, isMatch);
    });
}*/
