//Main entry point//
const express = require("express");
const winston = require("winston")
const path = require("path");
require("dotenv").config()
const cookieParser = require("cookie-parser")
const cors = require("cors");
const fs = require("fs");
const ApiError = require("./errors/ErrorObj");
// cron job to send error logs every 72Hrs
// const cron = require("node-cron");
// const errorMailer = require("./lib/sendErrorLogsViaEmail")

// cron.schedule('* * */3 * *', async () =>{
//   // send content of the Error Log createdBy Winston
//   try{
//     let pathToLoggerFile = path.join(__dirname,"errorLogger.log")
//     const { status} = await errorMailer.SendErrorLogsByEmail(pathToLoggerFile);
//     // perform log clean up if email succeeds
//     if(status === "success"){
//       fs.unlink(pathToLoggerFile, err => {
//         if (err){
//           winston.error(err);
//           return
//         }
//       })
//       return
//     }
//   }catch(err){
//     winston.error(err);
//   }
// })

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
const suscribedRouter = require("./routes/users/subscribe");
const { handleErrors } = require("./errors/ErrorMiddleWare");
app.use("/users", userRouter);
app.use("/subscribed", suscribedRouter);
app.use("*", (req,res,next) =>{
  next(ApiError.NotFoundError());
})
app.use(handleErrors)

module.exports = app