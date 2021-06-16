const createUser = require("../database/createUser");

//database imports
const dbStructure = require("../database/modelStructure");
const { dbName } = require("../lib/envConfig");
const User = dbStructure(dbName);
const tokenDB = require("../database/tokensDb");
const Tokens = tokenDB(dbName);

//other middlewares
const {
  RetrieveToken,
  VerifyToken,
  HashandSavePassword,
  CleanUp,
} = require("../lib/ResetPassword");

const tokenHelper = require("../lib/signToken")
const formatTime = require("../lib/formatTime");
const sendEmail = require("../utils/emailSender");
const findUser = require("../database/findUser");
const unhashPassword = require("../lib/unHashPassword");
const resetTokens = require("../lib/ResetTokens");

module.exports.Signup = async (req, res) => {
 
  try {
    let response = await createUser(req, User);
    const { token, options, code, user } = await tokenHelper.CreateAndSendToken(
      response.account,
      201,
      res,
      req
    );
     res.cookie("jwt", token,options);
     console.log(token)
    
    res.status(code).send({
      token,
      data:{
        user
      }
    }
    )
} catch (err) {
    console.log(`An error just occured ${err.message}`);
    res.status(500).send({ message: err.message, reason: err.error });
  }
};


module.exports.resetPassword = async (req, res) => {
  try {
    let result = await resetTokens(req.body.email, res, User, Tokens);
    await sendEmail(
      result.user.email,
      {
        name: result.user.businessName,
        link: result.link,
        email: result.user.email,
        homeLink: process.env.CLIENT_URL,
      },
      "Password Reset Request",
      "./resetPassword.handlebars"
    );
    res
      .status(200)
      .send({ status: "success", message: "Password reset successful" });
  } catch (err) {
    res.status(500).send({ status: "failed", err: err });
  }
  //logic for ressetting password here
};


module.exports.signIn = async (req, res) => {
  try {
    let queryResult = await findUser(User, req, res);
    let UserAuth = await unhashPassword(req, queryResult);
    if (UserAuth.response){
      const { token, options, code, user } = await tokenHelper.CreateAndSendToken(queryResult.user[0]._id,200,res,req)
      res.cookie("jwt", token, options);
      res.status(code).send({
      token,
      data:{
        user
      }
    })
  }
  else{
      res.status(403).send({message:"password incorrect, Kindly check", status:"failed"})
    } 
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports.resetConfirm = async (req, res) => {
  try {
    const tokenExist = await RetrieveToken(req.body.userId, Tokens, res);
    const isValid = await VerifyToken(tokenExist, req.body.token);
    const userInfo = await HashandSavePassword(
      isValid,
      User,
      res,
      req.body.userId,
      req.body.password
    );
    const { time, day } = await formatTime();
    await sendEmail(
      userInfo.email,
      {
        time: time,
        date: day,
      },
      "Password Reset Success",
      "./resetSuccess.handlebars"
    );
    await CleanUp(tokenExist);
    res.send({
      status: "Success",
      message: "Your password has been reset successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};


module.exports.confirmUser = async (req,res) =>{
    //this is the route the front end will always hit to see if user has been set
    //as any user with cookies that contain jwt signed by this server is auth'ed
    let currentUser;
    console.log(req.cookies)
    try{
        if (!req.cookies.jwt){
            currentUser = null
        }else{
          //get the jwt from the cookie
        const token = req.cookies.jwt;
        const decoded = await tokenHelper.decode(token)
        //get the user data associated with the Id and send it to the frontend
        currentUser = await User.findById(decoded.id)
        }
        console.log(currentUser)
        res.status(200).send({currentUser})
    }catch(err){
        console.log(err)
        res.send(err.message)
    }
}

module.exports.User = User