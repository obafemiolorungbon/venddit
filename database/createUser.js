module.exports = (req,model)=>{
    return new Promise((resolve,reject)=>{
        const newUser = new model({
          businessName: req.body.businessName,
          productName: req.body.productName,
          email: req.body.email,
          password: req.body.password,
        });
        
        newUser.save((err, newUser) => {
            if (err) {
                console.log(`An error occured when trying to save data ${err}`);
                reject({message:"Sorry, an error occured while trying to create account, try again later",error:err});
                return
            }
            console.log("Successfully created user")
            resolve({message:"Account registration successful", account:newUser});
        })
    })
}
