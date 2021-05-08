const express = require('express');
const router = express.Router();
//dotenv config file
const { dbName, secretKey } = require('../../lib/envConfig');
//hashPassword
const hashPassword = require('../../lib/hashPassword');
//cookieparser for cookies
//import the middlware to use for parsing forms
const formParser = require("../../lib/formParser.js");
const { validationRules, validation } = require("../../lib/validator");
const addCookie = require("../../lib/AddCookie")
//create database
const dbStructure = require("../../database/modelStructure");
const User = dbStructure(dbName);
//save users
const createUser = require("../../database/createUser");
//check if user exists
const alreadyExists = require("../../lib/alreadyReg");
//find users
const findUser = require("../../database/findUser");
//unhash and compare password
const unhashPassword = require("../../lib/unHashPassword");
//Dont forget that validationRules is a function that returns, so must be called inside the route
 
router.post('/signup', formParser,validationRules(),validation,alreadyExists(User),hashPassword, async(req, res) => {
    try{
       let response = await createUser(req, User);
       res.send(response)
    }catch(err){
        console.log(err)
        console.log(`An error just occured ${err.error}`)
        res.send({message:err.message, reason:err.error})
    }
});
 
router.post("/reset-password", formParser, (req, res) => {
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
        res.send(err);
    }
});

module.exports = router;