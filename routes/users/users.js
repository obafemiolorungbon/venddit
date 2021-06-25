const express = require('express');
const router = express.Router();

//import middlewares
const hashPassword = require('../../lib/hashPassword');
const formParser = require("../../lib/formParser.js");
const { validationRules, validation } = require("../../lib/validator");
const alreadyExists = require("../../lib/alreadyReg");

//Dont forget that validationRules is a function that returns, so must be called inside the route
const userController = require("../../controllers/userController")
router.post('/signup', formParser,validationRules(),validation,alreadyExists(userController.User),hashPassword,userController.Signup);
 
router.post("/reset-password",formParser, userController.resetPassword);

router.post("/signin", formParser,userController.signIn);

router.post("/reset-confirm",formParser,userController.resetConfirm);

router.get("/",userController.confirmUser);

router.get("/logout", userController.logUserOut);

router.post("/image-upload",formParser, userController.saveImages);

router.get("/get-images",userController.getImages);


module.exports = router