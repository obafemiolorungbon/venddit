
/**
 * middleware to check if a user exist already, using the email
 * @param { Object } db MongoDb Database instance 
 * @param { class } ApiError Custom Express Error class
 * @returns { Function } the express next() function to next middleware
 */

module.exports = ( db, ApiError ) => {
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
