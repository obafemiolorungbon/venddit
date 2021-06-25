//Main entry point//
const express = require("express");
const winston = require("winston")
require("dotenv").config()
const cookieParser = require("cookie-parser")
const cors = require("cors");

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
winston.add(new winston.transports.File({filename:"errorLogger.log"}))
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))
//routers
const userRouter = require("./routes/users/users");
app.use("/users", userRouter);
const suscribedRouter = require("./routes/users/subscribe");
const { handleErrors } = require("./errors/ErrorMiddleWare");
app.use("/subscribed", suscribedRouter);

app.use(handleErrors)

module.exports = app