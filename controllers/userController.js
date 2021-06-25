const createUser = require("../database/createUser");

//database imports
const dbStructure = require("../database/modelStructure");
const { dbName } = require("../lib/envConfig");
const User = dbStructure(dbName);
const tokenDB = require("../database/tokensDb");
const Tokens = tokenDB(dbName);
const imagesDB = require("../database/imagesDb");
const Images = imagesDB(dbName);

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
const ApiError = require("../errors/ErrorObj");
const AsyncWrapper = require("../lib/asyncWrapper")
const createNewImage = require("../database/createNewImage");

module.exports.Signup = AsyncWrapper(async (req, res,next) => {
    let response = await createUser(req, User);
    const { token, options, code, user } = await tokenHelper.CreateAndSendToken(
      response.account,
      201,
      res,
      req
    );
     res.cookie("jwt", token,options);

    res.status(code).send({
      token,
      data:{
        user
      }
    }
    )
});


module.exports.resetPassword = AsyncWrapper(async (req, res, next) => {
    let result = await resetTokens(req.body.email, res, User, Tokens,next);
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
});


module.exports.signIn = AsyncWrapper(async (req, res, next) => {
    let queryResult = await findUser(User, req, next);
    let UserAuth = await unhashPassword(req, queryResult,next);
    if (UserAuth){
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
    next(ApiError.missingParams("Password incorrect, Kindly check"));
  } 
});

module.exports.resetConfirm = AsyncWrapper(async (req, res,next) => {

    const tokenExist = await RetrieveToken(req.body.userId, Tokens, res,next);
    const isValid = await VerifyToken(tokenExist, req.body.token, next);
    const userInfo = await HashandSavePassword(
      isValid,
      User,
      res,
      req.body.userId,
      req.body.password,
      next
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
});


module.exports.confirmUser = AsyncWrapper(async (req,res) =>{
    //this is the route the front end will always hit to see if user has been set
    //as any user with cookies that contain jwt signed by this server is auth'ed
    let currentUser;
        if (!req.cookies.jwt){
            currentUser = null
        }else{
          //get the jwt from the cookie
        const token = req.cookies.jwt;
        const decoded = await tokenHelper.decode(token)
        //get the user data associated with the Id and send it to the frontend
        currentUser = await User.findById(decoded.id)

        }
        res.status(200).send({currentUser})
});


module.exports.logUserOut = AsyncWrapper(async(req,res) =>{
  let currentUser=null
  res.clearCookie("jwt")
  res.status(200).send({
    status:"sucess",
    loggedOut:"true",
    currentUser:currentUser
  })
})


module.exports.saveImages = AsyncWrapper(async(req,res)=>{
  const clientJwt = req.cookies.jwt;
  const clientID = await tokenHelper.decode(clientJwt);
  const image = await createNewImage(req,Images,clientID.id);
  res.status(201).send(image);
})

module.exports.getImages = AsyncWrapper(async(req,res)=>{
  // TODO: Upon query, send the data to the front end from the images db
    const clientJwt = req.cookies.jwt;
    const clientID = await tokenHelper.decode(clientJwt);
    const images = await Images.find({clientID}).lean()
    res.status(200).send(images);
})

module.exports.User = User