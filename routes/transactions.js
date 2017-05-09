const express     = require("express");
const passport    = require("passport");
const jwt         = require("jsonwebtoken");
const Transaction = require("../models/transaction");
const config      = require("../config/database");
const router      = express.Router();


//Register router
router.post("/transaction", (req, res, next) => {

    let userTransaction = new Transaction({
        username : req.body.username,
        address  : req.body.address,
        amount   : req.body.amount,
        password : req.body.password

    });
    Transaction.addUserTransaction(userTransaction, (err, transaction) => {

       if(err) {
         res.json({success: false, msg:"Failed to register Transaction"});
       }else {
         res.json({success: true, msg:"Transaction registered"});
       }
    });
});

module.exports = router;
