module.exports  = (auth,req,res) => {
    return new Promise((resolve, reject)=>{
        let result = auth.response
        try{
            if (result){
            req.session.UserID = req.body.email;
            req.session.userName = "Dear Beautiful Hustler"
            resolve({message:"Login Succcessful, Now redirecting to Dashboard"})
            return
            }
            reject({message:"Password incorrect, check and try again later", status:"failed"})
        }catch(err){
            console.log(`An error occured while trying to add cookie ${err}`)
            reject({message:"There was a problem trying to log you in", reason:err})
        }

    })
}