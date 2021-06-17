const { check, validationResult } = require("express-validator");
const ApiError = require("../errors/ErrorObj");

const validationRules = () => {
    return [
        check("businessName").isLength({ min: 3 }).withMessage("Business name is too short").escape(),
        check("productName", "Please enter a product name").trim().isLength({ min: 3 }).escape(),
        check("email").isEmail().withMessage("Kindly enter a valid email").normalizeEmail().escape(),
        check("password").trim().isLength({ min: 5 }).withMessage("Your password is too short, passwords should contain atleast 5 characters")
    ]
}

const validation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(ApiError.missingParams("Some fields contain unsupported characters, check and try again.") )
        return
    }
    next();

}


module.exports = {
    validationRules,
    validation,
}