const ApiError = require("../errors/ErrorObj");
/**
 * searches through the db with email to verify if user exist
 * @param { Object } db user database object 
 * @param { Object } req express request object 
 * @param { Function } next express middleware function 
 * @returns { Object } found user password, _id, businessName and email
 */
module.exports = (db, req, next) => {
  return new Promise((resolve, reject) => {
    db.findOne({ email: req.body.email }, "password businessName email _id", (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      if (!result) {
        next(ApiError.unAuthorized("Sorry, but there is no account associated with this email"))
        return; 
      }
      return resolve(result);
    });
  });
};

/**
 * searches through the db with id to verify if user exist
 * @param { Object } db user database object 
 * @param { Object } req express request object 
 * @param { Function } next express middleware function 
 * @returns { Object } found user password, _id, businessName and email
 */
module.exports.findUserByID = (db, req, next) => {
  return new Promise((resolve, reject) => {
    db.findOne(
      { email: req.body.userId },
      "password businessName email _id",
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        if (!result) {
          next(
            ApiError.unAuthorized(
              "Sorry, but there is no account associated with this email"
            )
          );
          return;
        }
        return resolve(result);
      }
    );
  });
};
