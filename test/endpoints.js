const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const app = require("../index")
const supertest = require("supertest");

describe('home response working',()=>{
    it("should respond with a 200 to home '/' route", (done)=>{
        supertest(app)
        .get("/")
        .expect(200)
        .end(done)
    })

    it("should respond with json data",(done)=>{
        supertest(app)
        .get("/")
        .expect(200)
        .expect((res)=>{
            if (!typeof(res.body)==="object"){
                throw new Error("Response from home route was not an object");
            } 
        })
        .end(done)
    })
})

describe("Post route for registration working fine",()=>{
    let data = {
          email: "sam@gmail.com",
          businessName: "Sample Name",
          productName: "SampleProductName",
          password: "samplePassword",
    }

    it("receives a post request successfully", (done) => {
      supertest(app)
        .post("/users/signup")
        .field(data)
        .set('Accept', /multipart\/form-data/)
        .expect("Content-Type", /json/)
        .expect(201)
        .end((err,res)=>{
            if (err){
                return done(err);
            }
            assert.isObject(res.body,"response body was not object")
            assert.hasAnyKeys(res.body, ["message","account"],"response body did not contain required response")
            done()
        });
    })
})