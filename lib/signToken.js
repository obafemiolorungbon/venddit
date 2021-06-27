const jwt = require("jsonwebtoken");
const jwtExpires =process.env.jwtExpires
const secretKey = process.env.SecretKey
 
/**
 * 
 * @param { String } id string representing user id 
 * @param { String } secret a secret string for signing token 
 * @param { String } expires a string representing timestamp, duration of jwt in days
 * @returns a valid signed jwt
 */
const SignJwt = (id, secret = secretKey, expires = jwtExpires) => {
  return jwt.sign({ id }, secret, {
    expiresIn: expires,
  });
};

/**
 * create token for a user, cookies the user response 
 * @param { String } user userId from database
 * @param { Object } req express request object
 * @param { String } secret string secret for signing token. Default env.secretKey
 * @param { String } expires a string representing timestamp, duration of jwt in days. Default 30d
 * @returns { Object } a destructured token representing a signed token,
 *  options for cookie
 */

module.exports.CreateAndSendToken = ( user, req, secret = secretKey , expires = jwtExpires)=>{
    return new Promise ((resolve,reject)=>{
        try{
            const token = SignJwt(user._id, secret, expires)
            //cookie expires after 30 days
            let expiryDate = new Date()
            expiryDate.setDate(expiryDate.getDate() + 30)
            const options = {
                expires: expiryDate,
                httpOnly: true,
                //set the secure variable based on the request header, wont work on 
                //http
               secure:true || req.secure || req.headers["x-forwarded-proto"] === "https",
                sameSite: "None",
            };
            resolve({ token, options })
        }catch(err){
            reject(err)
        }
})
}

/**
 * decodes the given token using the provided secret, 
 * @param { String } token 
 * @param { String } secret 
 * @returns the decoded token
 */
module.exports.decode = (token,secret)=>{
    return new Promise((resolve,reject)=>{
        try{
            const decodedData = jwt.verify(token, secret);
            resolve(decodedData)
        }
        catch(err){
            reject(err)
        }
    })
}

module.exports.SignJwtFunc = SignJwt