const express = require('express');
const router = express.Router();
const { dbName } = require('../../lib/envConfig');
const hashPassword = require('../../lib/hashPassword');
const formParser = require("../../lib/formParser.js");
const { validationRules, validation } = require("../../lib/validator");
const addCookie = require("../../lib/AddCookie")
const dbStructure = require("../../database/modelStructure");
const tokenDB = require("../../database/tokensDb");
const User = dbStructure(dbName);
const Tokens = tokenDB(dbName)
const createUser = require("../../database/createUser");
const alreadyExists = require("../../lib/alreadyReg");
const findUser = require("../../database/findUser");
const unhashPassword = require("../../lib/unHashPassword");
const resetTokens = require("../../lib/ResetTokens");
const sendEmail = require("../../utils/emailSender");
const formatTime = require("../../lib/formatTime")
const {RetrieveToken,VerifyToken,HashandSavePassword,CleanUp} = require("../../lib/ResetPassword");
//Dont forget that validationRules is a function that returns, so must be called inside the route
 
router.post('/signup', formParser,validationRules(),validation,alreadyExists(User),hashPassword, async(req, res) => {
    try{
       let response = await createUser(req, User);
       res.status(201).send(response)
    }catch(err){
        console.log(err)
        console.log(`An error just occured ${err.error}`)
        res.status(500).send({message:err.message, reason:err.error})
    }
});
 
router.post("/reset-password",formParser, async(req, res) => {
    try{
        console.log("REquest received")
        console.log(req.body.email)
        let result = await resetTokens(req.body.email,res, User,Tokens)
        sendEmail(result.user.email,{
            name:result.user.businessName,
            link:result.link,
            email:result.user.email,
            homeLink:process.env.CLIENT_URL
        },
        "Password Reset Request"
        ,
        "./resetPassword.handlebars"
        )
        res.status(200).send({status:"success",message:"Password reset successful"})
    }
    catch(err){
        res.status(500).send({status:"failed",err:err})
    }
    //logic for ressetting password here
});

router.post("/signin", formParser,async (req, res) => {
    try{
        let queryResult = await findUser(User, req,res);
        let UserAuth = await unhashPassword(req, queryResult);
        let result = await addCookie(UserAuth,req);
        res.send(result);
    }catch(err){
        console.log(err)
        res.status(500).send(err);
    }
});

router.post("/reset-confirm",formParser,async (req,res)=>{
    try{
           const tokenExist = await RetrieveToken(req.body.userId,Tokens,res);
           const isValid = await VerifyToken(tokenExist, req.body.token);
           const userInfo = await HashandSavePassword(isValid,User,res,req.body.userId,req.body.password)
           const { time, day } = await formatTime();
           sendEmail(
               userInfo.email,
               {
                   time:time,
                   date:day
               },
               "Password Reset Success",
               "./resetSuccess.handlebars"
           )
           await CleanUp(tokenExist)
           res.send({status:"Success", message:"Your password has been reset successfully"})

    }catch(err){
        console.log(err)
        res.status(500).send(err)

    }
 
})

module.exports = router;