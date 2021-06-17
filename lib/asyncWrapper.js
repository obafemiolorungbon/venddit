module.exports = (handler) =>{
    return async (req,res,next) => {
        try{
            //run the handler inside a try and catch
            await handler(req,res,next)
        }catch(err){
            next(err)
        }
    }
}