const asyncWrapper = require("../lib/asyncWrapper");
const Images = require("../controllers/userController").Images;
const tokenHelper = require("../lib/signToken");
const jwt = require("jsonwebtoken");
const secret = process.env.secretKey;
module.exports.getProducts = asyncWrapper(async (req, res, next) => {
  const clientJwt = req.cookies.jwt;
  const clientID = await tokenHelper.decode(clientJwt, secret, jwt);
  let id = clientID.id;
  const images = await Images.find({ user: id });
  res.status(200).send(images);
});
