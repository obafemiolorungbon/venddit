const crypto = require('crypto');
const bcrypt = require("bcrypt");
const bcryptSalt = process.env.BCRYPT_SALT
const clientURL = process.env.CLIENT_URL
const ApiError = require("../errors/ErrorObj")

module.exports =(email,res,userdb,tokendb,next) => {
    return new Promise((resolve,reject)=>{
        userdb.find({ email : email },(err,result)=>{
          if (err){
            reject(err)
            return
          }
          if (result.length==0){
            next(ApiError.unAuthorized("Sorry, but this email does not exist"));
            return
          }
          // if user exist, find if there is an existing token, if there is, delete it
          let resetToken
          try{
            let token = tokendb.findOne({ userId: result[0]._id });
            if (token) {token.deleteOne();}
            //create a new token that will serve as reset tokens for email
            resetToken = crypto.randomBytes(32).toString("hex");
          }catch(err){
            reject(err)
            return
          }
          
          // hash reset tokens before adding to the db
          bcrypt.hash(resetToken, Number(bcryptSalt))
          .then(hash =>{
            new tokendb({
              userId: result[0]._id,
              token: hash,
              createdAt: Date.now(),
            }).save()
            // construct link for user based on the hash, link contains url 
            //encoded data to be submitted with the reset form
            const link = `${clientURL}/reset-page?token=${resetToken}&id=${result[0]._id}`;
            resolve({link:link,user:result[0]})
          }).catch(err=>{
            reject(err)
          })
      })
        });

};
