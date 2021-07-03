const app = require("../../index")
const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userController = require("../../controllers/userController"); 

describe("Integration TESTS", ()=>{
     let server;
     beforeAll(() => {
         server = app.listen(3000, () => {});
    });

     afterAll((done) => {
       server.close(() => {
         app.db.close( (err) => {
        });
        app.job.stop();
        done();
        });
       },10);
    describe("GET ROUTES", ()=>{
        describe(" * REQUEST TO NON EXISTING ROUTES", ()=>{
            let invalidRequest = "/someInvalidRoute"   
            it("Should return a 404 Error status code", async ()=>{
               let res =  await request(app).get(invalidRequest);
               expect(res.statusCode).toEqual(404);
            });

            it("should return a json with appropriate Info", async ()=>{
                let res = await request(app).get(invalidRequest);
                expect(res.body).toMatchObject({ status:"failed" });
            });

        });

        describe("GET REQUEST TO USERS", ()=>{
            beforeEach(()=>{
                    userController.User.collection.insertOne({
                    businessName: "sample1",
                    email: "sampleEmail@gmail.com",
                    password: "samplePassword",
                    productName: "sampleProduct",
                });
            });

            afterEach(() =>{
                    userController.User.collection.deleteMany({ })
            })  
            let usersUrl = "/users"

            it("should return a 200 status code", async ()=>{
                let res = await request(app).get(usersUrl);
                expect(res.statusCode).toEqual(200);
            });

            it("should return a current user with null if no cookie is passed", async ()=>{
                let res = await request(app).get(usersUrl);
                expect(res.body).toMatchObject({currentUser:null});

            });
        });

    });


    describe(" POST ROUTES", ()=>{
         describe("POST REQUEST TO /USERS", () => {
           let businessName = "sample1";
           let email = "sampleemail@gmail.com";
           let password = "samplePassword";
           let productName = "sampleProduct";
           describe("/SIGNUP", () => {
             afterEach(() => {
               userController.User.collection.deleteMany({});
             });

             it("should return a 201 from a valid request", async () => {
               const res = await request(app)
                 .post("/users/signup")
                 .field("businessName", businessName)
                 .field("productName", productName)
                 .field("email", email)
                 .field("password", password);
               expect(res.statusCode).toEqual(201);
             });

             it.skip("should return a json object with registered user object", async () => {
               const res = await request(app)
                 .post("/users/signup")
                 .field("businessName", businessName)
                 .field("productName", productName)
                 .field("email", email)
                 .field("password", password);
               expect(res.body.data).toHaveProperty(
                 "response.message",
                 "Account registration successful"
               );
               expect(res.body.data).toHaveProperty(
                 "response.account.productName",
                 productName
               );
               expect(res.body.data).toHaveProperty(
                 "response.account.email",
                 email
               );
             });

             it("should return a 422 if request missing fields", async () => {
               const res = await request(app)
                 .post("/users/signup")
                 .field("email", email)
                 .field("password", password);
               expect(res.statusCode).toEqual(422);
             });
           });
           describe("/SIGNIN", () => {
             beforeEach(async () => {
               const password = await bcrypt.hash("samplePassword", 10);
               await userController.User.collection.insertOne({
                 businessName: "SampleEmail",
                 productName: "sampleProductName",
                 email: "sampleemail@gmail.com",
                 password: password,
               });
             });

             afterEach(() => {
               userController.User.collection.deleteMany({});
             });
             it("should return a 200 if credential pass authenthication", async () => {
               const res = await request(app)
                 .post("/users/signin")
                 .field("email", "sampleemail@gmail.com")
                 .field("password", "samplePassword");
               expect(res.statusCode).toEqual(200);
             });
             it("should return a success json object of credential pass", async () => {
               const res = await request(app)
                 .post("/users/signin")
                 .field("email", "sampleemail@gmail.com")
                 .field("password", "samplePassword");
               expect(res.body).toHaveProperty("status", "success");
             });
             it("should return a 401 if request fails authenthication", async () => {
               const res = await request(app)
                 .post("/users/signin")
                 .field("email", "sampleemail@gmail.com")
                 .field("password", "wrongPassword");
               expect(res.statusCode).toEqual(401);
             });
           });
         });
    });

    describe(" PUT ROUTES", ()=>{

    });

    describe("DELETE ROUTES",()=>{

    })

})