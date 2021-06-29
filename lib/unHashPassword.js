
/**
 * unhashes client password and compares to retrieved password
 * @param { Object } req express request object 
 * @param { String } hashedPassword user hashed password retrieved from db
 * @param { Function } next express middleware function
 * @param { Module } bcrypt bcrypt module instance
 * @param { class } ApiError custom express error class
 * @returns { Promise } match status of unhashedPassword and client side password 
 */

module.exports = ( req, hashedPassword, next, ApiError, bcrypt ) => {
    return new Promise((resolve, reject)=>{
        if (!req.body.password){
            next(ApiError.incorrectCredentials("Entries missing, check and try again"))
            return
        }
        let password = req.body.password;
        let retrievedPassword = hashedPassword.password
        bcrypt.compare(password, retrievedPassword, (err,result)=>{
            if (err){
                reject(err);
                return
            }
            resolve(result);
        });
    })
}