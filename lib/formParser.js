/**
 * parses incoming form data and populate the requeest body;
 * @param { Function } formparser mutiparty module instance
 * @param { module } ApiError Custom Express Error class
 * @returns { Function } express middleware for processing incoming form data
 */

module.exports = (formparser, ApiError) => {
  return (req, res, next) => {
    let form = formparser({ multiples: true });
    //instantiate a body property in the request body to store the form data
    req.body = {};

    try {
      form.parse(req, (err, fields, files) => {
        if (err) {
          next(
            ApiError.incorrectCredentials(
              "Some fields are missing, Check and Try again"
            )
          );
          return;
        }
        Object.keys(fields).forEach((property) => {
          req.body[property] = fields[property].toString();
        });
        next();
      });
    } catch (err) {
      if (err) {
        next(
          ApiError.incorrectCredentials(
            "Some fields are missing, Check and Try again"
          )
        );
        return;
      }
    }
  };
};
