
require("dotenv").config();

/**
 * compiles data into handlebars function 
 * @param { String } templateUrl file URL to template files 
 * @param { Module } fs the node fs module
 * @param { Module } handlebars the handlebars module
 * @param { Module } path the nodejs path module
 * @returns  { Promise } handlebars function that takes in context and compiles
 */

const compileTemplate = ( templateUrl, fs, handlebars, path ) => {
    return new Promise(( resolve, reject) =>{
        fs.readFile(path.join(__dirname, templateUrl), "utf8", ( err, data ) =>{
            if ( err ){
                reject(err);
                return
            }
            const compiledData = handlebars.compile(data);
            resolve(compiledData); 

        }); 
   })
};

/**
 * sends email to client using mail configurations
 * @param { Object } mailConfig Object containing config for nodemailer transporter
 * @param { Function } transporter nodemailer transporter function
 * @returns { Promise } function to send email to user
 */

const SendEmail = ( mailConfig, transporter ) => {
    return new Promise((resolve,reject)=>{
        transporter.sendMail( mailConfig() , (err, info) =>{
            if (err){
                reject(err);
                return
            }
            resolve("success");
        });
    });
}

module.exports = { SendEmail, compileTemplate }