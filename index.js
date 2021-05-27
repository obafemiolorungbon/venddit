//Main entry point//
const express = require("express");
const morgan = require("morgan");
const PORT = process.env.PORT||5000 
const {sessionSecret,sessionMaxAge} = require('./lib/envConfig');
const path = require("path");
const cors = require("cors");
const session = require('express-session');
const app = express();
app.use(
  session({
    resave: false,
    saveUninitialized : false,
    cookie: {
      sameSite: true,
      httpOnly: true,
      maxAge: sessionMaxAge,
    },
    secret: sessionSecret,
  })
  );
const userRouter = require("./routes/users/users");
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use("/users", userRouter);
const suscribedRouter = require("./routes/users/subscribe");
app.use("/subscribed", suscribedRouter);
//for request logging
app.use(morgan('dev'));

 //the port dynamically set
 
app.get("/", (req, res) => {
    console.log("Client has connected");
    if(req.session.UserID) {
      res.status(200).json({message:"Welcome back old user",id:req.session.UserID});
      return       
    }
    res.status(200).json({message:"Welcome to the home page new user",status:"Success"});
});


app.listen(PORT, ()=> {
    console.log(`Server is now running on port ${PORT}`);
});