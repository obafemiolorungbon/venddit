module.exports = (db, req,res) => {
    return new Promise((resolve, reject)=>{
        db.find({ email: req.body.email }, "password", (err,result)=>{
            if (err){
                console.log(`An error occured while trying to find user ${err}`);
                reject({message:"Sorry, but we could not log you into your account right now, try again later", error:err});
                return
            }
            if (result.length === 0){
               return res.status(400).send({message:"Sorry, but this account does not exist"})
            }
            
            return resolve({message:"Successfully found user", user:result});

        })

    })

} 