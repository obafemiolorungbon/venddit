const crypto = require('crypto');
const bcrypt = require("bcrypt");
const bcryptSalt = process.env.BCRYPT_SALT
const clientURL = process.env.CLIENT_URL

module.exports =(email,res,userdb,tokendb) => {
    return new Promise((resolve,reject)=>{
        userdb.find({ email : email },(err,result)=>{
          if (err){
            console.log("An error occured while trying to find user for token");
            reject({message:"An error occured while trying to reset password, Try again"})
            return
          }
          if (result.length==0){
            res.status(400).send({message:"Sorry, but this email does not exist"})
            return
          }
          // if user exist, find if there is an existing token, if there is, delete it
          let token = tokendb.findOne({ userId: result[0]._id });
          if (token) {token.deleteOne();}
  
          //create a new token that will serve as reset tokens for email
          let resetToken = crypto.randomBytes(32).toString("hex");
          // hash reset tokens before adding to the db
          bcrypt.hash(resetToken, Number(bcryptSalt))
          .then(hash =>{
            new tokendb({
              userId: result[0]._id,
              token: hash,
              createdAt: Date.now(),
            }).save();
            // construct link for user based on the hash, link contains url 
            //encoded data to be submitted with the reset form
            const link = `${clientURL}/reset-page?token=${resetToken}&id=${result[0]._id}`;
            resolve({link:link,user:result[0]})
          }).catch(err=>{
            console.log(err)
            reject({message:"Sorry, cannot complete your request"})
          })
      })
        });

};
