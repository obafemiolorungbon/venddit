const ApiError = require("../errors/ErrorObj");
module.exports = (db) => {
  return (req, res, next) => {
    let newUser = req.body.email;
    db.findOne({ email: newUser }, (err, response) => {
      if (err) {
        next(err)
        return
      }
      if (response) {
        next(
          ApiError.duplicateResourceError(
            "Sorry, but this email is already taken"
          )
        );
        return 
      }
      next();
    });
  };
};
