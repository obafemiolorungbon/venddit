const multiparty = require("multiparty");
const ApiError = require("../errors/ErrorObj");

module.exports = (req, res, next) => {
  let form = new multiparty.Form();
  //instantiate a body property in the request body to store the form data
  req.body = {};
  form.parse(req, (err, fields)=> {
    if (err) {
      next(ApiError.incorrectCredentials("Some fields are missing, check and try again"))
      return;
    }
    try{
      //if parsing succeeds, loop over the keys in the form data and poulate the body property  
       Object.keys(fields).forEach((property) => {
         req.body[property] = fields[property].toString();
       });
       next();

    }catch(err){
      next(err)
    }
  });
};
