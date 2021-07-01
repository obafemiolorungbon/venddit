/**
 * hashes user password with bcrypt
 * @param { Module } bcrypt bcrypt module instance
 * @param { class } ApiError custom express error class
 * @returns { Function } Express Middleware that hashes password
 */

module.exports = ( bcrypt, ApiError ) =>{
    return (req, res, next) => {
        if (!((req.body.password) && (req.body.email))){
            next(ApiError.incorrectCredentials("Details missing, check and try again"))
            return
        }
        bcrypt.hash(req.body.password, salt = 10, (err, result)=>{
            if (err){
                next(err)
                return
            }
            req.body.password = result;
            next()
        })
    }
}

