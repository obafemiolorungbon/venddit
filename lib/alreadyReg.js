module.exports = (db) => {
  return (req, res, next) => {
    let newUser = req.body.email;
    db.findOne({ email: newUser }, (err, response) => {
        if (err){
            console.log(`An error occured while trying to check if user exists ${err}`);
            return res.status(500).send({
                message:"Sorry, a problem occured while trying to register your account, try again later",
                err:err
            })
        }
        if (response) {
          return res.status(500).send({
              message:"Sorry, but this email is already taken"
          })
      }
      next();
});
  };
};
