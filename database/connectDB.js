let remoteUrl = process.env.DB_URL;
//connect to active database

module.exports = ( mongoose, dbName) =>{
    mongoose.connect(remoteUrl || `mongodb://localhost/${dbName}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    });
    return mongoose.connection
}
