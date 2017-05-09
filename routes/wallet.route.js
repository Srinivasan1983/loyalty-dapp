const express = require('express');
const expressJoi = require('express-joi');
const walletCtrl = require('../controller/wallet.controller');
const validatorSchema = require('../config/walletvalidator');
const router = express.Router();
const lightWallet = require('eth-lightwallet');
const UserWallet     = require("../models/wallet");
const Currency = require('../controller/currencyTypes');
const Web3 = require('web3');
const web3 = new Web3();

//router.post('/wallet', expressJoi.joiValidate(validatorSchema.createWallet), walletCtrl.bitcoin.createBTCAddress);
router.get('/dashboard', walletCtrl.bitcoin.listUserEvents);
router.post('/walletInfo', walletCtrl.bitcoin.listUserWalletInfo);
router.post('/userTrans', walletCtrl.bitcoin.listUserTransactions);


//module.exports = router;

//var encryptionHDPath = "m/0'/0'/2'";
// salt: lightWallet.keystore.generateSalt();

router.post("/wallet", (req, res, next) => {


    let newUserWallet = new UserWallet({
        keyPassword : req.body.keyPassword,
        userIdentity: req.body.userIdentity,
        type: Currency.EtH,
        addressName: 'My EtH Wallet',
        firstAddress:'',
        passphrase:'',
        WIFKey:'',
        balance:''
    });
    UserWallet.addNewUserWallet(newUserWallet, (err, wallet) => {

       if(err) {
         res.json({success: false, msg:"Failed to Create user Wallet", err:err});
       }else {
         res.json({success: true, msg:"user Wallet Created"});
       }
    });
});

module.exports = router;
