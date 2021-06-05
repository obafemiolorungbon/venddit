const chai = require('chai');
const formatTime = require("../lib/formatTime")
const expect = chai.expect;

describe("time format",()=>{
    it("should be a function",()=>{
        expect(formatTime).to.be.instanceof(Function)
    })
    it("should return a string", async()=>{
        const { time, day } = await formatTime();
        expect(time).to.be.a("string");
        expect(day).to.be.a("string");
    })
})