// TODO: TEST ALL MIDDLEWARES IN LIB FOLDER
const formatTime = require("../../../lib/formatTime")
const SignToken = require("../../../lib/signToken")
const jwt = require("jsonwebtoken");
const asyncWrapper = require("../../../lib/asyncWrapper")
// const { expect } = require("chai");

describe("Test all functions in the lib folder",()=>{
    describe("Test all functions that are not middlewares",()=>{

        it("should return a string formated date and time", async ()=>{
            const date = new Date(Date.now());
            const currentTime =  date.toTimeString();
            const currentDate= date.toDateString();
            const result = await formatTime()

            expect(result).toMatchObject({"day":currentDate, time:currentTime})
            expect(result).toHaveProperty("day",currentDate)
            expect(result).toHaveProperty("time", currentTime);
        });

        it("should return a valid signed jwt", ()=>{
            let id = 1
            let secret = "testSecret"
            let expiresIn = "5d"
            const token = SignToken.SignJwtFunc(id,secret,expiresIn);
            expect(token).not.toBeUndefined();
        });

        it("should decode a valid jwt", async ()=>{
            let id = "1";
            let secret = "testSecret";
            const token = jwt.sign(id,secret);
            let decodedToken = await SignToken.decode(token,secret)
            
            expect(decodedToken).not.toBeUndefined();
            expect(decodedToken).toEqual(id);
        })

        it("should reject with an error if invalid jwt is passed", async ()=>{
            let invalidToken = "invalidToken";
            let secret = "invalidSecret";
            await expect(SignToken.decode(invalidToken,secret))
            .rejects
            .toBeInstanceOf(jwt.JsonWebTokenError)
        })

        it("should execute the handler passed",()=>{
            const handler = jest.fn()
        })
    });
});