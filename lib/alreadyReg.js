const ApiError = require("../errors/ErrorObj");
/**
 * middleware to check if a user exist already, using the email
 * @param { Object } db MongoDb Database instance 
 * @returns { Function } the express next() function to next middleware
 */

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
