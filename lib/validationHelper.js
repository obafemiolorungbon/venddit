const { body, validationResult } = require("express-validator");

const validationRules = () => {
    return [
        body('businessName').isLength({ min: 3 }).withMessage("Business name is to short").escape(),
        body("productName").isEmpty().withMessage("Please enter a product name").escape(),
        body("email").isEmpty().isEmail().withMessage("Kindly enter a valid email").normalizeEmail().withMessage("Invalid email address").escape(),
        body("password").trim().isEmpty().withMessage("Password Can not be left Blank").isLength({ min: 5 }).withMessage("Your password is too short, passwords should contain atleast 5 characters")
    ]
}

const validation = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.render("signup-page", { errors: errors });
    }
    next();
}


module.exports = {
    validationRules,
    validation
}