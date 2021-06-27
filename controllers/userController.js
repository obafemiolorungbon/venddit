const createUser = require("../database/createUser");

//database imports
const dbStructure = require("../database/modelStructure");
const { dbName } = require("../lib/envConfig");
const User = dbStructure(dbName);
const tokenDB = require("../database/tokensDb");
const Tokens = tokenDB();
const imagesDB = require("../database/imagesDb");
const Images = imagesDB();

//other middlewares
const {
  RetrieveToken,
  VerifyToken,
  HashNewPassword,
  replacePassword,
  CleanUp,
} = require("../lib/ResetPassword");

const tokenHelper = require("../lib/signToken")
const formatTime = require("../lib/formatTime");
const sendEmail = require("../utils/emailSender");
const findUser = require("../database/findUser");
const unhashPassword = require("../lib/unHashPassword");
const {
  createResetLink,
  saveResetToken,
  hashData,
  generateToken
} = require("../lib/ResetTokens");
const ApiError = require("../errors/ErrorObj");
const AsyncWrapper = require("../lib/asyncWrapper")
const createNewImage = require("../database/createNewImage");

module.exports.Signup = AsyncWrapper(async (req, res, next) => {
    let response = await createUser(req, User);
    let createdUser = response.account
    const { token, options } = await tokenHelper.CreateAndSendToken(
     createdUser,
      req
    );
    res.cookie( "jwt", token , options );

    res.status(201).send({
      data:{
        response
      }
    }
    )
});


module.exports.resetPassword = AsyncWrapper(async (req, res, next) => {
    const userData = await findUser( User, req, next );
    const extractedToken = await RetrieveToken( userData._id, Tokens);
    let _ = await CleanUp(extractedToken);
    const newTokenHex = await generateToken();
    const hashedToken = await hashData(newTokenHex);
    const tokenObject = await saveResetToken( hashedToken, userData._id, Tokens );
    const resetLink = await createResetLink( newTokenHex, tokenObject );
    await sendEmail(
      userData.email,
      {
        name: userData.businessName,
        link: resetLink,
        email: userData.email,
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
    let userHashedPasswordAndId = await findUser(User, req, next );
    let UserAuth = await unhashPassword( req, userHashedPasswordAndId , next );
    if (UserAuth){
      const { 
        token, 
        options 
      } = await tokenHelper.CreateAndSendToken( userHashedPasswordAndId, req )
      res.cookie("jwt", token, options);
      res.status(200).send({
        status:"success"
      })
  }
  else{
    next(ApiError.missingParams("Password incorrect, Kindly check"));
  } 
});

module.exports.resetConfirm = AsyncWrapper(async (req, res,next) => {
    const extractedToken = await RetrieveToken ( req.body.userId, Tokens );
    const isTokenValid = await VerifyToken(
      extractedToken,
      req.body.token,
      next
    )
    const hashedNewPassword = await HashNewPassword ( req.body.password, isTokenValid, next );
    const updatedDoc = await replacePassword( User, req.body.userId, hashedNewPassword );
    const { time, day } = await formatTime();
    const { status } = await sendEmail(
      updatedDoc.email,
      {
        time: time,
        date: day,
      },
      "Password Reset Success",
      "./resetSuccess.handlebars"
    );
    await CleanUp(extractedToken);
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
        const secret = process.env.secretKey;
        const decoded = await tokenHelper.decode(token,secret)
        //get the user data associated with the Id and send it to the frontend
        currentUser = await User.findById(decoded.id)
        }
        res.status(200).send({currentUser})
});

module.exports.logUserOut = AsyncWrapper(async(req,res) =>{
  let currentUser=null
  res.clearCookie("jwt")
  res.status(200).send({
    status:"success",
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