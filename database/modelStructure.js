const mongoose = require('mongoose');

module.exports = (dbName) => {
    let remoteUrl = process.env.DB_URL
    //connect to active database
    mongoose.connect(remoteUrl||`mongodb://localhost/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true });

    //create schema
    const usersSchema = new mongoose.Schema({
        businessName: { type: String, required: ["Business name cannot be omitted", true] },
        productName: { type: String, required: ["Product name must be provided", true] },
        email: { type: String, required: ["Email is not provided", true] },
        password: { type: String, required: ["No password provided", true] },
    });
    //if the environment is test, use a different db to avoid polluting the db
    if (process.env.NODE_ENV == "test"){
        //add an extra path to the db if it is in test mode which will automatically
        // delete the entry after some time
        //this is to avoid a 500 error that might arise from duplicate emails
        usersSchema.add(
            {
                createdAt:
                {
                    type:Date,
                    default:Date.now,
                    expires:360
                }
            });
        let user = mongoose.model("test", usersSchema);
        return user;
    }else{
        let user = mongoose.model("user", usersSchema);
        return user;
    }
    

}