const bCrypt = require('bcryptjs');
const ApiError = require("../errors/ErrorObj");
module.exports = (req, hashed,next) => {
    return new Promise((resolve, reject)=>{
        if (!req.body.password){
            next(ApiError.incorrectCredentials("Entries missing, check and try again"))
            return
        }
        let password = req.body.password;
        let hashedPassword = hashed.user[0].password;
        bCrypt.compare(password, hashedPassword, (err,result)=>{
            if (err){
                reject(err);
                return
            }
            resolve(result);
        });
    })
}