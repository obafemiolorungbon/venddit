//Main entry point//
const express = require("express");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config()
const cookieParser = require("cookie-parser")
const PORT = process.env.PORT||3001 
const cors = require("cors");
const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))
//routers
const userRouter = require("./routes/users/users");
app.use("/users", userRouter);
const suscribedRouter = require("./routes/users/subscribe");
app.use("/subscribed", suscribedRouter);
//for request logging
app.use(morgan('dev')); 

app.listen(PORT, ()=> {
    console.log(`Server is now running on port ${PORT}`);
});


module.exports = app