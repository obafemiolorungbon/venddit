const bcrypt=require('bcrypt');
const ApiError = require("../errors/ErrorObj");

const RetrieveToken =(userId,tokendb,res,next) => {
    return new Promise((resolve,reject)=>{
    //search through the token db to confirm the received token was created
    tokendb.findOne({ userId:userId }, (err,token)=>{
    if (err){
        reject(err)
        return
    }

    if (!token) {
      //send a failed response if token is missing
      next(
        ApiError.unAuthorized(
          "Invalid or Expired Tokens, Try to reset password again"
        )
      )
      return;
    }
    resolve(token);
})
    })
}


const VerifyToken =  (token, clientToken, next)=>{
    return new Promise((resolve,reject)=>{
    //compare the client side token with the token in the db, checking token validity
    bcrypt.compare(clientToken, token.token, (err,isValid)=>{
        if (err){
            next(err)
            return
        }
        resolve(isValid)
    });

    })
}

const HashandSavePassword = (isValid,userdb,res,userId,password,next)=>{
    return new Promise((resolve,reject)=>{
        if (!isValid) {
            next(ApiError.unAuthorized("Invalid or Expired Tokens, Try to reset password again"))
            return;
        }
        // if token passes all validity tests, then hash password and save in db
        let salt = bcrypt.genSaltSync()
        bcrypt.hash(password,
            salt, (err,hash)=>{
            if (err){
                reject(err)
                return
            }
            //replace existing password field with new hashed password
            userdb.updateOne({ _id: userId },{ $set: { password: hash } },{ new: true },(err,result)=>{
                if (err){
                reject(err)
                return
                }
            }
            );
        // find user by the ID and send to email messenger for password change success email
           userdb.findById({ _id: userId }, (err,result)=>{
               if (err){
                reject(err)
                return
                }
                //return the user db object if everthing goes fine
                resolve(result)

           });

    })
})
}


const CleanUp = (token)=>{
    return new Promise((resolve,reject)=>{
    token.deleteOne((err,success)=>{
        if (err){
             reject(err);
             return;
        }
        resolve(true)
    });
    })
}

module.exports = {RetrieveToken,VerifyToken,HashandSavePassword,CleanUp}