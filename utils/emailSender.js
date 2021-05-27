const nodemailer = require("nodemailer");
const handlebars = require("handlebars");//for creating email templates
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv")

dotenv.config()

// Function to send email to user requesting password reset
// uses 3LO to authenthicate gmail API service
const SendEmail = (email,payload,subject,templateUrl)=>{
    try{
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: 465,
          secure:true,
          auth: {
            type:"OAuth2",
            user: process.env.EMAIL_USERNAME,
            accessToken: process.env.ACCESS_TOKENS,
            clientId: process.env.CLIENT_ID,
            clientSecret : process.env.CLIENT_SECRET,
            refreshToken : process.env.REFRESH_TOKENS 
          },
        });

        const template = fs.readFileSync(path.join(__dirname,templateUrl),"utf8") 
        const encodedData = handlebars.compile(template)

        const mailConfig = ()=>{
            return{
                from:process.env.FROM_EMAIL,
                to:email,
                subject:subject,
                html:encodedData(payload)
            }
        }
        transporter.sendMail(mailConfig(),(err, info)=>{
            if (err){
                console.log("Err")
                console.log(err)
                return err
            }
            console.log("Sent successfully")
        return({status:"success"})

        })
    }catch(err){
        if(err){
            console.log("Failed")
            return err
        }
    }
}

module.exports = SendEmail