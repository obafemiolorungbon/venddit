const createUser = require("../database/createUser");
const { dbName } = require("../lib/envConfig");

//database imports
const dbStructure = require("../database/modelStructure");
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

const formatTime = require("../lib/formatTime");
const sendEmail = require("../utils/emailSender");
const findUser = require("../database/findUser");
const unhashPassword = require("../lib/unHashPassword");
const resetTokens = require("../lib/ResetTokens");
const addCookie = require("../lib/AddCookie");

module.exports.Signup = async (req, res) => {
  try {
    let response = await createUser(req, User);
    res.status(201).send(response);
  } catch (err) {
    console.log(err);
    console.log(`An error just occured ${err.error}`);
    res.status(500).send({ message: err.message, reason: err.error });
  }
};


module.exports.resetPassword = async (req, res) => {
  try {
    console.log("REquest received");
    console.log(req.body.email);
    let result = await resetTokens(req.body.email, res, User, Tokens);
    sendEmail(
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
    let result = await addCookie(UserAuth, req);
    res.send(result);
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
    sendEmail(
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

module.exports.User = User