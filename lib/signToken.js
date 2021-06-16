const jwt = require("jsonwebtoken");
const secret = process.env.secretKey
const jwtExpires =process.env.jwtExpires

const SignJwt = (id) => {
    return jwt.sign({id},secret, {
        expiresIn:jwtExpires
    })
}

module.exports.CreateAndSendToken = (user,code,res,req)=>{
    return new Promise ((resolve,reject)=>{
        try{
            const token = SignJwt(user._id)
            //cookie expires after 30 days
            let expiryDate = new Date()
            expiryDate.setDate(expiryDate.getDate() + 30)
            const options = {
                expires: expiryDate,
                httpOnly: true,
                //set the secure variable based on the request header, wont work on 
                //http
               secure: req.secure || req.headers["x-forwarded-proto"] === "https",
                sameSite: "None",
                //cookie the user
            };
            resolve({token,options,code,user})
        }catch(err){
            reject(err)
        }
})
}


module.exports.decode = (token)=>{
    return new Promise((resolve,reject)=>{
        try{
            resolve(jwt.verify(token,process.env.secretKey))
        }
        catch(err){
            console.log(err)
            reject(err)
        }
    })
}