
class ApiError extends Error{
    constructor(code,message){
        super()
        this.message = message;
        this.code = code;
        this.operational = true;

        Error.captureStackTrace(this, this.constructor)
    }

    //you can create custom static methods that will be triggered when you pass them to
    //the error handler from any middleware. A clean way to abstract everything

    static unAuthorized(msg){
        return new ApiError(401, msg);
    }

    static duplicateResourceError(msg){
        return new ApiError(409, msg)
    }
    
    static forbiddenUser(){
        return new ApiError(403, "User do not have the right permission for this resource");
    }

    static missingParams(msg){
        return new ApiError(422, msg)
    }

    static incorrectCredentials(msg){
        return new ApiError(401, msg)
    }

}

module.exports = ApiError;