//Main entry point//
const express = require("express");
//cookieparser for cookies
const morgan = require("morgan");
const PORT = process.env.PORT||5000 
//dotenv config file
const {sessionSecret,sessionMaxAge} = require('./lib/envConfig');
//path for file url management
const path = require("path");
//For session management
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
const PORT = port;
const userRouter = require("./routes/users/users");
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