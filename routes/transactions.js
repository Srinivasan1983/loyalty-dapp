const express     = require("express");
const passport    = require("passport");
const jwt         = require("jsonwebtoken");
const Transaction = require("../models/transaction");
const config      = require("../config/database");
const UserWallet     = require("../models/wallet");
const router      = express.Router();
const walletCtrl = require('../controller/wallet.controller');


router.get('/dashboard', walletCtrl.bitcoin.listUserTransactionEvents);

//Register router
router.post("/transaction", (req, res, next) => {

    let userTransaction = new Transaction({
        name     : req.body.name,
        address  : req.body.address,
        amount   : req.body.amount,
        password : req.body.pass,
        txid:'',
        blockNumber:'',
        from:'',
        confirmations:'',
        balance:''

    });


Transaction.getUserWalletByUsername(userTransaction.name, (err, result) => {
      if(err) throw err
        if(!userTransaction.name){
          return res.json({success: false, msg: 'User not found'});
        }

    Transaction.addUserTransaction(userTransaction,result.data , (err, trans) => {

       if(err) {
         res.json({success: false, msg:"Failed to register Transaction"});
       }else {
         console.log("abcdefghijklmn");
         res.json({success: true, msg:"Transaction registered"});
       }
    });

  });
});

module.exports = router;
