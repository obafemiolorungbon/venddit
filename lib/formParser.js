const multiparty = require("multiparty");
module.exports = (req, res, next) => {
  let form = new multiparty.Form();
  //instantiate a body property in the request body to store the form data
  req.body = {};
  form.parse(req, (err, fields)=> {
    if (err) {
      console.log("A problem occured while trying to parse incoming data");
      console.log(err)
      res.status(400).send({
        message: "Sorry, but your request was not completed",
        reasons: err,
      });
      return;
    }
    //if parsing succeeds, loop over the keys in the form data and poulate the body property  
    Object.keys(fields).forEach((property) => {
      req.body[property] = fields[property].toString();
    });
    next();
  });
};
