/**
 * states set of validations rules to be executed on incoming req.body 
 * @param { Function } check express validator check function
 * @returns validation rules
 */

const SignUpValidationRules = ( check ) => {
    return [
        check("businessName").isLength({ min: 3 }).withMessage("Business name is too short").escape(),
        check("productName", "Please enter a product name").trim().isLength({ min: 3 }).escape(),
        check("email").isEmail().withMessage("Kindly enter a valid email").normalizeEmail().escape(),
        check("password").trim().isLength({ min: 5 }).withMessage("Your password is too short, passwords should contain atleast 5 characters")
    ]
}

const SignInValidationRules = ( check ) => {
  return [
    check("email")
      .isEmail()
      .withMessage("Email is missing, Kindly enter a valid email")
      .normalizeEmail()
      .escape(),
    check("password")
      .trim()
      .isLength({ min: 1 })
      .withMessage(
        "Password Missing, Kindly Check and try again"
      ),
  ];
};

const resetPasswordValidationRules = ( check ) => {
  return [
    check("email")
      .isEmail()
      .withMessage("Kindly provide a valid email to reset password")
      .normalizeEmail()
      .escape()
  ];
};

const resetConfirmValidationRules = (check) => {
  return [
    check("password")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Password Missing, Kindly Check and try again"),
    check("token")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Token Missing, Kindly Check and try again"),
    check("userId")
      .trim()
      .isLength({ min: 1 })
      .withMessage("userId Missing, Kindly Check and try again"),
  ];
};


/**
 * performs/run actual validation set by check function on req.body
 * @param { Function } validationResult Express validator ValidationResult function 
 * @returns { Function } Express middleware responsible for performing validation on req.body
 * @param { class } ApiError custom express error class
 */

const validation =  ( validationResult, ApiError )  => {
    return (req, res, next) => {
        const errors = validationResult(req)
        .formatWith(({ msg, param }) => {
           return {
             field : param,
             reason : msg
           }
          });

        if (!errors.isEmpty()) {
            next(ApiError.missingParams({
              message:"Some fields are missing, Kindly check and try again",
              fields:errors.array()
            }))
            return
        }
        next();   
    }
}



module.exports = {
    SignUpValidationRules,
    SignInValidationRules,
    resetPasswordValidationRules,
    resetConfirmValidationRules,
    validation,
}