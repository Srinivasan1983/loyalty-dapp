const express  = require("express");
const passport = require("passport");
const jwt      = require("jsonwebtoken");
const User     = require("../models/user");
const config   = require("../config/database");
const router   = express.Router();
const httpStatus = require('http-status');
const bitcoinjs = require('bitcoinjs-lib');
const lightWallet = require('eth-lightwallet');
const bigi = require('bigi');
const WalletSchema = require('../models/wallet');
const transactionSchema = require('../models/transaction');
const Currency = require('./currencyTypes');
const Web3 = require('web3');
const web3 = new Web3();
const Promise = require('bluebird');
const HookedWeb3Provider = require('hooked-web3-provider');


const bitcoin = {

/*  createBTCAddress: (req, res, next) => {
    const body = req.body;
    const password = body.password;
    const userIdentity = body.userIdentity;
    const passphrase = lightWallet.keystore.generateRandomSeed();
    var salt = lightWallet.keystore.generateSalt();
    var hdPathString = "m/0'/0'/0'";
    lightWallet.keystore.deriveKeyFromPassword(password,salt,hdPathString,salt,passphrase,function(err, pwDerivedKey){
    	        	    //console.log("pwDerivedKey="+pwDerivedKey);

    	    var keystore = new lightWallet.keystore(passphrase, pwDerivedKey, hdPathString, salt);

    	    keystore.generateNewAddress(pwDerivedKey,1);
    	    address = keystore.getAddresses(hdPathString);
          privateKey = keystore.exportPrivateKey(address, pwDerivedKey);
          //switchToHooked3(keystore);

          const wallet = new WalletSchema({
            userIdentity:userIdentity,
            passphrase: passphrase,
            type: Currency.EtH,
            addressName: 'My EtH Wallet',
            address: "0x"+address,
            WIFKey: privateKey,
            balance:this.balance
          });

          wallet.pre('save', function (next) {
            var self = this;
            WalletSchema.find({userIdentity : self.userIdentity}, function (err, docs) {
              if (!docs.length){
                  next();
              }else{
                  console.log('user exists: ',self.userIdentity);
                  next(new Error("User exists!"));
                }
              });
            });


          wallet.save((err, callback) => {
            if(err) {
              res.json({success: false, msg:"Failed to Generate Wallet Address"});
            }else {
              res.json({success: true, msg:"Wallet Address Created"});
            }
        });

  });
},*/





//   listUserEvents: (req, res, next) => {
//    const { limit = 100, skip = 0 } = req.query;
//    WalletSchema.list({ limit, skip })
//      .then(callback => res.json({wallet:callback}))
//      .catch(e => next(e));
//    },

    listUserTransactionEvents: (req, res, next) => {
      const { limit = 100, skip = 0 } = req.query;
      transactionSchema.list({ limit, skip })
        .then(callback => res.json({transactionInfo:callback}))
        .catch(e => next(e));
      },


  listUserTransactions: (req, res, next) => {
     transactionSchema.find({"name" : req.body.username}).sort({ blockNumber: -1 }) //.select('-WIFKey')
     .then(callback => res.json({success:true,userTrans:callback}))
      .catch(e => next(e));

    },

  listUserWalletInfo: (req, res, next) => {
     WalletSchema.find({"userIdentity" : req.body.username}) //.select('-WIFKey')
     .then(callback => res.json({success:true,walletInfo:callback}))
      .catch(e => next(e));

    }

}


module.exports = {
  bitcoin
};
