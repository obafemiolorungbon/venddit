const ApiError = require("./ErrorObj")

module.exports.handleErrors = (err,req,res,next) =>{
    //check to ensure that error thrown was as a result of your custom error object, meaning
    //errror meesage can be safely returned. 
    if (err instanceof ApiError){
        console.log(err)
        res.status(err.code)
        res.send({
            status:"failed",
            message:err.message
        })
        return
    }
    //if it does not match, it means the error was thrown by nodejs and is unsafe to 
    //reveal the message to the user
   console.log("server error")
    console.log(err)
    res.status(500);
    res.send({
        status:"failed",
        message:"Sorry, an error occured. Try again Later"
    })
}