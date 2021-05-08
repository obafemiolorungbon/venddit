const bCrypt = require('bcryptjs');
module.exports = (req, res, next) => {
    let salt = bCrypt.genSaltSync();
    bCrypt.hash(req.body.password, salt, (err, result)=>{
        if (err){
            console.log(`An error occured while trying to hash password ${err}`)
            return res.status(500).send({
                message:"Sorry, but an error occured while trying to sign you up"
            })
        }
        req.body.password = result;
        next()
    })
}

