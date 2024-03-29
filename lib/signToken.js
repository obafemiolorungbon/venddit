/**
 * signs the given string with the secret using jwt protocol
 * @param { Object } jwt a jwt module instance
 * @param { String } id string representing user id 
 * @param { String } secret a secret string for signing token. Default process.env.SecretKey 
 * @param { String } expires a string representing timestamp, duration of jwt in days.Default process.env.jwtExpires
 * @returns a valid signed jwt
 */
const SignJwt = ( jwt, id, secret , expires ) => {
  return jwt.sign({ id }, secret, {
    expiresIn: expires,
  });
};

/**
 * create token for a user, cookies the user response
 * @param { Object } jwt a jwt module instance 
 * @param { String } user userId from database
 * @param { Object } req express request object
 * @param { String } secret string secret for signing token. Default env.secretKey
 * @param { String } expires a string representing timestamp, duration of jwt in days. Default 30d
 * @returns { Object } a destructured token representing a signed token,
 *  options for cookie
 */

module.exports.CreateAndSendToken = ( jwt, user, req, secret = "sampleSecretKey" , expires = "30d")=>{
    return new Promise ((resolve,reject)=>{
        try{
            const token = SignJwt( jwt, user._id, secret, expires)
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
 * @param { String } token jwt token 
 * @param { String } secret jwt token secret
 * @param { Object } jwt a jwt module instance
 * @returns the decoded token
 */
module.exports.decode = ( token, secret, jwt )=>{
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