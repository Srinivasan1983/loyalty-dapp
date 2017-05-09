const express    = require("express");
const path       = require("path");
const bodyparser = require("body-parser");
const cors       = require("cors");
const passport   = require("passport");
const mongoose   = require("mongoose");
const config     = require("./config/database");
const crypto     = require('crypto');
const lightWallet = require('eth-lightwallet');


//connect to database
mongoose.connect(config.database);

//Check connection status
mongoose.connection.on("connected", ()=> {
     console.log("Connected to database "+ config.database)
});

mongoose.connection.on("error", (err)=> {
     console.log("Error in database Connection "+ err)
});


const app = express();

const port = 3000;

//user selects the pages it routes into users file
const users = require("./routes/users");

//user select for wallet information
const userswallet = require("./routes/wallet.route");

const images = require("./routes/wallet.route");

const trans = require("./routes/transactions");







//cors for middleware
app.use(cors());

//set static folder for client module
app.use(express.static(path.join(__dirname, 'public')));

//collect data from form submission
app.use(bodyparser.json());

app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

app.use("/users", users);
app.use("/wallet", userswallet);
app.use("/wallet", trans);



app.get('/', (req,res) => {
    res.send("Invalid Endpoint")
});


app.listen(port, () => {
  console.log("server started on Port "+ port)

});
