const emailConfig = require("../utils/emailConfig");
const returnFormattedTime = require("../lib/formatTime");
/**
 * Sends log error reports to developer email using nodemailer, includes only 
 * 500 errrors, errors that cause process to exit otherwise sends the error report
 * every 72 hours
 * @param { String } pathToErrorLog
 */
module.exports.SendErrorLogsByEmail = async(pathToErrorLog)=>{
    const dateAndTime = await returnFormattedTime()
    return new Promise((resolve,reject)=>{
        const transporter = emailConfig.transporter
        let config = {
          from: process.env.FROM_EMAIL,
          to: process.env.DEVELOPER_EMAIL,
          subject: `Log Report for ${dateAndTime.day}`,
          text:`Hello Developer, 
          This is a scheduled report for the Error Logs of your App as of ${dateAndTime.day,dateAndTime.time}. Kindly find attached, the report on this email. Regards.`,
          attachments:{
              filename:`Vendit Error Log ${dateAndTime.day}`,
              path:pathToErrorLog,
          }
        };
        transporter.sendMail(config,(err,info)=>{
            if (err){
                reject(err)
                return
            }
            resolve({status:"success",emailInfo:info})
        })
    })
}

            
