const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const config   = require("../config/database");
const Schema = require('mongoose').Schema;
const uniqueValidator = require('mongoose-unique-validator');
const autoIncrement = require('mongoose-auto-increment');

//var database = mongoose.createConnection("mongodb://localhost:27017/loyalauth");
//autoIncrement.initialize(database);

//define all scheme
const UserSchema = mongoose.Schema({

    name:{
      type:String,
      required:true
    },
    email:{
      type:String,
      required:true,
      unique:true
    },
    username:{
      type:String,
      required:true,
      unique:true
    },
    password:{
      type:String,
      required:true
    },
    transaction:{
      type: Schema.Types.ObjectId, ref: 'Transaction'
    }
});

//UserSchema.plugin(autoIncrement.plugin, 'User');
const User = module.exports = mongoose.model("User", UserSchema);
UserSchema.plugin(uniqueValidator);
//UserSchema.plugin(autoIncrement.plugin, {
//    model: 'User',
//    field: 'userId',
//    startAt: 0000001,
//    incrementBy: 1
//});

module.exports.getUserById = function(id, callback){
   User.findById(id,callback);
}


module.exports.getUserByUsername = function(username, callback){
   const query = {username:username}
   User.findOne(query,callback);
}

/*module.exports.getUserTransactionByUsername = function(username, callback) {
    User.findOne({username:username}).populate('transaction').exec(callback)

}*/

module.exports.addUser = function(newUser, callback) {
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
}
