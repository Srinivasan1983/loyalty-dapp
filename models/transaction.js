const mongoose = require("mongoose");
const config   = require("../config/database");
const web3config = require('../config/web3-config');
const async = require("async");
const Web3 = require('web3');
const web3 = new Web3();
const Schema = require('mongoose').Schema;
const math    = require('mathjs');
const wallet = require('./wallet');
const lightWallet = require('eth-lightwallet');
const Tx  = require("ethereumjs-tx");
const keyStore = lightWallet.keystore;
const HookedWeb3Provider = require('hooked-web3-provider');
const provider = new web3.providers.HttpProvider(web3config.gethUrl);
web3.setProvider(new web3.providers.HttpProvider(web3config.gethUrl));

var asyncTasks = [];


//const account = web3.eth.coinbase;

const transactionSchema = mongoose.Schema({


     name:{type:String, required:true },
     password:String,
     txid:{type: String },
     blockNumber:String,
     from:String,
     confirmations:{type: String },
     amount:{type: Number },
     //fee:{type: Number },
     //status:{type: Number },
     address:{type: String },
     balance: { type: Number, default: 0 },
     createAt: { type: Date, default: new Date() }


});

transactionSchema.statics = {

  list({ skip = 0, limit = 100 } = {}) {
    return this.find()
      .sort({ blockNumber: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }


}


const Transaction = module.exports = mongoose.model("Transaction", transactionSchema);

//module.exports.getUserByUsername = function(username, callback){
//   const query = {username:username}
//   User.findOne(query,callback);
//}
module.exports.getUserWalletByUsername = function(name, callback){
   const query = {userIdentity:name}
   wallet.findOne(query,callback);
}



module.exports.addUserTransaction = function(userTransaction, data , callback) {

    var status   = 0;
    var confirmations = 'Unconfirmed';
    var name     = userTransaction.name;
    var amount   = web3.toWei(userTransaction.amount,'ether');
    var address  = userTransaction.address;
    var pass     = userTransaction.password;
    console.log(pass);
    console.log(amount);
    console.log(address);

async.series([
    function(callback) {

    keyStore.createVault({
      password:pass,
      seedPhrase: new Buffer( data , 'base64').toString('ascii').split(';')[0],
      salt: new Buffer( data , 'base64').toString('ascii').split(';')[1]

    }, function(err, ks) {
      switchToHooked3(ks);
      console.log(err);
     if (err) {
        return console.error(err);
      }else {
        ks.keyFromPassword(pass, function (err, pwDerivedKey) {
          if (err)
              console.error(err);
          ks.generateNewAddress(pwDerivedKey, 1);
          const addr = '0x' + ks.getAddresses()[0];
          const pvKey = ks.exportPrivateKey(addr, pwDerivedKey);
          console.log(pvKey);
          console.log(addr);
          var rawTx = {
              nonce : parseInt(web3.eth.getTransactionCount(address)),
              gasPrice : web3.toHex(web3.eth.gasPrice),
              gasLimit : web3.toHex(300000),
              to :web3.eth.coinbase || '0x0000000000000000000000000000000000000000',
              from : addr,
              value : web3.toHex(amount) || '0x0',
              payload : '0x0'
          };
              console.log(data);
              console.log("AAAAAAAAACCCCC"+ rawTx.from);
              console.log('TX:',rawTx);
              var tx = new Tx(rawTx);
              tx.sign(new Buffer(pvKey, 'hex'));
              //var serializedTx = '0x'+tx.serialize().toString('hex');
              //console.log(serializedTx);
              var balance = getUserBalance(addr);
              console.log("Your Balance " + balance);


      var serializedTx = '0x'+tx.serialize().toString('hex');
      web3.eth.sendRawTransaction(serializedTx, function(err, txHash) {
                if (err) return console.error("AAAACCCCCC"+err);
                var blockFilter = web3.eth.filter('latest');
                blockFilter.watch(function() {
                  web3.eth.getTransactionReceipt(txHash, function(err, receipt) {
                    if (err) return console.error(err);
                    if (receipt) {
                      blockFilter.stopWatching();
                      userTransaction.from          = receipt.from;
                      userTransaction.txid          = receipt.transactionHash;
                      userTransaction.blockNumber   = receipt.blockNumber
                      userTransaction.address       = receipt.to;
                      userTransaction.balance       = getUserBalance(userTransaction.from);
                      userTransaction.confirmations = "Confirmed";
                      console.log(rawTx);
                      userTransaction.save();
/*--------------------------------------------------------------------------------*/
    wallet.findOneAndUpdate({ "userIdentity": userTransaction.name }, { "$set": { "balance": userTransaction.balance},"$inc":{"userpoints":10}}).exec(function(err, res1){
              if(err) {
                  console.log(err);
                } else {
                  console.log(res1);
                  console.log("Your Amounr "+rawTx.value);
                  callback();
                }
              });
/*--------------------------------------------------------------------------------*/

                    }
                  });
                });
              });
          });
        }
    });
  }

],function(err, hash) {
    if (err) {
      console.log(err);
    } else {
      callback();
    }
  });
}

function getUserBalance(faddress) {
	return web3.fromWei(web3.eth.getBalance(faddress).toNumber(), 'ether');
}


function getAddress(keystore, pwDerivedKey) {
    var address;
    console.log(keystore);
    address = keystore.getAddresses()[0];
    console.log("your Address "+address);
    if (!address) {
        keystore.generateNewAddress(pwDerivedKey, 1);
    }
    return '0x' + keystore.getAddresses()[0];
}

function waitForTransactionReceipt(hash) {
    console.log('waiting for contract to be mined');
    const receipt = web3.eth.getTransactionReceipt(hash);
    // If no receipt, try again in 1s
    if (receipt == null) {
        setTimeout(() => {
            waitForTransactionReceipt(hash);
        }, 1000);
    } else {
        // The transaction was mined, we can retrieve the contract address
        //console.log('contract address: ' + receipt);
        return receipt;
        //testContract(receipt.contractAddress);
    }
    return receipt;
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
