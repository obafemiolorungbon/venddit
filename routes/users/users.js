const express = require('express');
const router = express.Router();

// dependencies
const ApiError = require("../../errors/ErrorObj");
const multiparty = require("multiparty");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");

//import middlewares
const hashPassword = require('../../lib/hashPassword');
const formParser = require("../../lib/formParser.js");
const { SignUpValidationRules, 
    SignInValidationRules,
    resetPasswordValidationRules,
    resetConfirmValidationRules,
     validation } = require("../../lib/validator");
const alreadyExists = require("../../lib/alreadyReg");

//Dont forget that validationRules is a function that returns, so must be called inside the route
const userController = require("../../controllers/userController")
router.post('/signup',
            formParser ( multiparty, ApiError ) , 
            SignUpValidationRules( check ),
            validation( validationResult, ApiError ), 
            alreadyExists( userController.User, ApiError ),
             hashPassword( bcrypt, ApiError ),
             userController.Signup
             );
 
router.post("/reset-password",
            formParser( multiparty, ApiError ), 
            resetPasswordValidationRules( check ),
            validation ( validationResult, ApiError ),
            userController.resetPassword
            );

router.post(
            "/signin",
            formParser(multiparty, ApiError),
            SignInValidationRules(check),
            validation ( validationResult, ApiError ),
            userController.signIn
);

router.post(
            "/reset-confirm",
            formParser(multiparty, ApiError),
            resetConfirmValidationRules(check),
            validation( validationResult, ApiError ),
            userController.resetConfirm
);

router.get("/",userController.confirmUser);

router.get("/logout", userController.logUserOut);

router.post("/image-upload",
            formParser ( multiparty, ApiError ), 
            userController.saveImages
            );

router.get("/get-images",userController.getImages);


module.exports = router