/**
 * create new user instance and save in the model
 * @param { Object } req express request object 
 * @param { Object } model MongoDb database Object 
 * @returns { Object } containing a success message as well as the new account
 * 
 */

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
                reject(err);
                return
            }
            resolve({message:"Account registration successful", account:newUser});
        })
    })
}
