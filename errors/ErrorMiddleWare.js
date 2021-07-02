const ApiError = require("./ErrorObj")
const winston = require("winston")

/**
 * Express Error Handler
 * @param { Object } err Error Object 
 * @param { Object } req Express request Object
 * @param { Function } res express response function
 * @param { Object } next Express next function
 * @returns 
 */

module.exports.handleErrors = ( err, req, res, next ) =>{
    //check to ensure that error thrown was as a result of your custom error object, meaning
    //errror meesage can be safely returned. 
    if (err instanceof ApiError){
        res.status(err.code)
        res.send({
            status:"failed",
            message:err.message
        })
        return
    }
    //if it does not match, it means the error was thrown by nodejs and is unsafe to 
    //reveal the message to the user
    winston.error(err.message, err)
    console.log(err)
    console.log(err.message)
    res.status(500);
    res.send({
        status:"failed",
        message:"Sorry, an error occured. Try again Later"
    })
}