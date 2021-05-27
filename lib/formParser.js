const multiparty = require("multiparty");
module.exports = (req, res, next) => {
  let form = new multiparty.Form();
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
    Object.keys(fields).forEach((property) => {
      req.body[property] = fields[property].toString();
    });
    next();
  });
};
