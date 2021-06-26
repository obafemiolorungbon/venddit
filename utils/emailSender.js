const handlebars = require("handlebars");//for creating email templates
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const emailConfig = require("./emailConfig")


// Function to send email to user requesting password reset
// uses 3LO to authenthicate gmail API service
const SendEmail = (email,payload,subject,templateUrl)=>{
    return new Promise((resolve,reject)=>{
        try{
            const transporter = emailConfig.transporter
            //template represents handlebars compiled for sending mails
            const template = fs.readFileSync(path.join(__dirname,templateUrl),"utf8") 
            const encodedData = handlebars.compile(template)
            const mailConfig = emailConfig.senderConfig(encodedData,payload,email,subject)
            transporter.sendMail(mailConfig(),(err, info)=>{
                if (err){
                    reject(err)
                    return
                }
                resolve({status:"success", result:info})

            })
        }catch(err){
            if(err){
                reject(err)
            }
        }
    })

}

module.exports = SendEmail