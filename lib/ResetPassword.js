
/**
 * indexes the tokenDb and retrieves the token associated with the provided userID 
 * @param { String } userId Id associated with user requesting password reset 
 * @param { Object } tokendb MongoDB instance for the tokens
 * @returns { Promise } token associated with the password reset request
 */
const RetrieveToken =( userId, tokendb ) => {
    return new Promise(( resolve, reject ) => {
        tokendb.findOne( { userId : userId }, { token:1 }, ( err, token ) => {
            if (err){
                reject(err)
                return
             }
        resolve(token);
        })
    })
}

/**
 * verifies the authenticity of retrieved token
 * @param { String } token token generated for password reset, retrieved from tokens DB
 * @param { String } clientToken token provided from client 
 * @param { Function } next Express next function for call to next middleware 
 * @param { Class } bcrypt Bcrypt module instance
 * @param { Class } ApiError Instance of the custom ApiError
 * @returns { Promise} validity of the received token when compared against retrieved token 
 */
const VerifyToken =  ( token, clientToken, next, bcrypt, ApiError )=>{
    return new Promise(( resolve, reject ) => {
         if (!token) {
           next(
             ApiError.unAuthorized(
               "Invalid or Expired Tokens, Try to reset password again"
             )
           );
           return;
         }
        bcrypt.compare( clientToken, token.token, (err, tokenValidity) => {
          if (err) {
            reject(err);

            return;
          }
          resolve(tokenValidity);
        });
    })
}

/**
 * hashes new password if token is valid
 * @param { Boolean } isValid token validity result
 * @param { String } password new password provided for reset 
 * @param { Function } next Express next function for call to next middleware 
 * @param { Class } bcrypt Bcrypt module instance
 * @param { Class } ApiError Instance of the custom ApiError
 * @returns { Promise } hashed new password
 */
const HashNewPassword = ( password, isValid, next, bcrypt, ApiError ) => {
    return new Promise(( resolve, reject) => {
        if (!isValid) {
            next(ApiError.unAuthorized("Invalid or Expired Tokens, Try to reset password again"));
            return;
        }
        let salt = bcrypt.genSaltSync();
        bcrypt.hash(password, salt, ( err, hash ) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(hash);
    });
  });
};

/**
 * replaces/updates the old password with new hashed password
 * @param { Object } userdb MongoDB instance of the User DB
 * @param { Object} userId user ID 
 * @param { String } hash hashed new password 
 * @returns { Promise } updated Mongoose document
 */
const replacePassword = (  userdb, userId, hash )=>{
    return new Promise((resolve,reject)=>{
        userdb.findByIdAndUpdate(
            userId,
            { $set : {password:hash }},
            { new : true},
            (err, result) =>{
                if (err) {
                  reject(err);
                  return;
                }
                resolve(result);
            });
    });
}


/**
 * removes any token passed to it
 * @param { Object } token token DB object  
 * @returns { Promise } indicator of a successful token clean up
 */

const CleanUp = (token)=>{
    return new Promise ((resolve,reject) => {
        if (!token){
            resolve(false)
            return
        }
        token.deleteOne((err,success)=>{
            if (err){
                reject(err);
                return;
            }
            resolve(success)
        });
    });
}
module.exports = { 
    RetrieveToken,
    VerifyToken,
    HashNewPassword,
    replacePassword,
    CleanUp
}
