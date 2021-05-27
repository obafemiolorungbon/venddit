const mongoose = require("mongoose");

module.exports = (dbName)=>{
     let remoteUrl = process.env.TOKEN_DB_URL
    //connect to active database
    mongoose.connect(remoteUrl||`mongodb://localhost/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true });

    //create schema
    const tokenSchema = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, required: ["userId Missing", true], ref:"user" },
        token: { type: String, required: ["Token Missing", true] },
        createdAt: { type: Date, required: ["Date is missing", true], default:Date.now, expires:36000 },
    });

    const token = mongoose.model("Token", tokenSchema);

    return token;

}