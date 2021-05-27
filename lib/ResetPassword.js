const bcrypt=require('bcrypt');


const RetrieveToken =(userId,tokendb,res) => {
    return new Promise((resolve,reject)=>{
    //search through the token db to confirm the received token was created
    tokendb.findOne({ userId:userId }, (err,token)=>{
    if (err){
        console.log(`An error occured while trying to get user token from Db`)
        reject({status:"failed", reason:`${err}`})
        return
    }
    if (!token) {
      //send a failed response if token is missing
      res
        .status(400)
        .send({
          status: "failed",
          message: "Invalid or Expired Tokens, Try to reset password again",
        });
      return;
    }
    resolve(token);
})
    })
}


const VerifyToken =  (token, clientToken)=>{
    return new Promise((resolve,reject)=>{
    //compare the client side token with the token in the db, checking token validity
    bcrypt.compare(clientToken, token.token, (err,isValid)=>{
        if (err){
            console.log(`An Error occured while trying to compare tokens ${err}`)
            reject({status:"failed", reason:`${err}`})
            return
        }
        resolve(isValid)
    });

    })
}

const HashandSavePassword = (isValid,userdb,res,userId,password)=>{
    return new Promise((resolve,reject)=>{
        if (!isValid) {
            res.status(400).send({
                status: "failed",
                message: "Invalid or Expired Tokens, Try to reset password again",
            });
            return;
        }
        // if token passes all validity tests, then hash password and save in db
        let salt = bcrypt.genSaltSync()
        bcrypt.hash(password,
            salt, (err,hash)=>{
            if (err){
               console.log(
                 `An error occured while trying to hash password`
               );
                reject({status:"failed", reason:`${err}`})
                return
            }
            //replace existing password field with new hashed password
            userdb.updateOne({ _id: userId },{ $set: { password: hash } },{ new: true },(err,result)=>{
                if (err){
                    console.log(
                 `An error occured while trying to save new password`
               );
                reject({status:"failed", reason:`${err}`})
                return
                }
            }
            );
        // find user by the ID and send to email messenger for password change success email
           userdb.findById({ _id: userId }, (err,result)=>{
               if (err){
                    console.log(
                 `An error occured while trying to find user by ID `
               );
                reject({status:"failed", reason:`${err}`})
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
             console.log(`An error occured while trying to delete token`);
             reject({ status: "failed", reason: `${err}` });
             return;
        }
        resolve(true)
    });
    })
}

module.exports = {RetrieveToken,VerifyToken,HashandSavePassword,CleanUp}