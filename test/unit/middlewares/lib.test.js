// TODO: TEST ALL MIDDLEWARES IN LIB FOLDER
const formatTime = require("../../../lib/formatTime")
const SignToken = require("../../../lib/signToken")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const crypto = require("crypto");
const resetTokens = require("../../../lib/ResetTokens");
const asyncWrapper = require("../../../lib/asyncWrapper")
// const { expect } = require("chai");

describe("Test all functions in the lib folder",()=>{
    describe("Test all functions that are not middlewares",()=>{
        const req = jest.fn()
        const res = jest.fn()
        const next = jest.fn((err) => err.message);

        it("should return a string formated date and time", async ()=>{
            const date = new Date(Date.now());
            const currentTime =  date.toTimeString();
            const currentDate= date.toDateString();
            const result = await formatTime( date )

            expect(result).toMatchObject({"day":currentDate, time:currentTime})
            expect(result).toHaveProperty("day",currentDate)
            expect(result).toHaveProperty("time", currentTime);
        });

        it("should return a valid signed jwt", ()=>{
            let id = 1
            let secret = "testSecret"
            let expiresIn = "5d"
            const token = SignToken.SignJwtFunc( jwt, id, secret, expiresIn );
            expect(jwt.decode(token)).toMatchObject({"id":1});
            expect(token).not.toBeUndefined();
        });

        it("should decode a valid jwt", async ()=>{
            let id = "1";
            let secret = "testSecret";
            const token = jwt.sign(id,secret);
            let decodedToken = await SignToken.decode( token, secret, jwt )
            
            expect(decodedToken).not.toBeUndefined();
            expect(decodedToken).toEqual(id);
        });

        it("should reject with an error if invalid jwt is passed", async ()=>{
            let invalidToken = "invalidToken";
            let secret = "invalidSecret";
            await expect(SignToken.decode( invalidToken, secret, jwt ))
            .rejects
            .toBeInstanceOf(jwt.JsonWebTokenError)
        });

        it("should generate a 32 randombytes string ", async()=>{
            
            let randomBytes = await resetTokens.generateToken( crypto );
            expect(randomBytes).not.toBeUndefined()
            expect(randomBytes).not.toBeNull();
            expect(randomBytes).toHaveLength(64);
        });

        it("should hash data passed to it using crypto", async ()=>{
            let data = "1";
            let salt = 10;
            let hashedData = await resetTokens.hashData( data, salt, bcrypt);
            expect(hashedData).not.toBeNull();
            expect(hashedData).not.toBeUndefined();
        });

        it("should create a link with passed variables", async ()=>{
            let clientUrl = "http://sampleurl.com";
            let tokenObject = {
                userId : "1"
            }
            let unHashedToken = "randombytesofString";
            let link = `${clientUrl}/reset-page?token=${unHashedToken}&id=${tokenObject.userId}`;

            let result = await resetTokens.createResetLink(unHashedToken,tokenObject,clientUrl);

            expect(result).toEqual(link);
        });

        it("should return a function ", () =>{
            let handlerFunction = () => { }
            let returnedFunction = asyncWrapper(handlerFunction);
            expect(returnedFunction).toBeInstanceOf(Function);
        });

        it("should execute passed function", async ()=>{
            let handlerFunction = jest.fn();
            let returnedFunction = asyncWrapper(handlerFunction);
            await returnedFunction();
            expect(handlerFunction).toHaveBeenCalled();  
    });

    it("should pass caught error to the next handler", async () =>{
        let errorMessage = "An error Occured";
         let handlerFunction = jest.fn( ()=>{ throw new Error(errorMessage)});
         let returnedFunction = asyncWrapper(handlerFunction);
         await returnedFunction( req, res, next );
         expect(next).toHaveBeenCalled();
         expect(next).toHaveReturnedWith(errorMessage);
    });



});

});