const bCrypt = require('bcryptjs');
module.exports = (req, hashed) => {
    return new Promise((resolve, reject)=>{
        let password = req.body.password;
        let hashedPassword = hashed.user[0].password;
        bCrypt.compare(password, hashedPassword, (err,result)=>{
            if (err){
                console.log(`An error occured while trying to unhash password`);
                reject({message:"An error occured while trying to unhash password", err:err});
                return
            }
            resolve({response:result});
        });
    })
}