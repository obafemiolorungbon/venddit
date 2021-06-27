/**
 * wraps the route handler in an try/catch block 
 * @param { Function } handler a function to execute in the try catch block
 * @returns { Function } route handler wrapped in try/catch block
 */

module.exports = ( handler ) =>{
    return async ( req, res, next ) => {
        try{
            //run the handler inside a try and catch
            await handler( req, res, next );
        }catch(err) {
            next(err)
        }
    }
}