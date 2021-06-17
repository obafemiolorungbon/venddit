const ApiError = require("../errors/ErrorObj");
module.exports = (db, req, next) => {
  return new Promise((resolve, reject) => {
    db.find({ email: req.body.email }, "password", (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      if (result.length === 0) {
        next(ApiError.unAuthorized("Sorry, but this account does not exist"))
        return; 
      }
      return resolve({ message: "Successfully found user", user: result });
    });
  });
};
