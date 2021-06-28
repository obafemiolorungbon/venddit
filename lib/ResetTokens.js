const defaultClientURL = process.env.CLIENT_URL

/**
 * generates randomBytes of size 32
 * @param { Class } crypto an instance of crypto module
 * @returns { Promise } string representation of 32 Bytes random string 
 */
const generateToken = ( crypto ) =>{
  return new Promise(( resolve, reject ) => {
      crypto.randomBytes(32, (err, buffer) => {
        if (err) {
          reject(err)
          return
        }
        resolve(buffer.toString("hex"));
      })
  })
}

/**
 * hashes data using bcrypt algorithm
 * @param { * } data data to be hashed 
 * @param { Number } salt number of salt to use in hashing.Default 10
 * @param { Class } bcrypt Bcrypt module instance
 * @returns { Promise }  hashed data
*/ 
const hashData = (data, salt = 10, bcrypt ) => {
  return new Promise( ( resolve, reject ) =>{
    bcrypt.hash( data, salt, ( err,encrypted ) => {
      if(err){
        reject(err);
        return;
      }
      resolve(encrypted)
    });
  });
}


/**
 * saves hashed token to tokenDb
 * @param { String } hashedToken hashed Token  
 * @param { Object } userID User Schema ObjectId
 * @param { Object } TokenDB tokenDB instance 
 * @returns { Promise } saved token object
 */
const saveResetToken = ( hashedToken, userID, TokenDB) => { 
  return new Promise(( resolve, reject) => {
    const newToken =  new TokenDB ({
      userId : userID,
      token : hashedToken
    })

    newToken.save(( err, savedTokenObject ) =>{
      if ( err ){
        reject(err);
        return;
      }
      resolve(savedTokenObject)
    })
  })
}

/**
 * creates link { URL } for password reset
 * @param { String } unHashedToken random 32 bytes data representation in string
 * @param { Object } tokenObject token object instance from tokenDB 
 * @param { String } clientURL string representing Url to client
 * @returns { Promise } string representation of URL { link } to reset password
 */

const createResetLink =  ( unHashedToken, tokenObject, clientURL = defaultClientURL,  ) =>{
  return new Promise(( resolve, reject )=>{
    try {
      let userID = tokenObject.userId; 
      const link = `${clientURL}/reset-page?token=${unHashedToken}&id=${userID}`;
      resolve(link);
    }catch(err){
      reject(err);
    };
  });
};


module.exports = {
  createResetLink,
  saveResetToken,
  hashData,
  generateToken
}
