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

    const user = mongoose.model("user", usersSchema);

    return user;

}