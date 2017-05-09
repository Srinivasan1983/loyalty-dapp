const mongoose = require("mongoose");
const config   = require("../config/database");
const web3config = require('../config/web3-config');
const Web3 = require('web3');
const web3 = new Web3();
const lightWallet = require('eth-lightwallet');
const keyStore = lightWallet.keystore;
const HookedWeb3Provider = require('hooked-web3-provider');
const provider = new web3.providers.HttpProvider(web3config.gethUrl);
web3.setProvider(new web3.providers.HttpProvider(web3config.gethUrl));


//const account = web3.eth.coinbase;

const transactionSchema = mongoose.Schema({


     name:{type:String, required:true },
     password:String,
     txid:{type: String, required:true },
     confirmations:{type: String },
     amount:{type: Number },
     fee:{type: Number },
     status:{type: Number },
     address:{type: String },
     balance: { type: Number, default: 0 },
     createAt: { type: Date, default: new Date() }


});

const Transaction = module.exports = mongoose.model("Transaction", transactionSchema);

//module.exports.getUserByUsername = function(username, callback){
//   const query = {username:username}
//   User.findOne(query,callback);
//}


module.exports.addUserTransaction = function(userTransaction, callback) {

    var name     = userTransaction.name;
    var amount   = userTransaction.amount;
    var address  = userTransaction.address;
    var keyPassword = userTransaction.password;
    var passphrase = keyStore.generateRandomSeed();
    var salt       = keyStore.generateSalt();

console.log(keyPassword);
    keyStore.createVault({
        password : keyPassword,
        salt:salt,
        passphrase : passphrase
    }, function(err, ks) {
        if (err) {
              console.log(err);
              return callback(err);

            }
        ks.passwordProvider = function(callback) {
              callback(null, keyPassword);
            }
        ks.keyFromPassword(keyPassword, function (err, pwDerivedKey) {
            if (err) {
                  return callback(err);
                }

              var address = userTransaction.address = getAddress(ks, pwDerivedKey)
              switchToHooked3(ks);
               console.log(address);
              var fromAddr = address;
              console.log(fromAddr);
           	  var toAddr   = web3.eth.coinbase; // default owner address of client
              console.log(toAddr);
           	  var valueEth = amount;
              console.log(valueEth);
           	  var value    = parseFloat(valueEth)*1.0e18;
           	  var gasPrice = 1000000000000;
              var gas      = 50000;

           web3.eth.sendTransaction({from: fromAddr, to: toAddr, value: value}, function (err, txhash) {
           	  if (err) console.log('ERROR: ' + err)
           	  console.log('txhash: ' + txhash + " (" + amount + " in ETH sent)");
           		var balance = userTransaction.balance = getUserBalance(fromAddr);
              console.log(balance);
                 });
            //callback(null, firstAddress, balance);
        });
    });





      //userTransaction.save(callback);
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

function switchToHooked3(_keystore){
      //  console.log("switchToHooked3");
      //  console.log(_keystore);
        var web3Provider = new HookedWeb3Provider({
          host: web3config.gethUrl, // check what using in truffle.js
          transaction_signer: _keystore
        });

        web3.setProvider(web3Provider);
}
