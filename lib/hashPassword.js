const bCrypt = require('bcryptjs');
const ApiError = require("../errors/ErrorObj");

module.exports = (req, res, next) => {
    let salt = bCrypt.genSaltSync();
    if (!req.body.password && req.body.email){
        next(ApiError.incorrectCredentials("Details missing, check and try again"))
        return
    }
    bCrypt.hash(req.body.password, salt, (err, result)=>{
        if (err){
            next(err)
        }
        req.body.password = result;
        next()
    })
}

