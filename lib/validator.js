const { check, validationResult } = require("express-validator");

const validationRules = () => {
    console.log("Now Setting rules to body");
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
        res.status(400).send({message:"There was error while trying to register",errors: errors.array() });
        return
    }
    next();

}


module.exports = {
    validationRules,
    validation,
}