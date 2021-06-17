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
                reject(err);
                return
            }
            resolve({message:"Account registration successful", account:newUser});
        })
    })
}
